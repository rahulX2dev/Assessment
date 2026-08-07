package io.hubflow.core.service;

import io.hubflow.core.common.exception.ApiException;
import io.hubflow.core.domain.MessageTemplate;
import io.hubflow.core.domain.TemplateApprovalStatus;
import io.hubflow.core.dto.CampaignDtos;
import io.hubflow.core.repository.MessageTemplateRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TemplateService {

    private final MessageTemplateRepository templateRepository;

    public TemplateService(MessageTemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }

    @Transactional(readOnly = true)
    public List<CampaignDtos.TemplateResponse> list(String tenantId) {
        return templateRepository.findByTenantId(tenantId).stream().map(this::toResponse).toList();
    }

    @Transactional
    public CampaignDtos.TemplateResponse create(String tenantId, CampaignDtos.TemplateRequest request) {
        MessageTemplate template = new MessageTemplate();
        template.setTenantId(tenantId);
        template.setName(request.name());
        template.setLanguage(request.language());
        template.setBodyText(request.bodyText());
        template.setHeaderText(request.headerText());
        template.setFooterText(request.footerText());

        if (request.category() != null) {
            template.setCategory(request.category());
        }

        return toResponse(templateRepository.save(template));
    }

    @Transactional
    public CampaignDtos.TemplateResponse updateApproval(
            String tenantId, String id, TemplateApprovalStatus status) {

        MessageTemplate template = templateRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> ApiException.notFound("Template", id));

        template.setApprovalStatus(status);
        return toResponse(templateRepository.save(template));
    }

    private CampaignDtos.TemplateResponse toResponse(MessageTemplate template) {
        return new CampaignDtos.TemplateResponse(
                template.getId(),
                template.getName(),
                template.getLanguage(),
                template.getCategory(),
                template.getBodyText(),
                template.getHeaderText(),
                template.getFooterText(),
                template.getApprovalStatus(),
                template.getQualityRating());
    }
}
