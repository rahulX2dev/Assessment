package io.hubflow.core.web;

import io.hubflow.core.common.ApiResponse;
import io.hubflow.core.common.PageMeta;
import io.hubflow.core.domain.LeaveStatus;
import io.hubflow.core.dto.HrmsDtos;
import io.hubflow.core.security.CurrentUser;
import io.hubflow.core.service.HrmsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hrms")
@Tag(name = "HRMS", description = "Employee directory and leave management")
public class HrmsController {

    private final HrmsService hrmsService;

    public HrmsController(HrmsService hrmsService) {
        this.hrmsService = hrmsService;
    }

    @GetMapping("/employees")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    @Operation(summary = "List employees, optionally filtered by department")
    public ApiResponse<List<HrmsDtos.EmployeeResponse>> employees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String department) {

        PageRequest pageable = PageRequest.of(
                Math.max(0, page),
                Math.min(Math.max(1, size), 100),
                Sort.by(Sort.Direction.ASC, "fullName"));

        Page<HrmsDtos.EmployeeResponse> result =
                hrmsService.listEmployees(CurrentUser.tenantId(), department, pageable);

        return ApiResponse.ok(result.getContent(), PageMeta.from(result));
    }

    @PostMapping("/employees")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    @Operation(summary = "Add an employee to the directory")
    public ResponseEntity<ApiResponse<HrmsDtos.EmployeeResponse>> createEmployee(
            @Valid @RequestBody HrmsDtos.EmployeeRequest request) {

        HrmsDtos.EmployeeResponse created = hrmsService.createEmployee(CurrentUser.tenantId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(created));
    }

    @GetMapping("/employees/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    @Operation(summary = "Fetch a single employee record")
    public ApiResponse<HrmsDtos.EmployeeResponse> employee(@PathVariable String id) {
        return ApiResponse.ok(hrmsService.getEmployee(CurrentUser.tenantId(), id));
    }

    @PostMapping("/leave")
    @Operation(summary = "Apply for leave against a leave balance")
    public ResponseEntity<ApiResponse<HrmsDtos.LeaveResponse>> applyForLeave(
            @Valid @RequestBody HrmsDtos.LeaveRequestPayload payload) {

        HrmsDtos.LeaveResponse created = hrmsService.applyForLeave(CurrentUser.tenantId(), payload);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(created));
    }

    @GetMapping("/leave")
    @Operation(summary = "List leave requests filtered by status")
    public ApiResponse<List<HrmsDtos.LeaveResponse>> leaveRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) LeaveStatus status) {

        PageRequest pageable = PageRequest.of(
                Math.max(0, page),
                Math.min(Math.max(1, size), 100),
                Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<HrmsDtos.LeaveResponse> result =
                hrmsService.listLeave(CurrentUser.tenantId(), status, pageable);

        return ApiResponse.ok(result.getContent(), PageMeta.from(result));
    }

    @PatchMapping("/leave/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    @Operation(summary = "Approve or reject a pending leave request")
    public ApiResponse<HrmsDtos.LeaveResponse> decide(
            @PathVariable String id, @Valid @RequestBody HrmsDtos.LeaveDecision decision) {

        return ApiResponse.ok(
                hrmsService.decideLeave(CurrentUser.tenantId(), id, CurrentUser.userId(), decision));
    }
}
