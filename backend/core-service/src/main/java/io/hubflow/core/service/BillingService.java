package io.hubflow.core.service;

import io.hubflow.core.common.exception.ApiException;
import io.hubflow.core.domain.BillingCycle;
import io.hubflow.core.domain.Invoice;
import io.hubflow.core.domain.InvoiceStatus;
import io.hubflow.core.domain.Plan;
import io.hubflow.core.domain.Subscription;
import io.hubflow.core.domain.SubscriptionStatus;
import io.hubflow.core.dto.BillingDtos;
import io.hubflow.core.repository.ContactRepository;
import io.hubflow.core.repository.InvoiceRepository;
import io.hubflow.core.repository.PlanRepository;
import io.hubflow.core.repository.SubscriptionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class BillingService {

    private static final BigDecimal GST_RATE = new BigDecimal("0.18");
    private static final BigDecimal CONVERSATION_UNIT_COST = new BigDecimal("0.85");

    private final PlanRepository planRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final InvoiceRepository invoiceRepository;
    private final ContactRepository contactRepository;

    public BillingService(
            PlanRepository planRepository,
            SubscriptionRepository subscriptionRepository,
            InvoiceRepository invoiceRepository,
            ContactRepository contactRepository) {

        this.planRepository = planRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.invoiceRepository = invoiceRepository;
        this.contactRepository = contactRepository;
    }

    @Transactional(readOnly = true)
    public List<BillingDtos.PlanResponse> plans() {
        return planRepository.findAllByOrderBySortOrderAsc().stream().map(this::toPlanResponse).toList();
    }

    @Transactional
    public BillingDtos.SubscriptionResponse subscribe(String tenantId, BillingDtos.SubscribeRequest request) {
        Plan plan = planRepository.findById(request.planId())
                .orElseThrow(() -> ApiException.notFound("Plan", request.planId()));

        Instant now = Instant.now();
        Instant periodEnd = request.billingCycle() == BillingCycle.YEARLY
                ? now.plus(365, ChronoUnit.DAYS)
                : now.plus(30, ChronoUnit.DAYS);

        Subscription subscription = subscriptionRepository
                .findFirstByTenantIdOrderByCreatedAtDesc(tenantId)
                .orElseGet(Subscription::new);

        subscription.setTenantId(tenantId);
        subscription.setPlanId(plan.getId());
        subscription.setBillingCycle(request.billingCycle());
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setCurrentPeriodStart(now);
        subscription.setCurrentPeriodEnd(periodEnd);
        subscription.setCancelAtPeriodEnd(false);
        subscriptionRepository.save(subscription);

        issueInvoice(tenantId, subscription, plan);

        return toSubscriptionResponse(subscription, plan);
    }

    @Transactional(readOnly = true)
    public BillingDtos.SubscriptionResponse currentSubscription(String tenantId) {
        Subscription subscription = subscriptionRepository
                .findFirstByTenantIdOrderByCreatedAtDesc(tenantId)
                .orElseThrow(() -> ApiException.notFound("Subscription for tenant", tenantId));

        Plan plan = planRepository.findById(subscription.getPlanId())
                .orElseThrow(() -> ApiException.notFound("Plan", subscription.getPlanId()));

        return toSubscriptionResponse(subscription, plan);
    }

    @Transactional(readOnly = true)
    public Page<BillingDtos.InvoiceResponse> invoices(String tenantId, Pageable pageable) {
        return invoiceRepository.findByTenantId(tenantId, pageable).map(this::toInvoiceResponse);
    }

    @Transactional(readOnly = true)
    public BillingDtos.InvoiceResponse invoice(String tenantId, String id) {
        return toInvoiceResponse(invoiceRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> ApiException.notFound("Invoice", id)));
    }

    @Transactional(readOnly = true)
    public BillingDtos.UsageResponse usage(String tenantId) {
        Subscription subscription = subscriptionRepository
                .findFirstByTenantIdOrderByCreatedAtDesc(tenantId)
                .orElse(null);

        Integer allowance = null;
        int used = 0;

        if (subscription != null) {
            used = subscription.getConversationsUsed();
            allowance = planRepository.findById(subscription.getPlanId())
                    .map(Plan::getConversationAllowance)
                    .orElse(null);
        }

        int billableOverage = allowance == null ? used : Math.max(0, used - allowance);

        return new BillingDtos.UsageResponse(
                tenantId,
                used,
                allowance,
                (int) contactRepository.countByTenantId(tenantId),
                invoiceRepository.countByTenantIdAndStatus(tenantId, InvoiceStatus.PAID),
                CONVERSATION_UNIT_COST.multiply(BigDecimal.valueOf(billableOverage))
                        .setScale(2, RoundingMode.HALF_UP));
    }

    private void issueInvoice(String tenantId, Subscription subscription, Plan plan) {
        BigDecimal platformAmount = subscription.getBillingCycle() == BillingCycle.YEARLY
                ? plan.getYearlyPrice()
                : plan.getMonthlyPrice();

        BigDecimal conversationAmount = CONVERSATION_UNIT_COST
                .multiply(BigDecimal.valueOf(subscription.getConversationsUsed()))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal net = platformAmount.add(conversationAmount);
        BigDecimal tax = net.multiply(GST_RATE).setScale(2, RoundingMode.HALF_UP);

        Invoice invoice = new Invoice();
        invoice.setTenantId(tenantId);
        invoice.setInvoiceNumber(nextInvoiceNumber());
        invoice.setSubscriptionId(subscription.getId());
        invoice.setPlatformAmount(platformAmount);
        invoice.setConversationAmount(conversationAmount);
        invoice.setTaxAmount(tax);
        invoice.setTotalAmount(net.add(tax));
        invoice.setStatus(InvoiceStatus.ISSUED);
        invoice.setIssueDate(LocalDate.now());
        invoice.setDueDate(LocalDate.now().plusDays(7));

        invoiceRepository.save(invoice);
    }

    private String nextInvoiceNumber() {
        LocalDate today = LocalDate.now();
        return "HF-%d%02d-%06d".formatted(
                today.getYear(),
                today.getMonthValue(),
                ThreadLocalRandom.current().nextInt(1, 999_999));
    }

    private BillingDtos.PlanResponse toPlanResponse(Plan plan) {
        List<String> features = plan.getFeatureList() == null
                ? List.of()
                : Arrays.stream(plan.getFeatureList().split("\\|")).map(String::trim).toList();

        return new BillingDtos.PlanResponse(
                plan.getId(),
                plan.getName(),
                plan.getDescription(),
                plan.getMonthlyPrice(),
                plan.getYearlyPrice(),
                plan.getCurrency(),
                plan.getConversationAllowance(),
                plan.getSeatLimit(),
                plan.isFeatured(),
                features);
    }

    private BillingDtos.SubscriptionResponse toSubscriptionResponse(Subscription subscription, Plan plan) {
        return new BillingDtos.SubscriptionResponse(
                subscription.getId(),
                plan.getId(),
                plan.getName(),
                subscription.getBillingCycle(),
                subscription.getStatus(),
                subscription.getCurrentPeriodStart(),
                subscription.getCurrentPeriodEnd(),
                subscription.isCancelAtPeriodEnd(),
                subscription.getConversationsUsed(),
                plan.getConversationAllowance());
    }

    private BillingDtos.InvoiceResponse toInvoiceResponse(Invoice invoice) {
        return new BillingDtos.InvoiceResponse(
                invoice.getId(),
                invoice.getInvoiceNumber(),
                invoice.getPlatformAmount(),
                invoice.getConversationAmount(),
                invoice.getTaxAmount(),
                invoice.getTotalAmount(),
                invoice.getCurrency(),
                invoice.getStatus(),
                invoice.getIssueDate(),
                invoice.getDueDate(),
                invoice.getPaidAt());
    }
}
