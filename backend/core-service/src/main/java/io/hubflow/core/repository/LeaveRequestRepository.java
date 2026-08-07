package io.hubflow.core.repository;

import io.hubflow.core.domain.LeaveRequest;
import io.hubflow.core.domain.LeaveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, String> {

    Page<LeaveRequest> findByTenantId(String tenantId, Pageable pageable);

    Page<LeaveRequest> findByTenantIdAndStatus(String tenantId, LeaveStatus status, Pageable pageable);

    Optional<LeaveRequest> findByIdAndTenantId(String id, String tenantId);
}
