package githMind.backend.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import githMind.backend.repository.UserRespository;
import org.springframework.transaction.annotation.Transactional;
import githMind.backend.entity.User;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {
    
    private final UserRespository userRespository;

    @Transactional(readOnly=true)
    public User requiredById(UUID uuid){
        return userRespository.findById(uuid).orElseThrow(() -> new IllegalArgumentException("user not found"));
    }

}
