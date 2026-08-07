package io.hubflow.core.service;

import io.hubflow.core.domain.CampaignStatus;
import io.hubflow.core.domain.EmployeeStatus;
import io.hubflow.core.domain.InvoiceStatus;
import io.hubflow.core.domain.LifecycleStage;
import io.hubflow.core.repository.CampaignRepository;
import io.hubflow.core.repository.ContactRepository;
import io.hubflow.core.repository.EmployeeRepository;
import io.hubflow.core.repository.InvoiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class ReportService {

    private final ContactRepository contactRepository;
    private final CampaignRepository campaignRepository;
    private final InvoiceRepository invoiceRepository;
    private final EmployeeRepository employeeRepository;
    private final DealService dealService;

    public ReportService(
            ContactRepository contactRepository,
            CampaignRepository campaignRepository,
            InvoiceRepository invoiceRepository,
            EmployeeRepository employeeRepository,
            DealService dealService) {

        this.contactRepository = contactRepository;
        this.campaignRepository = campaignRepository;
        this.invoiceRepository = invoiceRepository;
        this.employeeRepository = employeeRepository;
        this.dealService = dealService;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> summary(String tenantId) {
        Map<String, Long> contactsByStage = new LinkedHashMap<>();
        for (LifecycleStage stage : LifecycleStage.values()) {
            contactsByStage.put(stage.name(), contactRepository.countByTenantIdAndLifecycleStage(tenantId, stage));
        }

        Map<String, Long> campaignsByStatus = new LinkedHashMap<>();
        for (CampaignStatus status : CampaignStatus.values()) {
            long count = campaignRepository.countByTenantIdAndStatus(tenantId, status);
            if (count > 0) {
                campaignsByStatus.put(status.name(), count);
            }
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("tenantId", tenantId);
        result.put("totalContacts", contactRepository.countByTenantId(tenantId));
        result.put("contactsByStage", contactsByStage);
        result.put("campaignsByStatus", campaignsByStatus);
        result.put("pipeline", dealService.pipeline(tenantId));
        result.put("invoicesPaid", invoiceRepository.countByTenantIdAndStatus(tenantId, InvoiceStatus.PAID));
        result.put("invoicesOverdue", invoiceRepository.countByTenantIdAndStatus(tenantId, InvoiceStatus.OVERDUE));
        result.put("activeEmployees", employeeRepository.countByTenantIdAndStatus(tenantId, EmployeeStatus.ACTIVE));

        return result;
    }
}
