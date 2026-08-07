package io.hubflow.core.repository;

import io.hubflow.core.domain.Contact;
import io.hubflow.core.domain.LifecycleStage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, String> {

    Optional<Contact> findByIdAndTenantId(String id, String tenantId);

    Optional<Contact> findByTenantIdAndPhone(String tenantId, String phone);

    boolean existsByTenantIdAndPhone(String tenantId, String phone);

    @Query("""
            select c from Contact c
            where c.tenantId = :tenantId
              and (:stage is null or c.lifecycleStage = :stage)
              and (:ownerId is null or c.ownerId = :ownerId)
              and (:search is null
                   or lower(c.fullName) like lower(concat('%', :search, '%'))
                   or c.phone like concat('%', :search, '%')
                   or lower(c.email) like lower(concat('%', :search, '%')))
            """)
    Page<Contact> search(
            @Param("tenantId") String tenantId,
            @Param("search") String search,
            @Param("stage") LifecycleStage stage,
            @Param("ownerId") String ownerId,
            Pageable pageable);

    List<Contact> findByTenantIdAndOptedOutFalse(String tenantId);

    long countByTenantIdAndLifecycleStage(String tenantId, LifecycleStage stage);

    long countByTenantId(String tenantId);
}
