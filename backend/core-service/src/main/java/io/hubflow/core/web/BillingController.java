package io.hubflow.core.web;

import io.hubflow.core.common.ApiResponse;
import io.hubflow.core.common.PageMeta;
import io.hubflow.core.dto.BillingDtos;
import io.hubflow.core.security.CurrentUser;
import io.hubflow.core.service.BillingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/billing")
@Tag(name = "Billing", description = "Plan catalogue, subscriptions, invoices and usage")
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping("/plans")
    @Operation(summary = "Public plan catalogue used by the marketing site")
    public ApiResponse<List<BillingDtos.PlanResponse>> plans() {
        return ApiResponse.ok(billingService.plans());
    }

    @GetMapping("/subscription")
    @Operation(summary = "Current subscription for the tenant")
    public ApiResponse<BillingDtos.SubscriptionResponse> subscription() {
        return ApiResponse.ok(billingService.currentSubscription(CurrentUser.tenantId()));
    }

    @PostMapping("/subscription")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'FINANCE')")
    @Operation(summary = "Start or change the tenant subscription and raise an invoice")
    public ApiResponse<BillingDtos.SubscriptionResponse> subscribe(
            @Valid @RequestBody BillingDtos.SubscribeRequest request) {

        return ApiResponse.ok(billingService.subscribe(CurrentUser.tenantId(), request));
    }

    @GetMapping("/invoices")
    @Operation(summary = "Paginated invoice history")
    public ApiResponse<List<BillingDtos.InvoiceResponse>> invoices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        PageRequest pageable = PageRequest.of(
                Math.max(0, page),
                Math.min(Math.max(1, size), 100),
                Sort.by(Sort.Direction.DESC, "issueDate"));

        Page<BillingDtos.InvoiceResponse> result = billingService.invoices(CurrentUser.tenantId(), pageable);
        return ApiResponse.ok(result.getContent(), PageMeta.from(result));
    }

    @GetMapping("/invoices/{id}")
    @Operation(summary = "Fetch a single invoice")
    public ApiResponse<BillingDtos.InvoiceResponse> invoice(@PathVariable String id) {
        return ApiResponse.ok(billingService.invoice(CurrentUser.tenantId(), id));
    }

    @GetMapping("/usage")
    @Operation(summary = "Conversation usage against the plan allowance")
    public ApiResponse<BillingDtos.UsageResponse> usage() {
        return ApiResponse.ok(billingService.usage(CurrentUser.tenantId()));
    }
}
