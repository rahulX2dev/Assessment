package io.hubflow.core.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "deals", indexes = {
        @Index(name = "idx_deals_tenant_stage", columnList = "tenant_id, stage"),
        @Index(name = "idx_deals_contact", columnList = "contact_id"),
        @Index(name = "idx_deals_close_date", columnList = "expected_close_date")
})
public class Deal extends BaseEntity {

    @Column(name = "tenant_id", nullable = false, length = 36)
    private String tenantId;

    @Column(name = "contact_id", nullable = false, length = 36)
    private String contactId;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(name = "deal_value", nullable = false, precision = 14, scale = 2)
    private BigDecimal value = BigDecimal.ZERO;

    @Column(nullable = false, length = 3)
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private LifecycleStage stage = LifecycleStage.NEW;

    @Column(name = "owner_id", length = 36)
    private String ownerId;

    @Column(name = "expected_close_date")
    private LocalDate expectedCloseDate;

    @Column(name = "win_probability")
    private Integer winProbability = 20;

    @Column(name = "lost_reason", length = 240)
    private String lostReason;

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getContactId() {
        return contactId;
    }

    public void setContactId(String contactId) {
        this.contactId = contactId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public LifecycleStage getStage() {
        return stage;
    }

    public void setStage(LifecycleStage stage) {
        this.stage = stage;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public LocalDate getExpectedCloseDate() {
        return expectedCloseDate;
    }

    public void setExpectedCloseDate(LocalDate expectedCloseDate) {
        this.expectedCloseDate = expectedCloseDate;
    }

    public Integer getWinProbability() {
        return winProbability;
    }

    public void setWinProbability(Integer winProbability) {
        this.winProbability = winProbability;
    }

    public String getLostReason() {
        return lostReason;
    }

    public void setLostReason(String lostReason) {
        this.lostReason = lostReason;
    }
}
