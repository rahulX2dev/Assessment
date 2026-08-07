package io.hubflow.core.repository;

import io.hubflow.core.domain.CampaignRecipient;
import io.hubflow.core.domain.DeliveryState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CampaignRecipientRepository extends JpaRepository<CampaignRecipient, String> {

    Optional<CampaignRecipient> findByProviderMessageId(String providerMessageId);

    List<CampaignRecipient> findByCampaignIdAndDeliveryState(String campaignId, DeliveryState state);

    long countByCampaignIdAndDeliveryState(String campaignId, DeliveryState state);

    @Query("""
            select r.deliveryState as state, count(r) as total
            from CampaignRecipient r
            where r.campaignId = :campaignId
            group by r.deliveryState
            """)
    List<StateCount> countGroupedByState(@Param("campaignId") String campaignId);

    interface StateCount {
        DeliveryState getState();

        long getTotal();
    }
}
