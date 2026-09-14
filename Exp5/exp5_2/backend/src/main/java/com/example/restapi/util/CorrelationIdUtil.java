package com.example.restapi.util;

import com.example.restapi.filter.CorrelationIdFilter;
import org.slf4j.MDC;

/**
 * Small helper so any layer (service, exception handler, response builder)
 * can attach the current request's correlation ID without needing access
 * to the HttpServletRequest itself.
 */
public final class CorrelationIdUtil {

    private CorrelationIdUtil() {
    }

    public static String getCurrentCorrelationId() {
        String id = MDC.get(CorrelationIdFilter.CORRELATION_ID_MDC_KEY);
        return id != null ? id : "N/A";
    }
}
