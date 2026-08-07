package io.hubflow.core.repository;

import io.hubflow.core.domain.Plan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlanRepository extends JpaRepository<Plan, String> {

    List<Plan> findAllByOrderBySortOrderAsc();
}
