package io.hubflow.core.dto;

import io.hubflow.core.domain.LifecycleStage;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public final class CrmDtos {

    private CrmDtos() {
    }

    public record ContactRequest(
            @NotBlank @Size(max = 120) String fullName,
            @NotBlank @Pattern(regexp = "^\\+?[1-9]\\d{9,14}$") String phone,
            @Email @Size(max = 180) String email,
            @Size(max = 160) String companyName,
            LifecycleStage lifecycleStage,
            String ownerId,
            @Size(max = 240) String tags,
            @Size(max = 60) String source) {
    }

    public record ContactResponse(
            String id,
            String fullName,
            String phone,
            String email,
            String companyName,
            LifecycleStage lifecycleStage,
            String ownerId,
            Integer leadScore,
            String tags,
            String source,
            boolean optedOut,
            Instant lastContactedAt,
            Instant createdAt) {
    }

    public record DealRequest(
            @NotBlank String contactId,
            @NotBlank @Size(max = 160) String title,
            @NotNull @PositiveOrZero BigDecimal value,
            LifecycleStage stage,
            String ownerId,
            LocalDate expectedCloseDate) {
    }

    public record DealResponse(
            String id,
            String contactId,
            String title,
            BigDecimal value,
            String currency,
            LifecycleStage stage,
            String ownerId,
            LocalDate expectedCloseDate,
            Integer winProbability,
            Instant createdAt) {
    }

    public record StageChangeRequest(@NotNull LifecycleStage stage, String lostReason) {
    }

    public record PipelineStage(LifecycleStage stage, long dealCount, BigDecimal totalValue) {
    }
}
