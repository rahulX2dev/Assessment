package io.hubflow.core.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "hubflow.security")
public record SecurityProperties(
        String jwtSecret,
        String jwtIssuer,
        long accessTokenMinutes,
        long refreshTokenDays,
        String internalToken,
        List<String> allowedOrigins,
        int maxFailedLogins,
        long lockoutMinutes) {

    public SecurityProperties {
        jwtIssuer = jwtIssuer == null ? "hubflow-core" : jwtIssuer;
        accessTokenMinutes = accessTokenMinutes <= 0 ? 15 : accessTokenMinutes;
        refreshTokenDays = refreshTokenDays <= 0 ? 30 : refreshTokenDays;
        maxFailedLogins = maxFailedLogins <= 0 ? 5 : maxFailedLogins;
        lockoutMinutes = lockoutMinutes <= 0 ? 15 : lockoutMinutes;
        allowedOrigins = allowedOrigins == null ? List.of("http://localhost:5173") : allowedOrigins;
    }
}
