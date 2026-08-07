package io.hubflow.core.repository;

import io.hubflow.core.domain.OtpPurpose;
import io.hubflow.core.domain.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface OtpTokenRepository extends JpaRepository<OtpToken, String> {

    Optional<OtpToken> findFirstByPhoneAndPurposeAndConsumedAtIsNullOrderByCreatedAtDesc(
            String phone, OtpPurpose purpose);

    @Query("select count(o) from OtpToken o where o.phone = :phone and o.createdAt > :since")
    long countRecentRequests(@Param("phone") String phone, @Param("since") Instant since);

    @Modifying
    @Query("delete from OtpToken o where o.expiresAt < :cutoff")
    int deleteExpired(@Param("cutoff") Instant cutoff);
}
