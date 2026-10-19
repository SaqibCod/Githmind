package githMind.backend.config;

import org.springframework.ai.embedding.BatchingStrategy;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.google.genai.embedding.GoogleGenAiEmbeddingConnectionDetails;
import org.springframework.ai.google.genai.text.GoogleGenAiTextEmbeddingModel;
import org.springframework.ai.google.genai.text.GoogleGenAiTextEmbeddingOptions;
import org.springframework.ai.google.genai.text.GoogleGenAiTextEmbeddingOptions.TaskType;
import org.springframework.ai.model.google.genai.autoconfigure.embedding.GoogleGenAiTextEmbeddingProperties;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.pgvector.PgVectorStore;
import org.springframework.ai.vectorstore.pgvector.autoconfigure.PgVectorStoreProperties;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.retry.RetryTemplate;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * Gemini embeddings are task-aware: the same text is embedded differently depending on whether
 * it is a stored document or a search query. Spring AI auto-configures a single
 * {@code EmbeddingModel}, which would force both halves of the RAG pipeline to share one task
 * type and degrade asymmetric search.
 *
 * <p>So we declare both models here — which makes the auto-configured one back off via its
 * {@code @ConditionalOnMissingBean} — and expose two {@link VectorStore} beans over the
 * <em>same</em> pgvector table:
 *
 * <ul>
 *   <li>{@link #DOCUMENT_VECTOR_STORE} embeds with {@code RETRIEVAL_DOCUMENT} and owns writes
 *       (and schema initialization). Marked {@code @Primary} so it also satisfies any
 *       unqualified injection.</li>
 *   <li>{@link #QUERY_VECTOR_STORE} embeds with {@code RETRIEVAL_QUERY} and is read-only.</li>
 * </ul>
 *
 * Both are configured from the same {@link PgVectorStoreProperties} so the table, dimensions,
 * and distance function cannot drift apart.
 */
@Configuration
public class EmbeddingConfig {

    public static final String DOCUMENT_VECTOR_STORE = "documentVectorStore";
    public static final String QUERY_VECTOR_STORE = "queryVectorStore";

    private static final String DOCUMENT_EMBEDDING_MODEL = "documentEmbeddingModel";
    private static final String QUERY_EMBEDDING_MODEL = "queryEmbeddingModel";

    @Bean(DOCUMENT_EMBEDDING_MODEL)
    @Primary
    GoogleGenAiTextEmbeddingModel documentEmbeddingModel(
            GoogleGenAiEmbeddingConnectionDetails connectionDetails,
            GoogleGenAiTextEmbeddingProperties properties,
            ObjectProvider<RetryTemplate> retryTemplate) {
        return embeddingModel(connectionDetails, properties, TaskType.RETRIEVAL_DOCUMENT, retryTemplate);
    }

    @Bean(QUERY_EMBEDDING_MODEL)
    GoogleGenAiTextEmbeddingModel queryEmbeddingModel(
            GoogleGenAiEmbeddingConnectionDetails connectionDetails,
            GoogleGenAiTextEmbeddingProperties properties,
            ObjectProvider<RetryTemplate> retryTemplate) {
        return embeddingModel(connectionDetails, properties, TaskType.RETRIEVAL_QUERY, retryTemplate);
    }

    private static GoogleGenAiTextEmbeddingModel embeddingModel(
            GoogleGenAiEmbeddingConnectionDetails connectionDetails,
            GoogleGenAiTextEmbeddingProperties properties,
            TaskType taskType,
            ObjectProvider<RetryTemplate> retryTemplate) {

        GoogleGenAiTextEmbeddingOptions options = GoogleGenAiTextEmbeddingOptions.builder()
                .from(properties.toOptions())
                .taskType(taskType)
                // The API only accepts a title alongside RETRIEVAL_DOCUMENT.
                .title(taskType == TaskType.RETRIEVAL_DOCUMENT ? properties.getTitle() : null)
                .build();

        RetryTemplate retry = retryTemplate.getIfAvailable();
        return retry != null
                ? new GoogleGenAiTextEmbeddingModel(connectionDetails, options, retry)
                : new GoogleGenAiTextEmbeddingModel(connectionDetails, options);
    }

    /** Write side: replaces the auto-configured store and is the one that creates the schema. */
    @Bean(DOCUMENT_VECTOR_STORE)
    @Primary
    PgVectorStore documentVectorStore(
            JdbcTemplate jdbcTemplate,
            @Qualifier(DOCUMENT_EMBEDDING_MODEL) EmbeddingModel documentEmbeddingModel,
            PgVectorStoreProperties properties,
            BatchingStrategy batchingStrategy) {
        return baseBuilder(jdbcTemplate, documentEmbeddingModel, properties, batchingStrategy)
                .initializeSchema(properties.isInitializeSchema())
                .build();
    }

    /** Read side: same table, query-tuned embeddings, never touches the schema. */
    @Bean(QUERY_VECTOR_STORE)
    VectorStore queryVectorStore(
            JdbcTemplate jdbcTemplate,
            @Qualifier(QUERY_EMBEDDING_MODEL) EmbeddingModel queryEmbeddingModel,
            PgVectorStoreProperties properties,
            BatchingStrategy batchingStrategy) {
        return baseBuilder(jdbcTemplate, queryEmbeddingModel, properties, batchingStrategy)
                .initializeSchema(false)
                .build();
    }

    private static PgVectorStore.PgVectorStoreBuilder baseBuilder(
            JdbcTemplate jdbcTemplate,
            EmbeddingModel embeddingModel,
            PgVectorStoreProperties properties,
            BatchingStrategy batchingStrategy) {
        return PgVectorStore.builder(jdbcTemplate, embeddingModel)
                .schemaName(properties.getSchemaName())
                .vectorTableName(properties.getTableName())
                .vectorTableValidationsEnabled(properties.isSchemaValidation())
                .dimensions(properties.getDimensions())
                .distanceType(properties.getDistanceType())
                .indexType(properties.getIndexType())
                .idType(properties.getIdType())
                .removeExistingVectorStoreTable(properties.isRemoveExistingVectorStoreTable())
                .maxDocumentBatchSize(properties.getMaxDocumentBatchSize())
                .batchingStrategy(batchingStrategy);
    }
}
