package io.hubflow.core.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "hubflow.whatsapp")
public record WhatsAppProperties(
        boolean enabled,
        String apiVersion,
        String baseUrl,
        String phoneNumberId,
        String accessToken,
        String verifyToken,
        String otpTemplateName,
        int timeoutSeconds) {

    public WhatsAppProperties {
        apiVersion = apiVersion == null ? "v21.0" : apiVersion;
        baseUrl = baseUrl == null ? "https://graph.facebook.com" : baseUrl;
        otpTemplateName = otpTemplateName == null ? "hubflow_otp" : otpTemplateName;
        timeoutSeconds = timeoutSeconds <= 0 ? 10 : timeoutSeconds;
    }
}
