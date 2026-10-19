package githMind.backend.service.indexing;

import java.time.Duration;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Paces embedding requests to stay under the Gemini per-minute quota, and computes retry
 * delays when the API pushes back.
 *
 * <p>The steady-state {@link #pause()} mirrors
 * {@link githMind.backend.service.github.GitHubRateLimiter}; {@link #backoff(int, Duration)}
 * adds exponential growth with jitter so two concurrent indexing jobs don't retry in lockstep.
 */
@Component
public class EmbeddingRateLimiter {

    private final long delayMs;
    private final long initialBackoffMs;
    private final long maxBackoffMs;
    private final double multiplier;

    public EmbeddingRateLimiter(
            @Value("${app.indexing.embedding-delay-ms:600}") long delayMs,
            @Value("${app.indexing.embedding-backoff-initial-ms:2000}") long initialBackoffMs,
            @Value("${app.indexing.embedding-backoff-max-ms:60000}") long maxBackoffMs,
            @Value("${app.indexing.embedding-backoff-multiplier:2.0}") double multiplier) {
        this.delayMs = Math.max(0, delayMs);
        this.initialBackoffMs = Math.max(1, initialBackoffMs);
        this.maxBackoffMs = Math.max(this.initialBackoffMs, maxBackoffMs);
        this.multiplier = Math.max(1.0, multiplier);
    }

    /** Steady-state pause between embedding batches. */
    public void pause() {
        sleep(delayMs);
    }

    /**
     * Sleeps before the next attempt. A server-supplied retry delay always wins; otherwise the
     * wait grows exponentially from the configured initial interval up to the configured ceiling.
     * Jitter is applied over the upper half of the window so the wait never collapses to zero.
     *
     * @param attempt    1-based number of the attempt that just failed
     * @param retryAfter delay requested by the server, or {@code null} if it did not say
     */
    public void backoff(int attempt, Duration retryAfter) {
        long ceiling = (retryAfter != null && retryAfter.toMillis() > 0)
                ? Math.min(retryAfter.toMillis(), maxBackoffMs)
                : exponentialCeiling(attempt);
        long floor = ceiling / 2;
        sleep(floor + ThreadLocalRandom.current().nextLong(ceiling - floor + 1));
    }

    private long exponentialCeiling(int attempt) {
        double grown = initialBackoffMs * Math.pow(multiplier, Math.max(0, attempt - 1));
        return (long) Math.min(maxBackoffMs, grown);
    }

    private void sleep(long millis) {
        if (millis <= 0) {
            return;
        }
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Interrupted while rate limiting embeddings", e);
        }
    }
}
