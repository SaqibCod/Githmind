package githMind.backend.service.ai;

import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.beans.factory.annotation.Qualifier;

import githMind.backend.config.EmbeddingConfig;

@Service
public class CodeContextRetriver {
    private static final String NO_MATCHES = "(no matching code chunks found)";

    private final VectorStore vectorStore;
    private final CitationMapper citationMapper;

    /**
     * Reads through the query-tuned store so the question is embedded with RETRIEVAL_QUERY,
     * matching how Gemini expects asymmetric search to be done. Written out rather than generated
     * by Lombok because {@code @RequiredArgsConstructor} would drop the {@code @Qualifier}.
     */
    public CodeContextRetriver(
            @Qualifier(EmbeddingConfig.QUERY_VECTOR_STORE) VectorStore vectorStore,
            CitationMapper citationMapper) {
        this.vectorStore = vectorStore;
        this.citationMapper = citationMapper;
    }

     public RetrievedContext retrieve(UUID repositoryId, String question) {
        var filter = new FilterExpressionBuilder()
                .eq(RagSettings.METADATA_REPO_ID, repositoryId.toString())
                .build();

        var search = SearchRequest.builder()
                .query(question)
                .topK(RagSettings.TOP_K_CHUNKS)
                .filterExpression(filter)
                .build();

        var documents = vectorStore.similaritySearch(search);

        var citations = documents.stream()
                .map(citationMapper::fromDocument)
                .distinct()
                .toList();

        var contextText = documents.stream()
                .map(Document::getText)
                .collect(Collectors.joining("\n\n---\n\n"));

        if (contextText.isBlank()) {
            contextText = NO_MATCHES;
        }

        return new RetrievedContext(citations, contextText);
    }
}
