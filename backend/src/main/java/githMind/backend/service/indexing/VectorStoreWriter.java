package githMind.backend.service.indexing;

import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.Filter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;

import com.google.genai.errors.ApiException;

import githMind.backend.config.EmbeddingConfig;
import lombok.extern.slf4j.Slf4j;

/**
 * Write-side access to the vector store, with the retry behaviour embedding calls need.
 *
 * <p>Spring AI's auto-configured {@code RetryTemplate} only retries {@code TransientAiException}
 * and {@code ResourceAccessException}. The Google GenAI SDK signals a rate limit with its own
 * {@code ClientException} (HTTP 429), which that policy does not cover — so a single 429 would
 * otherwise propagate and fail an entire repository index. We classify and retry here instead,
 * which is why this class knows about {@link ApiException} directly.
 */
@Component
@Slf4j
public class VectorStoreWriter {

    private static final int TOO_MANY_REQUESTS = 429;
    private static final int MAX_CAUSE_DEPTH = 10;

    /** Gemini reports quota waits as RetryInfo, e.g. {@code "retryDelay": "17s"}. */
    private static final Pattern RETRY_DELAY =
            Pattern.compile("\"?retryDelay\"?\\s*:\\s*\"(\\d+(?:\\.\\d+)?)s\"");

    private final VectorStore vectorStore;
    private final EmbeddingRateLimiter rateLimiter;
    private final int maxAttempts;

    public VectorStoreWriter(
            @Qualifier(EmbeddingConfig.DOCUMENT_VECTOR_STORE) VectorStore vectorStore,
            EmbeddingRateLimiter rateLimiter,
            @Value("${app.indexing.embedding-max-attempts:5}") int maxAttempts) {
        this.vectorStore = vectorStore;
        this.rateLimiter = rateLimiter;
        this.maxAttempts = Math.max(1, maxAttempts);
    }

    /**
     * Embeds and stores {@code batch}, waiting out transient rate-limit and server errors.
     *
     * @return {@code true} when the batch was stored, {@code false} when it was dropped after
     *         exhausting retries — the caller should keep going and report the shortfall
     * @throws RuntimeException for non-transient failures (bad API key, unknown model, malformed
     *         request). Those fail identically on every batch, so they abort the run instead.
     */
    public boolean write(List<Document> batch) {
        if (batch.isEmpty()) {
            return true;
        }

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                vectorStore.add(batch);
                return true;
            } catch (RuntimeException ex) {
                if (!isTransient(ex)) {
                    throw ex;
                }
                if (attempt == maxAttempts) {
                    log.error("Dropping {} chunks after {} attempts: {}",
                            batch.size(), maxAttempts, ex.getMessage());
                    return false;
                }
                log.warn("Embedding batch of {} chunks failed (attempt {}/{}), backing off: {}",
                        batch.size(), attempt, maxAttempts, ex.getMessage());
                rateLimiter.backoff(attempt, retryAfter(ex));
            }
        }
        return false;
    }

    /** Steady-state pacing between batches, to approach the quota rather than trip it. */
    public void pause() {
        rateLimiter.pause();
    }

    public void delete(Filter.Expression filter) {
        vectorStore.delete(filter);
    }

    /**
     * Rate limits (429) and server errors (5xx) are worth waiting out. Other 4xx responses are
     * configuration problems that would fail the same way on every retry.
     */
    static boolean isTransient(Throwable error) {
        Throwable cause = error;
        for (int depth = 0; cause != null && depth < MAX_CAUSE_DEPTH; depth++) {
            if (cause instanceof ApiException api) {
                return api.code() == TOO_MANY_REQUESTS || api.code() >= 500;
            }
            if (cause instanceof ResourceAccessException || cause instanceof IOException) {
                return true;
            }
            if (cause.getCause() == cause) {
                break;
            }
            cause = cause.getCause();
        }
        return false;
    }

    /** The server-requested wait, when the error payload carried one. */
    static Duration retryAfter(Throwable error) {
        Throwable cause = error;
        for (int depth = 0; cause != null && depth < MAX_CAUSE_DEPTH; depth++) {
            String message = cause.getMessage();
            if (message != null) {
                Matcher matcher = RETRY_DELAY.matcher(message);
                if (matcher.find()) {
                    return Duration.ofMillis((long) (Double.parseDouble(matcher.group(1)) * 1000));
                }
            }
            if (cause.getCause() == cause) {
                break;
            }
            cause = cause.getCause();
        }
        return null;
    }
}
