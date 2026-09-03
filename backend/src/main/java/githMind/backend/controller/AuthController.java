package githMind.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import githMind.backend.dto.UserResponse;
import githMind.backend.security.AppUserPrincipal;
import githMind.backend.security.CurrentUser;
import githMind.backend.entity.User;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    CurrentUser currentUser;
    
    @GetMapping("/login-url")
    public Map<String, String> loginUrl() {
        return Map.of("url", "/oauth2/authorization/github");
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {
        AppUserPrincipal principal = currentUser.require();
        User user = principal.getUser();
        return ResponseEntity.ok(new UserResponse(
            user.getId(),
            user.getGithubId(),
            user.getGithubUsername(),
            user.getDisplayName(),
            user.getAvatarUrl()
        ));
    }
}
