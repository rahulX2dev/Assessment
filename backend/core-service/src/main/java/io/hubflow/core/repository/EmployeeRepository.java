package io.hubflow.core.repository;

import io.hubflow.core.domain.Employee;
import io.hubflow.core.domain.EmployeeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, String> {

    Page<Employee> findByTenantId(String tenantId, Pageable pageable);

    Page<Employee> findByTenantIdAndDepartment(String tenantId, String department, Pageable pageable);

    Optional<Employee> findByIdAndTenantId(String id, String tenantId);

    boolean existsByTenantIdAndEmployeeCode(String tenantId, String employeeCode);

    long countByTenantIdAndStatus(String tenantId, EmployeeStatus status);
}
