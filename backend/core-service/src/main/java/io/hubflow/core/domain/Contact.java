package io.hubflow.core.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.Instant;

@Entity
@Table(name = "contacts",
        uniqueConstraints = @UniqueConstraint(name = "uk_contacts_tenant_phone", columnNames = {"tenant_id", "phone"}),
        indexes = {
                @Index(name = "idx_contacts_tenant_stage", columnList = "tenant_id, lifecycle_stage"),
                @Index(name = "idx_contacts_owner", columnList = "owner_id"),
                @Index(name = "idx_contacts_email", columnList = "email"),
                @Index(name = "idx_contacts_created", columnList = "created_at")
        })
public class Contact extends BaseEntity {

    @Column(name = "tenant_id", nullable = false, length = 36)
    private String tenantId;

    @Column(name = "full_name", nullable = false, length = 120)
    private String fullName;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(length = 180)
    private String email;

    @Column(name = "company_name", length = 160)
    private String companyName;

    @Enumerated(EnumType.STRING)
    @Column(name = "lifecycle_stage", nullable = false, length = 24)
    private LifecycleStage lifecycleStage = LifecycleStage.NEW;

    @Column(name = "owner_id", length = 36)
    private String ownerId;

    @Column(name = "lead_score")
    private Integer leadScore = 0;

    @Column(length = 240)
    private String tags;

    @Column(length = 60)
    private String source;

    @Column(name = "opted_out", nullable = false)
    private boolean optedOut = false;

    @Column(name = "last_contacted_at")
    private Instant lastContactedAt;

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public LifecycleStage getLifecycleStage() {
        return lifecycleStage;
    }

    public void setLifecycleStage(LifecycleStage lifecycleStage) {
        this.lifecycleStage = lifecycleStage;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public Integer getLeadScore() {
        return leadScore;
    }

    public void setLeadScore(Integer leadScore) {
        this.leadScore = leadScore;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public boolean isOptedOut() {
        return optedOut;
    }

    public void setOptedOut(boolean optedOut) {
        this.optedOut = optedOut;
    }

    public Instant getLastContactedAt() {
        return lastContactedAt;
    }

    public void setLastContactedAt(Instant lastContactedAt) {
        this.lastContactedAt = lastContactedAt;
    }
}
