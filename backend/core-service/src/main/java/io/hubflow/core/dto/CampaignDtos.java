package io.hubflow.core.dto;

import io.hubflow.core.domain.CampaignStatus;
import io.hubflow.core.domain.TemplateApprovalStatus;
import io.hubflow.core.domain.TemplateCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.Map;

public final class CampaignDtos {

    private CampaignDtos() {
    }

    public record CampaignRequest(
            @NotBlank @Size(max = 160) String name,
            @NotBlank String templateId,
            @Size(max = 500) String segmentFilter,
            Instant scheduledAt) {
    }

    public record CampaignResponse(
            String id,
            String name,
            String templateId,
            CampaignStatus status,
            Instant scheduledAt,
            Instant startedAt,
            Instant completedAt,
            int totalRecipients,
            int sentCount,
            int deliveredCount,
            int readCount,
            int failedCount,
            Instant createdAt) {
    }

    public record DispatchRequest(boolean sendImmediately, Instant scheduledAt) {
    }

    public record DispatchResponse(
            String campaignId,
            CampaignStatus status,
            int queuedRecipients,
            int skippedOptOuts,
            String queueBatchId) {
    }

    public record CampaignStats(
            String campaignId,
            int totalRecipients,
            Map<String, Long> byState,
            double deliveryRate,
            double readRate) {
    }

    public record TemplateRequest(
            @NotBlank @Size(max = 120) String name,
            @NotBlank @Size(max = 12) String language,
            TemplateCategory category,
            @NotBlank String bodyText,
            @Size(max = 200) String headerText,
            @Size(max = 200) String footerText) {
    }

    public record TemplateResponse(
            String id,
            String name,
            String language,
            TemplateCategory category,
            String bodyText,
            String headerText,
            String footerText,
            TemplateApprovalStatus approvalStatus,
            String qualityRating) {
    }
}
