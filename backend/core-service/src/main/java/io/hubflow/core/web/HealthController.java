package io.hubflow.core.web;

import io.hubflow.core.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@Tag(name = "Health", description = "Liveness probe consumed by the API gateway and Kubernetes")
public class HealthController {

    private static final Instant STARTED_AT = Instant.now();

    @GetMapping("/health")
    @Operation(summary = "Liveness probe")
    public ApiResponse<Map<String, Object>> health() {
        return ApiResponse.ok(Map.of(
                "status", "up",
                "service", "core-service",
                "version", "1.0.0",
                "startedAt", STARTED_AT.toString()));
    }
}
