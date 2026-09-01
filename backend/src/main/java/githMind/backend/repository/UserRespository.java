package githMind.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import githMind.backend.entity.User;

public interface UserRespository extends JpaRepository<User, UUID>{
    Optional<User> findByGithubId(Long githubId);
}
