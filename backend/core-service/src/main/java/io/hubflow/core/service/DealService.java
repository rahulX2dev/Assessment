package io.hubflow.core.service;

import io.hubflow.core.common.exception.ApiException;
import io.hubflow.core.domain.Contact;
import io.hubflow.core.domain.Deal;
import io.hubflow.core.domain.LifecycleStage;
import io.hubflow.core.dto.CrmDtos;
import io.hubflow.core.repository.ContactRepository;
import io.hubflow.core.repository.DealRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DealService {

    private final DealRepository dealRepository;
    private final ContactRepository contactRepository;

    public DealService(DealRepository dealRepository, ContactRepository contactRepository) {
        this.dealRepository = dealRepository;
        this.contactRepository = contactRepository;
    }

    @Transactional(readOnly = true)
    public Page<CrmDtos.DealResponse> list(String tenantId, LifecycleStage stage, Pageable pageable) {
        Page<Deal> deals = stage == null
                ? dealRepository.findByTenantId(tenantId, pageable)
                : dealRepository.findByTenantIdAndStage(tenantId, stage, pageable);

        return deals.map(this::toResponse);
    }

    @Transactional
    public CrmDtos.DealResponse create(String tenantId, CrmDtos.DealRequest request) {
        Contact contact = contactRepository.findByIdAndTenantId(request.contactId(), tenantId)
                .orElseThrow(() -> ApiException.notFound("Contact", request.contactId()));

        Deal deal = new Deal();
        deal.setTenantId(tenantId);
        deal.setContactId(contact.getId());
        deal.setTitle(request.title());
        deal.setValue(request.value());
        deal.setOwnerId(request.ownerId() != null ? request.ownerId() : contact.getOwnerId());
        deal.setExpectedCloseDate(request.expectedCloseDate());

        if (request.stage() != null) {
            deal.setStage(request.stage());
            deal.setWinProbability(probabilityFor(request.stage()));
        }

        return toResponse(dealRepository.save(deal));
    }

    @Transactional
    public CrmDtos.DealResponse changeStage(String tenantId, String id, CrmDtos.StageChangeRequest request) {
        Deal deal = dealRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> ApiException.notFound("Deal", id));

        if (request.stage() == LifecycleStage.LOST && (request.lostReason() == null || request.lostReason().isBlank())) {
            throw ApiException.badRequest("lostReason is required when moving a deal to LOST");
        }

        deal.setStage(request.stage());
        deal.setWinProbability(probabilityFor(request.stage()));
        deal.setLostReason(request.stage() == LifecycleStage.LOST ? request.lostReason() : null);

        contactRepository.findByIdAndTenantId(deal.getContactId(), tenantId).ifPresent(contact -> {
            contact.setLifecycleStage(request.stage());
            contactRepository.save(contact);
        });

        return toResponse(dealRepository.save(deal));
    }

    @Transactional(readOnly = true)
    public List<CrmDtos.PipelineStage> pipeline(String tenantId) {
        return dealRepository.summariseByStage(tenantId).stream()
                .map(row -> new CrmDtos.PipelineStage(row.getStage(), row.getDealCount(), row.getTotalValue()))
                .toList();
    }

    private int probabilityFor(LifecycleStage stage) {
        return switch (stage) {
            case NEW -> 10;
            case QUALIFIED -> 30;
            case DEMO -> 50;
            case NEGOTIATION -> 75;
            case WON -> 100;
            case LOST -> 0;
        };
    }

    private CrmDtos.DealResponse toResponse(Deal deal) {
        return new CrmDtos.DealResponse(
                deal.getId(),
                deal.getContactId(),
                deal.getTitle(),
                deal.getValue(),
                deal.getCurrency(),
                deal.getStage(),
                deal.getOwnerId(),
                deal.getExpectedCloseDate(),
                deal.getWinProbability(),
                deal.getCreatedAt());
    }
}
