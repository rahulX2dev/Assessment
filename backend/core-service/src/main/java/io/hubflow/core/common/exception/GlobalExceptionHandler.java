package io.hubflow.core.common.exception;

import io.hubflow.core.common.ApiErrorBody;
import io.hubflow.core.common.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<Void>> handleApiException(ApiException ex, HttpServletRequest request) {
        if (ex.getStatus().is5xxServerError()) {
            log.error("api exception on {}", request.getRequestURI(), ex);
        }

        ApiErrorBody body = ApiErrorBody.of(ex.getCode(), ex.getMessage(), ex.getDetails(), request.getRequestURI());
        return ResponseEntity.status(ex.getStatus()).body(ApiResponse.failure(body));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest request) {

        Map<String, Object> fieldErrors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> fieldErrors.putIfAbsent(error.getField(), error.getDefaultMessage()));

        ApiErrorBody body = ApiErrorBody.of(
                "VALIDATION_FAILED",
                "One or more fields failed validation",
                fieldErrors,
                request.getRequestURI());

        return ResponseEntity.badRequest().body(ApiResponse.failure(body));
    }

    @ExceptionHandler({MissingServletRequestParameterException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<ApiResponse<Void>> handleBadParameters(Exception ex, HttpServletRequest request) {
        ApiErrorBody body = ApiErrorBody.of("BAD_REQUEST", ex.getMessage(), request.getRequestURI());
        return ResponseEntity.badRequest().body(ApiResponse.failure(body));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleIntegrity(
            DataIntegrityViolationException ex, HttpServletRequest request) {

        log.warn("data integrity violation on {}: {}", request.getRequestURI(), ex.getMostSpecificCause().getMessage());

        ApiErrorBody body = ApiErrorBody.of(
                "CONFLICT",
                "The request conflicts with existing data",
                request.getRequestURI());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.failure(body));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(
            AccessDeniedException ex, HttpServletRequest request) {

        ApiErrorBody body = ApiErrorBody.of(
                "FORBIDDEN",
                "You do not have permission to perform this action",
                request.getRequestURI());

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.failure(body));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthentication(
            AuthenticationException ex, HttpServletRequest request) {

        ApiErrorBody body = ApiErrorBody.of("UNAUTHORIZED", "Authentication failed", request.getRequestURI());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.failure(body));
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNoHandler(
            NoHandlerFoundException ex, HttpServletRequest request) {

        ApiErrorBody body = ApiErrorBody.of(
                "NOT_FOUND",
                "No endpoint matches %s %s".formatted(ex.getHttpMethod(), ex.getRequestURL()),
                request.getRequestURI());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure(body));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleUnexpected(Exception ex, HttpServletRequest request) {
        log.error("unhandled exception on {}", request.getRequestURI(), ex);

        ApiErrorBody body = ApiErrorBody.of(
                "INTERNAL_ERROR",
                "An unexpected error occurred. The incident has been logged.",
                request.getRequestURI());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure(body));
    }
}
