package githMind.backend.service.ai;

import java.util.List;

import githMind.backend.dto.CitationDto;

public record RetrievedContext(
    List<CitationDto> citation,
    String contextText
) {
    
}
