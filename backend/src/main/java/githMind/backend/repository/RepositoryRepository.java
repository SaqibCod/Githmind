package githMind.backend.repository;

import java.util.List;
import java.util.UUID;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import githMind.backend.entity.Repository;

public interface RepositoryRepository extends JpaRepository<Repository, UUID> {

    List<Repository> findByUserIdOrderByFullNameAsc(UUID userId);
    Optional<Repository> findByUserIdAndGithubRepoId(UUID userId, Long githubRepoId);
    Optional<Repository> findByIdAndUserId(UUID id, UUID userId);
}
