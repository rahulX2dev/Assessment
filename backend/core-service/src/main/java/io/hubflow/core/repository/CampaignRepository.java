package io.hubflow.core.repository;

import io.hubflow.core.domain.Campaign;
import io.hubflow.core.domain.CampaignStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface CampaignRepository extends JpaRepository<Campaign, String> {

    Optional<Campaign> findByIdAndTenantId(String id, String tenantId);

    Page<Campaign> findByTenantId(String tenantId, Pageable pageable);

    Page<Campaign> findByTenantIdAndStatus(String tenantId, CampaignStatus status, Pageable pageable);

    List<Campaign> findByStatusAndScheduledAtBefore(CampaignStatus status, Instant cutoff);

    long countByTenantIdAndStatus(String tenantId, CampaignStatus status);
}
