package io.hubflow.core.repository;

import io.hubflow.core.domain.Deal;
import io.hubflow.core.domain.LifecycleStage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface DealRepository extends JpaRepository<Deal, String> {

    Optional<Deal> findByIdAndTenantId(String id, String tenantId);

    Page<Deal> findByTenantId(String tenantId, Pageable pageable);

    Page<Deal> findByTenantIdAndStage(String tenantId, LifecycleStage stage, Pageable pageable);

    @Query("""
            select d.stage as stage, count(d) as dealCount, coalesce(sum(d.value), 0) as totalValue
            from Deal d
            where d.tenantId = :tenantId
            group by d.stage
            """)
    List<StageSummary> summariseByStage(@Param("tenantId") String tenantId);

    interface StageSummary {
        LifecycleStage getStage();

        long getDealCount();

        BigDecimal getTotalValue();
    }
}
