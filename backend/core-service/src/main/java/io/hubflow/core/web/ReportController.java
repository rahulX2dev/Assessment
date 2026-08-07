package io.hubflow.core.web;

import io.hubflow.core.common.ApiResponse;
import io.hubflow.core.security.CurrentUser;
import io.hubflow.core.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports")
@Tag(name = "Reports", description = "Cross-module aggregates for the dashboard")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/summary")
    @Operation(summary = "Contact, pipeline, campaign, billing and headcount summary")
    public ApiResponse<Map<String, Object>> summary() {
        return ApiResponse.ok(reportService.summary(CurrentUser.tenantId()));
    }
}
