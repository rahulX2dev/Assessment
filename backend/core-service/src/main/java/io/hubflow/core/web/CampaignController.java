package io.hubflow.core.web;

import io.hubflow.core.common.ApiResponse;
import io.hubflow.core.common.PageMeta;
import io.hubflow.core.domain.CampaignStatus;
import io.hubflow.core.domain.TemplateApprovalStatus;
import io.hubflow.core.dto.CampaignDtos;
import io.hubflow.core.security.CurrentUser;
import io.hubflow.core.service.CampaignService;
import io.hubflow.core.service.TemplateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/campaigns")
@Tag(name = "Campaigns", description = "WhatsApp campaign creation, dispatch and delivery statistics")
public class CampaignController {

    private final CampaignService campaignService;
    private final TemplateService templateService;

    public CampaignController(CampaignService campaignService, TemplateService templateService) {
        this.campaignService = campaignService;
        this.templateService = templateService;
    }

    @GetMapping
    @Operation(summary = "List campaigns for the current tenant")
    public ApiResponse<List<CampaignDtos.CampaignResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) CampaignStatus status) {

        PageRequest pageable = PageRequest.of(
                Math.max(0, page),
                Math.min(Math.max(1, size), 100),
                Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<CampaignDtos.CampaignResponse> result =
                campaignService.list(CurrentUser.tenantId(), status, pageable);

        return ApiResponse.ok(result.getContent(), PageMeta.from(result));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MARKETER')")
    @Operation(summary = "Create a campaign against an approved template")
    public ResponseEntity<ApiResponse<CampaignDtos.CampaignResponse>> create(
            @Valid @RequestBody CampaignDtos.CampaignRequest request) {

        CampaignDtos.CampaignResponse created =
                campaignService.create(CurrentUser.tenantId(), CurrentUser.userId(), request);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(created));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Fetch a single campaign")
    public ApiResponse<CampaignDtos.CampaignResponse> get(@PathVariable String id) {
        return ApiResponse.ok(campaignService.get(CurrentUser.tenantId(), id));
    }

    @PostMapping("/{id}/dispatch")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MARKETER')")
    @Operation(summary = "Queue a campaign for the high throughput dispatch engine")
    public ResponseEntity<ApiResponse<CampaignDtos.DispatchResponse>> dispatch(
            @PathVariable String id, @RequestBody(required = false) CampaignDtos.DispatchRequest request) {

        CampaignDtos.DispatchResponse response =
                campaignService.dispatch(CurrentUser.tenantId(), id, request);

        return ResponseEntity.accepted().body(ApiResponse.ok(response));
    }

    @GetMapping("/{id}/stats")
    @Operation(summary = "Delivery funnel for a campaign")
    public ApiResponse<CampaignDtos.CampaignStats> stats(@PathVariable String id) {
        return ApiResponse.ok(campaignService.stats(CurrentUser.tenantId(), id));
    }

    @GetMapping("/templates")
    @Operation(summary = "List message templates and their Meta approval status")
    public ApiResponse<List<CampaignDtos.TemplateResponse>> templates() {
        return ApiResponse.ok(templateService.list(CurrentUser.tenantId()));
    }

    @PostMapping("/templates")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MARKETER')")
    @Operation(summary = "Submit a new message template for approval")
    public ResponseEntity<ApiResponse<CampaignDtos.TemplateResponse>> createTemplate(
            @Valid @RequestBody CampaignDtos.TemplateRequest request) {

        CampaignDtos.TemplateResponse created = templateService.create(CurrentUser.tenantId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(created));
    }

    @PatchMapping("/templates/{id}/approval")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    @Operation(summary = "Record the approval decision returned by Meta")
    public ApiResponse<CampaignDtos.TemplateResponse> updateApproval(
            @PathVariable String id, @RequestParam TemplateApprovalStatus status) {

        return ApiResponse.ok(templateService.updateApproval(CurrentUser.tenantId(), id, status));
    }
}
