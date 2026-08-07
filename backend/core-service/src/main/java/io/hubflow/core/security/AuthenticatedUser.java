package io.hubflow.core.security;

import java.util.Set;

public record AuthenticatedUser(String userId, String tenantId, String email, Set<String> roles) {

    public boolean hasRole(String role) {
        return roles.contains(role);
    }
}
