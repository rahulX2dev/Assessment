package io.hubflow.core.web;

import io.hubflow.core.common.ApiResponse;
import io.hubflow.core.common.exception.ApiException;
import io.hubflow.core.domain.DeliveryState;
import io.hubflow.core.service.CampaignService;
import io.hubflow.core.service.WhatsAppService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/webhooks")
@Tag(name = "Webhooks", description = "Inbound delivery receipts from the WhatsApp Cloud API")
public class WebhookController {

    private static final Logger log = LoggerFactory.getLogger(WebhookController.class);

    private final WhatsAppService whatsAppService;
    private final CampaignService campaignService;

    public WebhookController(WhatsAppService whatsAppService, CampaignService campaignService) {
        this.whatsAppService = whatsAppService;
        this.campaignService = campaignService;
    }

    @GetMapping("/whatsapp")
    @Operation(summary = "Meta webhook subscription handshake")
    public ResponseEntity<String> verify(
            @RequestParam("hub.mode") String mode,
            @RequestParam("hub.verify_token") String verifyToken,
            @RequestParam("hub.challenge") String challenge) {

        if (!"subscribe".equals(mode) || !whatsAppService.isVerifyTokenValid(verifyToken)) {
            throw ApiException.forbidden("Webhook verification token does not match");
        }

        return ResponseEntity.ok(challenge);
    }

    @PostMapping("/whatsapp")
    @Operation(summary = "Consume delivery and read receipts")
    @SuppressWarnings("unchecked")
    public ApiResponse<Map<String, Object>> receive(@RequestBody Map<String, Object> payload) {
        int processed = 0;

        try {
            List<Map<String, Object>> entries =
                    (List<Map<String, Object>>) payload.getOrDefault("entry", List.of());

            for (Map<String, Object> entry : entries) {
                List<Map<String, Object>> changes =
                        (List<Map<String, Object>>) entry.getOrDefault("changes", List.of());

                for (Map<String, Object> change : changes) {
                    Map<String, Object> value = (Map<String, Object>) change.getOrDefault("value", Map.of());
                    List<Map<String, Object>> statuses =
                            (List<Map<String, Object>>) value.getOrDefault("statuses", List.of());

                    for (Map<String, Object> status : statuses) {
                        String messageId = String.valueOf(status.get("id"));
                        DeliveryState state = mapState(String.valueOf(status.get("status")));
                        String reason = extractError(status);

                        campaignService.applyDeliveryUpdate(messageId, state, reason);
                        processed++;
                    }
                }
            }
        } catch (ClassCastException ex) {
            log.warn("unexpected webhook payload shape", ex);
            throw ApiException.badRequest("Webhook payload did not match the expected structure");
        }

        return ApiResponse.ok(Map.of("processed", processed));
    }

    @SuppressWarnings("unchecked")
    private String extractError(Map<String, Object> status) {
        Object errors = status.get("errors");
        if (errors instanceof List<?> list && !list.isEmpty()) {
            Map<String, Object> first = (Map<String, Object>) list.get(0);
            return String.valueOf(first.getOrDefault("title", first.get("message")));
        }
        return null;
    }

    private DeliveryState mapState(String status) {
        return switch (status.toLowerCase()) {
            case "sent" -> DeliveryState.SENT;
            case "delivered" -> DeliveryState.DELIVERED;
            case "read" -> DeliveryState.READ;
            case "failed" -> DeliveryState.FAILED;
            default -> DeliveryState.PENDING;
        };
    }
}
