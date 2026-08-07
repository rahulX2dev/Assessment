package io.hubflow.core.service;

import io.hubflow.core.common.exception.ApiException;
import io.hubflow.core.config.SecurityProperties;
import io.hubflow.core.domain.OtpPurpose;
import io.hubflow.core.domain.RefreshToken;
import io.hubflow.core.domain.Role;
import io.hubflow.core.domain.Tenant;
import io.hubflow.core.domain.TenantStatus;
import io.hubflow.core.domain.User;
import io.hubflow.core.dto.AuthDtos;
import io.hubflow.core.repository.RefreshTokenRepository;
import io.hubflow.core.repository.TenantRepository;
import io.hubflow.core.repository.UserRepository;
import io.hubflow.core.security.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.EnumSet;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OtpService otpService;
    private final SecurityProperties securityProperties;

    public AuthService(
            UserRepository userRepository,
            TenantRepository tenantRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            OtpService otpService,
            SecurityProperties securityProperties) {

        this.userRepository = userRepository;
        this.tenantRepository = tenantRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.otpService = otpService;
        this.securityProperties = securityProperties;
    }

    @Transactional
    public AuthDtos.AuthTokens register(AuthDtos.RegisterRequest request, String userAgent) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw ApiException.conflict("An account already exists for this email address");
        }

        Tenant tenant = new Tenant();
        tenant.setName(request.companyName());
        tenant.setSlug(uniqueSlug(request.companyName()));
        tenant.setStatus(TenantStatus.TRIAL);
        tenantRepository.save(tenant);

        User user = new User();
        user.setTenant(tenant);
        user.setFullName(request.fullName());
        user.setEmail(request.email().toLowerCase(Locale.ROOT));
        user.setPhone(request.phone());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRoles(EnumSet.of(Role.OWNER, Role.ADMIN));
        userRepository.save(user);

        otpService.send(request.phone(), OtpPurpose.PHONE_VERIFICATION);
        log.info("tenant {} registered with owner {}", tenant.getSlug(), user.getId());

        return issueTokens(user, userAgent);
    }

    @Transactional
    public AuthDtos.AuthTokens login(AuthDtos.LoginRequest request, String userAgent) {
        User user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> ApiException.unauthorized("Email or password is incorrect"));

        if (user.isLocked()) {
            throw ApiException.forbidden(
                    "Account is temporarily locked after repeated failed sign-in attempts");
        }

        if (!user.isEnabled()) {
            throw ApiException.forbidden("This account has been disabled");
        }

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            registerFailedAttempt(user);
            throw ApiException.unauthorized("Email or password is incorrect");
        }

        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        return issueTokens(user, userAgent);
    }

    @Transactional
    public AuthDtos.AuthTokens refresh(String refreshToken, String userAgent) {
        String hash = jwtService.hashToken(refreshToken);

        RefreshToken stored = refreshTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> ApiException.unauthorized("Refresh token is not recognised"));

        if (!stored.isActive()) {
            refreshTokenRepository.revokeAllForUser(stored.getUserId(), Instant.now());
            throw ApiException.unauthorized("Refresh token is expired or already used");
        }

        User user = userRepository.findById(stored.getUserId())
                .orElseThrow(() -> ApiException.unauthorized("Account no longer exists"));

        stored.setRevokedAt(Instant.now());
        refreshTokenRepository.save(stored);

        return issueTokens(user, userAgent);
    }

    @Transactional
    public void logout(String userId) {
        int revoked = refreshTokenRepository.revokeAllForUser(userId, Instant.now());
        log.info("revoked {} refresh tokens for user {}", revoked, userId);
    }

    @Transactional
    public void verifyPhone(String phone, String code, OtpPurpose purpose) {
        otpService.verify(phone, code, purpose);

        userRepository.findByPhone(phone).ifPresent(user -> {
            user.setPhoneVerified(true);
            userRepository.save(user);
        });
    }

    @Transactional(readOnly = true)
    public AuthDtos.UserProfile profile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User", userId));
        return toProfile(user);
    }

    private void registerFailedAttempt(User user) {
        int attempts = user.getFailedLoginAttempts() + 1;
        user.setFailedLoginAttempts(attempts);

        if (attempts >= securityProperties.maxFailedLogins()) {
            user.setLockedUntil(Instant.now().plus(securityProperties.lockoutMinutes(), ChronoUnit.MINUTES));
            log.warn("account {} locked after {} failed attempts", user.getId(), attempts);
        }

        userRepository.save(user);
    }

    private AuthDtos.AuthTokens issueTokens(User user, String userAgent) {
        String accessToken = jwtService.issueAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken();

        RefreshToken record = new RefreshToken();
        record.setUserId(user.getId());
        record.setTokenHash(jwtService.hashToken(refreshToken));
        record.setExpiresAt(jwtService.refreshTokenExpiry());
        record.setUserAgent(userAgent);
        refreshTokenRepository.save(record);

        return new AuthDtos.AuthTokens(
                accessToken,
                refreshToken,
                "Bearer",
                jwtService.accessTokenSeconds(),
                toProfile(user));
    }

    private AuthDtos.UserProfile toProfile(User user) {
        return new AuthDtos.UserProfile(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getTenant().getId(),
                user.getTenant().getName(),
                user.getRoles().stream().map(Role::name).collect(Collectors.toSet()),
                user.isPhoneVerified(),
                user.getLastLoginAt());
    }

    private String uniqueSlug(String companyName) {
        String base = companyName.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");

        if (base.isBlank()) {
            base = "tenant";
        }

        String candidate = base.length() > 60 ? base.substring(0, 60) : base;
        int suffix = 1;

        while (tenantRepository.existsBySlug(candidate)) {
            candidate = "%s-%d".formatted(base, suffix++);
        }

        return candidate;
    }

    @Scheduled(cron = "0 30 3 * * *")
    @Transactional
    public void purgeExpiredRefreshTokens() {
        int removed = refreshTokenRepository.deleteExpired(Instant.now());
        if (removed > 0) {
            log.info("purged {} expired refresh tokens", removed);
        }
    }
}
