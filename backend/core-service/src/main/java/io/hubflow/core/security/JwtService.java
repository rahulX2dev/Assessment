package io.hubflow.core.security;

import io.hubflow.core.config.SecurityProperties;
import io.hubflow.core.domain.Role;
import io.hubflow.core.domain.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class JwtService {

    private final SecurityProperties properties;
    private final SecretKey signingKey;
    private final SecureRandom random = new SecureRandom();

    public JwtService(SecurityProperties properties) {
        this.properties = properties;
        this.signingKey = Keys.hmacShaKeyFor(properties.jwtSecret().getBytes(StandardCharsets.UTF_8));
    }

    public String issueAccessToken(User user) {
        Instant now = Instant.now();
        Instant expiry = now.plus(properties.accessTokenMinutes(), ChronoUnit.MINUTES);

        List<String> roles = user.getRoles().stream().map(Role::name).toList();

        return Jwts.builder()
                .subject(user.getId())
                .issuer(properties.jwtIssuer())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .claim("tenantId", user.getTenant().getId())
                .claim("email", user.getEmail())
                .claim("roles", roles)
                .signWith(signingKey)
                .compact();
    }

    public AuthenticatedUser parse(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(signingKey)
                    .requireIssuer(properties.jwtIssuer())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            Object rawRoles = claims.get("roles");
            Set<String> roles = rawRoles instanceof List<?> list
                    ? list.stream().map(String::valueOf).collect(Collectors.toSet())
                    : Set.of();

            return new AuthenticatedUser(
                    claims.getSubject(),
                    claims.get("tenantId", String.class),
                    claims.get("email", String.class),
                    roles);
        } catch (JwtException | IllegalArgumentException ex) {
            return null;
        }
    }

    public String generateRefreshToken() {
        byte[] buffer = new byte[48];
        random.nextBytes(buffer);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(buffer);
    }

    public String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashed);
        } catch (Exception ex) {
            throw new IllegalStateException("SHA-256 is not available on this JVM", ex);
        }
    }

    public Instant refreshTokenExpiry() {
        return Instant.now().plus(properties.refreshTokenDays(), ChronoUnit.DAYS);
    }

    public long accessTokenSeconds() {
        return properties.accessTokenMinutes() * 60;
    }
}
