package io.hubflow.core.service;

import io.hubflow.core.common.exception.ApiException;
import io.hubflow.core.domain.OtpPurpose;
import io.hubflow.core.domain.OtpToken;
import io.hubflow.core.dto.AuthDtos;
import io.hubflow.core.repository.OtpTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private static final int VALIDITY_SECONDS = 300;
    private static final int MAX_ATTEMPTS = 5;
    private static final int MAX_REQUESTS_PER_HOUR = 5;

    private final OtpTokenRepository otpTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final WhatsAppService whatsAppService;
    private final SecureRandom random = new SecureRandom();
    private final boolean exposeCodeInResponse;

    public OtpService(
            OtpTokenRepository otpTokenRepository,
            PasswordEncoder passwordEncoder,
            WhatsAppService whatsAppService,
            @Value("${hubflow.otp.expose-code:false}") boolean exposeCodeInResponse) {

        this.otpTokenRepository = otpTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.whatsAppService = whatsAppService;
        this.exposeCodeInResponse = exposeCodeInResponse;
    }

    @Transactional
    public AuthDtos.OtpSendResponse send(String phone, OtpPurpose purpose) {
        long recent = otpTokenRepository.countRecentRequests(phone, Instant.now().minus(1, ChronoUnit.HOURS));

        if (recent >= MAX_REQUESTS_PER_HOUR) {
            throw ApiException.tooManyRequests(
                    "Too many OTP requests for this number. Try again in an hour.");
        }

        String code = String.format("%06d", random.nextInt(1_000_000));

        OtpToken token = new OtpToken();
        token.setPhone(phone);
        token.setPurpose(purpose);
        token.setCodeHash(passwordEncoder.encode(code));
        token.setExpiresAt(Instant.now().plusSeconds(VALIDITY_SECONDS));
        otpTokenRepository.save(token);

        whatsAppService.sendOtp(phone, code);
        log.info("otp issued for {} purpose={}", maskPhone(phone), purpose);

        return new AuthDtos.OtpSendResponse(
                maskPhone(phone),
                token.getExpiresAt(),
                VALIDITY_SECONDS,
                exposeCodeInResponse ? code : null);
    }

    @Transactional
    public void verify(String phone, String code, OtpPurpose purpose) {
        OtpToken token = otpTokenRepository
                .findFirstByPhoneAndPurposeAndConsumedAtIsNullOrderByCreatedAtDesc(phone, purpose)
                .orElseThrow(() -> ApiException.badRequest("No pending OTP for this number"));

        if (token.isExpired()) {
            throw ApiException.badRequest("This OTP has expired. Request a new one.");
        }

        if (token.getAttemptsUsed() >= MAX_ATTEMPTS) {
            throw ApiException.tooManyRequests("Too many incorrect attempts. Request a new OTP.");
        }

        token.setAttemptsUsed(token.getAttemptsUsed() + 1);

        if (!passwordEncoder.matches(code, token.getCodeHash())) {
            otpTokenRepository.save(token);
            throw ApiException.badRequest("The OTP entered is incorrect");
        }

        token.setConsumedAt(Instant.now());
        otpTokenRepository.save(token);
        log.info("otp verified for {} purpose={}", maskPhone(phone), purpose);
    }

    @Scheduled(cron = "0 15 * * * *")
    @Transactional
    public void purgeExpired() {
        int removed = otpTokenRepository.deleteExpired(Instant.now().minus(1, ChronoUnit.DAYS));
        if (removed > 0) {
            log.info("purged {} expired otp tokens", removed);
        }
    }

    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) {
            return "****";
        }
        return "*".repeat(phone.length() - 4) + phone.substring(phone.length() - 4);
    }
}
