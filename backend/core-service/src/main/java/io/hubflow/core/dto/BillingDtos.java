package io.hubflow.core.dto;

import io.hubflow.core.domain.BillingCycle;
import io.hubflow.core.domain.InvoiceStatus;
import io.hubflow.core.domain.SubscriptionStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public final class BillingDtos {

    private BillingDtos() {
    }

    public record PlanResponse(
            String id,
            String name,
            String description,
            BigDecimal monthly,
            BigDecimal yearly,
            String currency,
            Integer conversationAllowance,
            Integer seats,
            boolean featured,
            List<String> features) {
    }

    public record SubscribeRequest(
            @NotBlank String planId,
            @NotNull BillingCycle billingCycle) {
    }

    public record SubscriptionResponse(
            String id,
            String planId,
            String planName,
            BillingCycle billingCycle,
            SubscriptionStatus status,
            Instant currentPeriodStart,
            Instant currentPeriodEnd,
            boolean cancelAtPeriodEnd,
            int conversationsUsed,
            Integer conversationAllowance) {
    }

    public record InvoiceResponse(
            String id,
            String invoiceNumber,
            BigDecimal platformAmount,
            BigDecimal conversationAmount,
            BigDecimal taxAmount,
            BigDecimal totalAmount,
            String currency,
            InvoiceStatus status,
            LocalDate issueDate,
            LocalDate dueDate,
            Instant paidAt) {
    }

    public record UsageResponse(
            String tenantId,
            int conversationsUsed,
            Integer conversationAllowance,
            int contactCount,
            long campaignsSent,
            BigDecimal estimatedConversationCost) {
    }
}
