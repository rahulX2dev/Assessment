package io.hubflow.core.service;

import io.hubflow.core.common.exception.ApiException;
import io.hubflow.core.domain.Employee;
import io.hubflow.core.domain.LeaveRequest;
import io.hubflow.core.domain.LeaveStatus;
import io.hubflow.core.dto.HrmsDtos;
import io.hubflow.core.repository.EmployeeRepository;
import io.hubflow.core.repository.LeaveRequestRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class HrmsService {

    private final EmployeeRepository employeeRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    public HrmsService(EmployeeRepository employeeRepository, LeaveRequestRepository leaveRequestRepository) {
        this.employeeRepository = employeeRepository;
        this.leaveRequestRepository = leaveRequestRepository;
    }

    @Transactional(readOnly = true)
    public Page<HrmsDtos.EmployeeResponse> listEmployees(String tenantId, String department, Pageable pageable) {
        Page<Employee> employees = (department == null || department.isBlank())
                ? employeeRepository.findByTenantId(tenantId, pageable)
                : employeeRepository.findByTenantIdAndDepartment(tenantId, department, pageable);

        return employees.map(this::toEmployeeResponse);
    }

    @Transactional
    public HrmsDtos.EmployeeResponse createEmployee(String tenantId, HrmsDtos.EmployeeRequest request) {
        if (employeeRepository.existsByTenantIdAndEmployeeCode(tenantId, request.employeeCode())) {
            throw ApiException.conflict("Employee code %s is already in use".formatted(request.employeeCode()));
        }

        Employee employee = new Employee();
        employee.setTenantId(tenantId);
        employee.setEmployeeCode(request.employeeCode());
        employee.setFullName(request.fullName());
        employee.setEmail(request.email());
        employee.setPhone(request.phone());
        employee.setDepartment(request.department());
        employee.setDesignation(request.designation());
        employee.setDateOfJoining(request.dateOfJoining());
        employee.setAnnualCtc(request.annualCtc());
        employee.setManagerId(request.managerId());

        return toEmployeeResponse(employeeRepository.save(employee));
    }

    @Transactional(readOnly = true)
    public HrmsDtos.EmployeeResponse getEmployee(String tenantId, String id) {
        return toEmployeeResponse(requireEmployee(tenantId, id));
    }

    @Transactional
    public HrmsDtos.LeaveResponse applyForLeave(String tenantId, HrmsDtos.LeaveRequestPayload payload) {
        Employee employee = requireEmployee(tenantId, payload.employeeId());

        if (payload.endDate().isBefore(payload.startDate())) {
            throw ApiException.badRequest("endDate cannot be before startDate");
        }

        int days = (int) ChronoUnit.DAYS.between(payload.startDate(), payload.endDate()) + 1;

        if (days > employee.getLeaveBalance()) {
            throw ApiException.badRequest(
                    "Requested %d days but only %d remain in the balance".formatted(days, employee.getLeaveBalance()));
        }

        LeaveRequest request = new LeaveRequest();
        request.setTenantId(tenantId);
        request.setEmployeeId(employee.getId());
        request.setLeaveType(payload.leaveType());
        request.setStartDate(payload.startDate());
        request.setEndDate(payload.endDate());
        request.setDayCount(days);
        request.setReason(payload.reason());

        return toLeaveResponse(leaveRequestRepository.save(request));
    }

    @Transactional(readOnly = true)
    public Page<HrmsDtos.LeaveResponse> listLeave(String tenantId, LeaveStatus status, Pageable pageable) {
        Page<LeaveRequest> requests = status == null
                ? leaveRequestRepository.findByTenantId(tenantId, pageable)
                : leaveRequestRepository.findByTenantIdAndStatus(tenantId, status, pageable);

        return requests.map(this::toLeaveResponse);
    }

    @Transactional
    public HrmsDtos.LeaveResponse decideLeave(
            String tenantId, String id, String deciderId, HrmsDtos.LeaveDecision decision) {

        LeaveRequest request = leaveRequestRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> ApiException.notFound("Leave request", id));

        if (request.getStatus() != LeaveStatus.PENDING) {
            throw ApiException.conflict("This request has already been " + request.getStatus());
        }

        request.setStatus(decision.status());
        request.setDecidedBy(deciderId);
        request.setDecidedAt(Instant.now());

        if (decision.status() == LeaveStatus.APPROVED) {
            Employee employee = requireEmployee(tenantId, request.getEmployeeId());
            employee.setLeaveBalance(employee.getLeaveBalance() - request.getDayCount());
            employeeRepository.save(employee);
        }

        return toLeaveResponse(leaveRequestRepository.save(request));
    }

    private Employee requireEmployee(String tenantId, String id) {
        return employeeRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> ApiException.notFound("Employee", id));
    }

    private HrmsDtos.EmployeeResponse toEmployeeResponse(Employee employee) {
        return new HrmsDtos.EmployeeResponse(
                employee.getId(),
                employee.getEmployeeCode(),
                employee.getFullName(),
                employee.getEmail(),
                employee.getPhone(),
                employee.getDepartment(),
                employee.getDesignation(),
                employee.getDateOfJoining(),
                employee.getAnnualCtc(),
                employee.getManagerId(),
                employee.getStatus(),
                employee.getLeaveBalance());
    }

    private HrmsDtos.LeaveResponse toLeaveResponse(LeaveRequest request) {
        return new HrmsDtos.LeaveResponse(
                request.getId(),
                request.getEmployeeId(),
                request.getLeaveType(),
                request.getStartDate(),
                request.getEndDate(),
                request.getDayCount(),
                request.getReason(),
                request.getStatus(),
                request.getDecidedBy());
    }
}
