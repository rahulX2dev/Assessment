package io.hubflow.core.service;

import io.hubflow.core.common.exception.ApiException;
import io.hubflow.core.domain.Campaign;
import io.hubflow.core.domain.CampaignRecipient;
import io.hubflow.core.domain.CampaignStatus;
import io.hubflow.core.domain.Contact;
import io.hubflow.core.domain.DeliveryState;
import io.hubflow.core.domain.MessageTemplate;
import io.hubflow.core.domain.TemplateApprovalStatus;
import io.hubflow.core.dto.CampaignDtos;
import io.hubflow.core.repository.CampaignRecipientRepository;
import io.hubflow.core.repository.CampaignRepository;
import io.hubflow.core.repository.ContactRepository;
import io.hubflow.core.repository.MessageTemplateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class CampaignService {

    private static final Logger log = LoggerFactory.getLogger(CampaignService.class);

    private final CampaignRepository campaignRepository;
    private final CampaignRecipientRepository recipientRepository;
    private final ContactRepository contactRepository;
    private final MessageTemplateRepository templateRepository;

    public CampaignService(
            CampaignRepository campaignRepository,
            CampaignRecipientRepository recipientRepository,
            ContactRepository contactRepository,
            MessageTemplateRepository templateRepository) {

        this.campaignRepository = campaignRepository;
        this.recipientRepository = recipientRepository;
        this.contactRepository = contactRepository;
        this.templateRepository = templateRepository;
    }

    @Transactional(readOnly = true)
    public Page<CampaignDtos.CampaignResponse> list(String tenantId, CampaignStatus status, Pageable pageable) {
        Page<Campaign> campaigns = status == null
                ? campaignRepository.findByTenantId(tenantId, pageable)
                : campaignRepository.findByTenantIdAndStatus(tenantId, status, pageable);

        return campaigns.map(this::toResponse);
    }

    @Transactional
    public CampaignDtos.CampaignResponse create(
            String tenantId, String userId, CampaignDtos.CampaignRequest request) {

        MessageTemplate template = templateRepository.findByIdAndTenantId(request.templateId(), tenantId)
                .orElseThrow(() -> ApiException.notFound("Template", request.templateId()));

        if (template.getApprovalStatus() != TemplateApprovalStatus.APPROVED) {
            throw ApiException.badRequest(
                    "Template must be APPROVED before it can be used, current status is "
                            + template.getApprovalStatus());
        }

        Campaign campaign = new Campaign();
        campaign.setTenantId(tenantId);
        campaign.setName(request.name());
        campaign.setTemplateId(template.getId());
        campaign.setSegmentFilter(request.segmentFilter());
        campaign.setCreatedBy(userId);
        campaign.setScheduledAt(request.scheduledAt());
        campaign.setStatus(request.scheduledAt() != null ? CampaignStatus.SCHEDULED : CampaignStatus.DRAFT);

        return toResponse(campaignRepository.save(campaign));
    }

    @Transactional(readOnly = true)
    public CampaignDtos.CampaignResponse get(String tenantId, String id) {
        return toResponse(requireCampaign(tenantId, id));
    }

    @Transactional
    public CampaignDtos.DispatchResponse dispatch(
            String tenantId, String id, CampaignDtos.DispatchRequest request) {

        Campaign campaign = requireCampaign(tenantId, id);

        if (campaign.getStatus() == CampaignStatus.RUNNING || campaign.getStatus() == CampaignStatus.QUEUED) {
            throw ApiException.conflict("This campaign is already queued or running");
        }

        if (campaign.getStatus() == CampaignStatus.COMPLETED) {
            throw ApiException.conflict("A completed campaign cannot be dispatched again");
        }

        List<Contact> audience = contactRepository.findByTenantIdAndOptedOutFalse(tenantId);

        if (audience.isEmpty()) {
            throw ApiException.badRequest("No eligible contacts - every contact has opted out or none exist");
        }

        long totalContacts = contactRepository.countByTenantId(tenantId);
        int skipped = (int) (totalContacts - audience.size());

        List<CampaignRecipient> recipients = new ArrayList<>(audience.size());
        for (Contact contact : audience) {
            CampaignRecipient recipient = new CampaignRecipient();
            recipient.setCampaignId(campaign.getId());
            recipient.setContactId(contact.getId());
            recipient.setPhone(contact.getPhone());
            recipient.setDeliveryState(DeliveryState.QUEUED);
            recipients.add(recipient);
        }
        recipientRepository.saveAll(recipients);

        String batchId = "batch_" + UUID.randomUUID().toString().substring(0, 12);

        campaign.setStatus(request != null && request.scheduledAt() != null
                ? CampaignStatus.SCHEDULED
                : CampaignStatus.QUEUED);
        campaign.setScheduledAt(request != null ? request.scheduledAt() : null);
        campaign.setTotalRecipients(recipients.size());
        campaign.setStartedAt(Instant.now());
        campaignRepository.save(campaign);

        log.info("campaign {} queued with {} recipients batch={}", campaign.getId(), recipients.size(), batchId);

        return new CampaignDtos.DispatchResponse(
                campaign.getId(),
                campaign.getStatus(),
                recipients.size(),
                skipped,
                batchId);
    }

    @Transactional(readOnly = true)
    public CampaignDtos.CampaignStats stats(String tenantId, String id) {
        Campaign campaign = requireCampaign(tenantId, id);

        Map<String, Long> byState = new LinkedHashMap<>();
        recipientRepository.countGroupedByState(id)
                .forEach(row -> byState.put(row.getState().name(), row.getTotal()));

        long total = Math.max(1, campaign.getTotalRecipients());
        long delivered = byState.getOrDefault(DeliveryState.DELIVERED.name(), 0L)
                + byState.getOrDefault(DeliveryState.READ.name(), 0L);
        long read = byState.getOrDefault(DeliveryState.READ.name(), 0L);

        return new CampaignDtos.CampaignStats(
                campaign.getId(),
                campaign.getTotalRecipients(),
                byState,
                round(delivered * 100.0 / total),
                round(read * 100.0 / total));
    }

    @Transactional
    public void applyDeliveryUpdate(String providerMessageId, DeliveryState state, String failureReason) {
        recipientRepository.findByProviderMessageId(providerMessageId).ifPresent(recipient -> {
            recipient.setDeliveryState(state);
            recipient.setFailureReason(failureReason);

            Instant now = Instant.now();
            switch (state) {
                case SENT -> recipient.setSentAt(now);
                case DELIVERED -> recipient.setDeliveredAt(now);
                case READ -> recipient.setReadAt(now);
                default -> {
                }
            }

            recipientRepository.save(recipient);
            refreshCounters(recipient.getCampaignId());
        });
    }

    private void refreshCounters(String campaignId) {
        campaignRepository.findById(campaignId).ifPresent(campaign -> {
            campaign.setSentCount((int) recipientRepository
                    .countByCampaignIdAndDeliveryState(campaignId, DeliveryState.SENT));
            campaign.setDeliveredCount((int) recipientRepository
                    .countByCampaignIdAndDeliveryState(campaignId, DeliveryState.DELIVERED));
            campaign.setReadCount((int) recipientRepository
                    .countByCampaignIdAndDeliveryState(campaignId, DeliveryState.READ));
            campaign.setFailedCount((int) recipientRepository
                    .countByCampaignIdAndDeliveryState(campaignId, DeliveryState.FAILED));

            long pending = recipientRepository.countByCampaignIdAndDeliveryState(campaignId, DeliveryState.QUEUED);
            if (pending == 0 && campaign.getStatus() == CampaignStatus.RUNNING) {
                campaign.setStatus(CampaignStatus.COMPLETED);
                campaign.setCompletedAt(Instant.now());
            }

            campaignRepository.save(campaign);
        });
    }

    private Campaign requireCampaign(String tenantId, String id) {
        return campaignRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> ApiException.notFound("Campaign", id));
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private CampaignDtos.CampaignResponse toResponse(Campaign campaign) {
        return new CampaignDtos.CampaignResponse(
                campaign.getId(),
                campaign.getName(),
                campaign.getTemplateId(),
                campaign.getStatus(),
                campaign.getScheduledAt(),
                campaign.getStartedAt(),
                campaign.getCompletedAt(),
                campaign.getTotalRecipients(),
                campaign.getSentCount(),
                campaign.getDeliveredCount(),
                campaign.getReadCount(),
                campaign.getFailedCount(),
                campaign.getCreatedAt());
    }
}
