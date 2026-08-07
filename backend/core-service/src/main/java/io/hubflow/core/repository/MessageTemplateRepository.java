package io.hubflow.core.repository;

import io.hubflow.core.domain.MessageTemplate;
import io.hubflow.core.domain.TemplateApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MessageTemplateRepository extends JpaRepository<MessageTemplate, String> {

    List<MessageTemplate> findByTenantId(String tenantId);

    Optional<MessageTemplate> findByIdAndTenantId(String id, String tenantId);

    List<MessageTemplate> findByTenantIdAndApprovalStatus(String tenantId, TemplateApprovalStatus status);
}
