package io.hubflow.core.common;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiErrorBody(
        String code,
        String message,
        Map<String, Object> details,
        String path,
        Instant timestamp) {

    public static ApiErrorBody of(String code, String message, String path) {
        return new ApiErrorBody(code, message, null, path, Instant.now());
    }

    public static ApiErrorBody of(String code, String message, Map<String, Object> details, String path) {
        return new ApiErrorBody(code, message, details, path, Instant.now());
    }
}
