package githMind.backend.security;

import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;

import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import githMind.backend.service.UserService;
import githMind.backend.entity.User;
/**
 * GithubOauth2UserService
 */
@Service
public class GithubOauth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserService userService;

    /** Stateless helper that performs the actual GitHub user-info call. */
    private final DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();

    /**
     * Written out instead of using {@code @RequiredArgsConstructor}: Lombok correctly skips the
     * initialized {@code delegate} field, but the IDE's Lombok handling does not, and reports a
     * phantom "blank final field may not have been initialized" error on the annotation.
     */
    public GithubOauth2UserService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

       OAuth2User githubUser = delegate.loadUser(userRequest); // Load user information from GitHub
       String accessToken = userRequest.getAccessToken().getTokenValue();
       String scopes = userRequest.getAccessToken().getScopes() != null
                ? String.join(",", userRequest.getAccessToken().getScopes())
                : "read:user,repo";// Scope

        User user = userService.upsertFromGitHub(githubUser.getAttributes(), accessToken, scopes);
         return new AppUserPrincipal(user , githubUser.getAttributes());
    }
}