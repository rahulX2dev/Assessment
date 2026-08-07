package io.hubflow.core.dto;

import io.hubflow.core.domain.OtpPurpose;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.Set;

public final class AuthDtos {

    private AuthDtos() {
    }

    public record RegisterRequest(
            @NotBlank @Size(max = 120) String fullName,
            @NotBlank @Email @Size(max = 180) String email,
            @NotBlank @Pattern(regexp = "^\\+?[1-9]\\d{9,14}$",
                    message = "must be a valid international phone number") String phone,
            @NotBlank @Size(min = 10, max = 72,
                    message = "must be between 10 and 72 characters") String password,
            @NotBlank @Size(max = 160) String companyName) {
    }

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password) {
    }

    public record RefreshRequest(@NotBlank String refreshToken) {
    }

    public record OtpSendRequest(
            @NotBlank @Pattern(regexp = "^\\+?[1-9]\\d{9,14}$") String phone,
            @NotNull OtpPurpose purpose) {
    }

    public record OtpVerifyRequest(
            @NotBlank @Pattern(regexp = "^\\+?[1-9]\\d{9,14}$") String phone,
            @NotBlank @Pattern(regexp = "^\\d{6}$", message = "must be a 6 digit code") String code,
            @NotNull OtpPurpose purpose) {
    }

    public record OtpSendResponse(String phone, Instant expiresAt, int validitySeconds, String devCode) {
    }

    public record AuthTokens(
            String accessToken,
            String refreshToken,
            String tokenType,
            long expiresInSeconds,
            UserProfile user) {
    }

    public record UserProfile(
            String id,
            String fullName,
            String email,
            String phone,
            String tenantId,
            String tenantName,
            Set<String> roles,
            boolean phoneVerified,
            Instant lastLoginAt) {
    }
}
