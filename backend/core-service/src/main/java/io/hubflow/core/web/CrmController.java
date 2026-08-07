package io.hubflow.core.web;

import io.hubflow.core.common.ApiResponse;
import io.hubflow.core.common.PageMeta;
import io.hubflow.core.domain.LifecycleStage;
import io.hubflow.core.dto.CrmDtos;
import io.hubflow.core.security.CurrentUser;
import io.hubflow.core.service.ContactService;
import io.hubflow.core.service.DealService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/crm")
@Tag(name = "CRM", description = "Contact and deal pipeline management")
public class CrmController {

    private static final int MAX_PAGE_SIZE = 100;

    private final ContactService contactService;
    private final DealService dealService;

    public CrmController(ContactService contactService, DealService dealService) {
        this.contactService = contactService;
        this.dealService = dealService;
    }

    @GetMapping("/contacts")
    @Operation(summary = "Search contacts with pagination, stage and owner filters")
    public ApiResponse<List<CrmDtos.ContactResponse>> listContacts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) LifecycleStage stage,
            @RequestParam(required = false) String ownerId) {

        PageRequest pageable = PageRequest.of(
                Math.max(0, page),
                Math.min(Math.max(1, size), MAX_PAGE_SIZE),
                Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<CrmDtos.ContactResponse> result =
                contactService.search(CurrentUser.tenantId(), search, stage, ownerId, pageable);

        return ApiResponse.ok(result.getContent(), PageMeta.from(result));
    }

    @PostMapping("/contacts")
    @Operation(summary = "Create a contact")
    public ResponseEntity<ApiResponse<CrmDtos.ContactResponse>> createContact(
            @Valid @RequestBody CrmDtos.ContactRequest request) {

        CrmDtos.ContactResponse created = contactService.create(CurrentUser.tenantId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(created));
    }

    @GetMapping("/contacts/{id}")
    @Operation(summary = "Fetch a single contact")
    public ApiResponse<CrmDtos.ContactResponse> getContact(@PathVariable String id) {
        return ApiResponse.ok(contactService.get(CurrentUser.tenantId(), id));
    }

    @PutMapping("/contacts/{id}")
    @Operation(summary = "Replace a contact")
    public ApiResponse<CrmDtos.ContactResponse> updateContact(
            @PathVariable String id, @Valid @RequestBody CrmDtos.ContactRequest request) {

        return ApiResponse.ok(contactService.update(CurrentUser.tenantId(), id, request));
    }

    @DeleteMapping("/contacts/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    @Operation(summary = "Delete a contact, restricted to admins and owners")
    public ResponseEntity<Void> deleteContact(@PathVariable String id) {
        contactService.delete(CurrentUser.tenantId(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/deals")
    @Operation(summary = "List deals filtered by pipeline stage")
    public ApiResponse<List<CrmDtos.DealResponse>> listDeals(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) LifecycleStage stage) {

        PageRequest pageable = PageRequest.of(
                Math.max(0, page),
                Math.min(Math.max(1, size), MAX_PAGE_SIZE),
                Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<CrmDtos.DealResponse> result = dealService.list(CurrentUser.tenantId(), stage, pageable);
        return ApiResponse.ok(result.getContent(), PageMeta.from(result));
    }

    @PostMapping("/deals")
    @Operation(summary = "Create a deal against an existing contact")
    public ResponseEntity<ApiResponse<CrmDtos.DealResponse>> createDeal(
            @Valid @RequestBody CrmDtos.DealRequest request) {

        CrmDtos.DealResponse created = dealService.create(CurrentUser.tenantId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(created));
    }

    @PatchMapping("/deals/{id}/stage")
    @Operation(summary = "Move a deal to a new pipeline stage")
    public ApiResponse<CrmDtos.DealResponse> changeStage(
            @PathVariable String id, @Valid @RequestBody CrmDtos.StageChangeRequest request) {

        return ApiResponse.ok(dealService.changeStage(CurrentUser.tenantId(), id, request));
    }

    @GetMapping("/pipeline")
    @Operation(summary = "Aggregate deal count and value by stage")
    public ApiResponse<List<CrmDtos.PipelineStage>> pipeline() {
        return ApiResponse.ok(dealService.pipeline(CurrentUser.tenantId()));
    }
}
