package io.hubflow.core.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "message_templates",
        uniqueConstraints = @UniqueConstraint(name = "uk_templates_tenant_name",
                columnNames = {"tenant_id", "name", "language"}),
        indexes = @Index(name = "idx_templates_tenant_status", columnList = "tenant_id, approval_status"))
public class MessageTemplate extends BaseEntity {

    @Column(name = "tenant_id", nullable = false, length = 36)
    private String tenantId;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 12)
    private String language = "en";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TemplateCategory category = TemplateCategory.MARKETING;

    @Lob
    @Column(name = "body_text", nullable = false)
    private String bodyText;

    @Column(name = "header_text", length = 200)
    private String headerText;

    @Column(name = "footer_text", length = 200)
    private String footerText;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false, length = 20)
    private TemplateApprovalStatus approvalStatus = TemplateApprovalStatus.PENDING;

    @Column(name = "meta_template_id", length = 64)
    private String metaTemplateId;

    @Column(name = "quality_rating", length = 20)
    private String qualityRating;

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public TemplateCategory getCategory() {
        return category;
    }

    public void setCategory(TemplateCategory category) {
        this.category = category;
    }

    public String getBodyText() {
        return bodyText;
    }

    public void setBodyText(String bodyText) {
        this.bodyText = bodyText;
    }

    public String getHeaderText() {
        return headerText;
    }

    public void setHeaderText(String headerText) {
        this.headerText = headerText;
    }

    public String getFooterText() {
        return footerText;
    }

    public void setFooterText(String footerText) {
        this.footerText = footerText;
    }

    public TemplateApprovalStatus getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(TemplateApprovalStatus approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public String getMetaTemplateId() {
        return metaTemplateId;
    }

    public void setMetaTemplateId(String metaTemplateId) {
        this.metaTemplateId = metaTemplateId;
    }

    public String getQualityRating() {
        return qualityRating;
    }

    public void setQualityRating(String qualityRating) {
        this.qualityRating = qualityRating;
    }
}
