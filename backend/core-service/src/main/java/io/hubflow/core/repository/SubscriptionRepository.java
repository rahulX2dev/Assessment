package io.hubflow.core.repository;

import io.hubflow.core.domain.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, String> {

    Optional<Subscription> findFirstByTenantIdOrderByCreatedAtDesc(String tenantId);
}
