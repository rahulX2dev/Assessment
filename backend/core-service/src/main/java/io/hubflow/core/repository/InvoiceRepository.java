package io.hubflow.core.repository;

import io.hubflow.core.domain.Invoice;
import io.hubflow.core.domain.InvoiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, String> {

    Page<Invoice> findByTenantId(String tenantId, Pageable pageable);

    Optional<Invoice> findByIdAndTenantId(String id, String tenantId);

    long countByTenantIdAndStatus(String tenantId, InvoiceStatus status);
}
