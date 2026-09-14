package com.example.restapi.exception;

import com.example.restapi.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Centralized exception handling (@ControllerAdvice) so every error path -
 * validation failures, missing resources, or unexpected errors - returns
 * through the same ApiResponse envelope with the right HTTP status, AND is
 * logged with full context. Because CorrelationIdFilter already put the
 * correlation ID into MDC, every log line below is automatically tagged
 * with it (see the logging pattern in application.properties) - so a
 * failure reported by a user can be traced to the exact backend log lines
 * using the correlationId returned in the JSON response.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Triggered when @Valid fails on a request body (Bean Validation)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        Map<String, String> fieldErrors = new LinkedHashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }

        logger.warn("Validation failed on {}: {}",
                ex.getBindingResult().getObjectName(), fieldErrors);

        ApiResponse<Map<String, String>> response = ApiResponse.error("Validation failed");
        response.setData(fieldErrors);

        return ResponseEntity.badRequest().body(response);
    }

    // Triggered when a requested resource (e.g. product id) does not exist
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFound(ResourceNotFoundException ex) {
        logger.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }

    // Catch-all fallback for anything unexpected - logged at ERROR with full stack trace
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneralException(Exception ex) {
        logger.error("Unhandled exception while processing request", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Something went wrong: " + ex.getMessage()));
    }
}
