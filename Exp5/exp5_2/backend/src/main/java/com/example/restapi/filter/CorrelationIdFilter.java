package com.example.restapi.filter;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

/**
 * Runs first for every request. Responsible for:
 *  1) Correlation IDs - if the caller sends X-Correlation-Id, reuse it
 *     (useful when a request hops through multiple services); otherwise
 *     generate a fresh UUID. The ID is stored in SLF4J's MDC so every log
 *     line written during this request automatically includes it, and it
 *     is echoed back on the response header so the frontend/caller can log
 *     it too and cross-reference support requests with backend logs.
 *  2) Request/response access logging - method, path, status, and how
 *     long the request took, for basic observability without extra tools.
 */
@Component
@Order(1)
public class CorrelationIdFilter implements Filter {

    private static final Logger logger = LoggerFactory.getLogger(CorrelationIdFilter.class);

    public static final String CORRELATION_ID_HEADER = "X-Correlation-Id";
    public static final String CORRELATION_ID_MDC_KEY = "correlationId";

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        String correlationId = request.getHeader(CORRELATION_ID_HEADER);
        if (correlationId == null || correlationId.isBlank()) {
            correlationId = UUID.randomUUID().toString();
        }

        MDC.put(CORRELATION_ID_MDC_KEY, correlationId);
        response.setHeader(CORRELATION_ID_HEADER, correlationId);

        long startTime = System.currentTimeMillis();
        logger.info("--> {} {} (client={})", request.getMethod(), request.getRequestURI(), request.getRemoteAddr());

        try {
            chain.doFilter(request, response);
        } finally {
            long durationMs = System.currentTimeMillis() - startTime;
            logger.info("<-- {} {} status={} ({} ms)",
                    request.getMethod(), request.getRequestURI(), response.getStatus(), durationMs);
            // Prevent MDC values leaking into unrelated log lines on a reused thread
            MDC.remove(CORRELATION_ID_MDC_KEY);
        }
    }
}
