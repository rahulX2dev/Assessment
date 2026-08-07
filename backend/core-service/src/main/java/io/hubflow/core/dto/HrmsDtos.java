package io.hubflow.core.dto;

import io.hubflow.core.domain.EmployeeStatus;
import io.hubflow.core.domain.LeaveStatus;
import io.hubflow.core.domain.LeaveType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public final class HrmsDtos {

    private HrmsDtos() {
    }

    public record EmployeeRequest(
            @NotBlank @Size(max = 24) String employeeCode,
            @NotBlank @Size(max = 120) String fullName,
            @NotBlank @Email String email,
            String phone,
            @NotBlank @Size(max = 80) String department,
            @NotBlank @Size(max = 80) String designation,
            @NotNull LocalDate dateOfJoining,
            BigDecimal annualCtc,
            String managerId) {
    }

    public record EmployeeResponse(
            String id,
            String employeeCode,
            String fullName,
            String email,
            String phone,
            String department,
            String designation,
            LocalDate dateOfJoining,
            BigDecimal annualCtc,
            String managerId,
            EmployeeStatus status,
            int leaveBalance) {
    }

    public record LeaveRequestPayload(
            @NotBlank String employeeId,
            @NotNull LeaveType leaveType,
            @NotNull LocalDate startDate,
            @NotNull LocalDate endDate,
            @Size(max = 400) String reason) {
    }

    public record LeaveResponse(
            String id,
            String employeeId,
            LeaveType leaveType,
            LocalDate startDate,
            LocalDate endDate,
            int dayCount,
            String reason,
            LeaveStatus status,
            String decidedBy) {
    }

    public record LeaveDecision(@NotNull LeaveStatus status) {
    }
}
