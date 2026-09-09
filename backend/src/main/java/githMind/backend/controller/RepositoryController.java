package githMind.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import githMind.backend.security.CurrentUser;
import githMind.backend.service.RepositoryService;
import githMind.backend.dto.IndexStatusResponse;
import githMind.backend.dto.RepositoryResponse;
import githMind.backend.entity.Repository;
import githMind.backend.entity.User;
import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping("/api/repos") 
@RequiredArgsConstructor 
public class RepositoryController {
    private final CurrentUser currentUser;
    private final RepositoryService repoService;

    
    @GetMapping 
    public List<RepositoryResponse> list(
               @RequestParam(name = "refresh", defaultValue = "true") boolean refresh
    ){
        UUID id = currentUser.require().getId();
        if (refresh) {
            return repoService.syncAndListRepos(id);
        }
        return repoService.listStored(id);
    }

    @GetMapping("/{id}")
    public RepositoryResponse get(UUID repoId){
        UUID userId = currentUser.require().getId();
        return repoService.toResponse(repoService.requireOwned(userId, repoId));
    }

    // @PostMapping("/{id}/index")
    // public ResponseEntity<RepositoryResponse> index(@PathVariable UUID id) {
    //     UUID userId = currentUser.require().getId();
    //     Repository repo = indexingService.startIndexing(id, userId);
    //     indexingService.indexAsync(id, userId);
    //     return ResponseEntity.status(HttpStatus.ACCEPTED).body(repoService.toResponse(repo));
    // }

    @GetMapping("/{id}/status")
    public IndexStatusResponse status(@PathVariable UUID id) {
        UUID userId = currentUser.require().getId();
        return repoService.status(id, userId);
    }
}
