package io.hubflow.core.security;

import io.hubflow.core.common.exception.ApiException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class CurrentUser {

    private CurrentUser() {
    }

    public static AuthenticatedUser require() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            throw ApiException.unauthorized("No authenticated principal on this request");
        }

        return user;
    }

    public static String tenantId() {
        return require().tenantId();
    }

    public static String userId() {
        return require().userId();
    }
}
