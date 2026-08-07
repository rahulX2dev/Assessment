package io.hubflow.core.service;

import io.hubflow.core.common.exception.ApiException;
import io.hubflow.core.config.WhatsAppProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class WhatsAppService {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppService.class);

    private final WhatsAppProperties properties;
    private final RestClient restClient;

    public WhatsAppService(WhatsAppProperties properties, RestClient.Builder builder) {
        this.properties = properties;
        this.restClient = builder.baseUrl(properties.baseUrl()).build();
    }

    public String sendTemplate(String phone, String templateName, String language, List<String> bodyParams) {
        Map<String, Object> payload = Map.of(
                "messaging_product", "whatsapp",
                "recipient_type", "individual",
                "to", normalise(phone),
                "type", "template",
                "template", Map.of(
                        "name", templateName,
                        "language", Map.of("code", language),
                        "components", List.of(Map.of(
                                "type", "body",
                                "parameters", bodyParams.stream()
                                        .map(value -> Map.of("type", "text", "text", value))
                                        .toList()))));

        return dispatch(payload, templateName);
    }

    public String sendOtp(String phone, String code) {
        return sendTemplate(phone, properties.otpTemplateName(), "en", List.of(code));
    }

    public String sendText(String phone, String body) {
        Map<String, Object> payload = Map.of(
                "messaging_product", "whatsapp",
                "recipient_type", "individual",
                "to", normalise(phone),
                "type", "text",
                "text", Map.of("preview_url", false, "body", body));

        return dispatch(payload, "session_text");
    }

    private String dispatch(Map<String, Object> payload, String label) {
        if (!properties.enabled()) {
            String simulatedId = "wamid.simulated." + UUID.randomUUID();
            log.info("whatsapp disabled, simulating send template={} messageId={}", label, simulatedId);
            return simulatedId;
        }

        String path = "/%s/%s/messages".formatted(properties.apiVersion(), properties.phoneNumberId());

        try {
            Map<String, Object> response = restClient.post()
                    .uri(path)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + properties.accessToken())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(Map.class);

            List<?> messages = response == null ? List.of() : (List<?>) response.getOrDefault("messages", List.of());

            if (messages.isEmpty()) {
                throw ApiException.upstream("WhatsApp accepted the request but returned no message id");
            }

            Object id = ((Map<?, ?>) messages.get(0)).get("id");
            log.info("whatsapp message accepted template={} messageId={}", label, id);
            return String.valueOf(id);
        } catch (RestClientException ex) {
            log.error("whatsapp send failed template={}", label, ex);
            throw ApiException.upstream("Could not reach the WhatsApp Business API: " + ex.getMessage());
        }
    }

    public boolean isVerifyTokenValid(String token) {
        return properties.verifyToken() != null && properties.verifyToken().equals(token);
    }

    private String normalise(String phone) {
        return phone.replaceAll("[^0-9]", "");
    }

    public Duration timeout() {
        return Duration.ofSeconds(properties.timeoutSeconds());
    }
}
