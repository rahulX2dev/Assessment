package io.hubflow.core.service;

import io.hubflow.core.common.exception.ApiException;
import io.hubflow.core.domain.Contact;
import io.hubflow.core.domain.LifecycleStage;
import io.hubflow.core.dto.CrmDtos;
import io.hubflow.core.repository.ContactRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Transactional(readOnly = true)
    public Page<CrmDtos.ContactResponse> search(
            String tenantId, String search, LifecycleStage stage, String ownerId, Pageable pageable) {

        String term = (search == null || search.isBlank()) ? null : search.trim();
        return contactRepository.search(tenantId, term, stage, ownerId, pageable).map(this::toResponse);
    }

    @Transactional
    public CrmDtos.ContactResponse create(String tenantId, CrmDtos.ContactRequest request) {
        if (contactRepository.existsByTenantIdAndPhone(tenantId, request.phone())) {
            throw ApiException.conflict("A contact with this phone number already exists");
        }

        Contact contact = new Contact();
        contact.setTenantId(tenantId);
        apply(contact, request);

        return toResponse(contactRepository.save(contact));
    }

    @Transactional(readOnly = true)
    public CrmDtos.ContactResponse get(String tenantId, String id) {
        return toResponse(requireContact(tenantId, id));
    }

    @Transactional
    public CrmDtos.ContactResponse update(String tenantId, String id, CrmDtos.ContactRequest request) {
        Contact contact = requireContact(tenantId, id);

        contactRepository.findByTenantIdAndPhone(tenantId, request.phone())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw ApiException.conflict("Another contact already uses this phone number");
                });

        apply(contact, request);
        return toResponse(contactRepository.save(contact));
    }

    @Transactional
    public void delete(String tenantId, String id) {
        contactRepository.delete(requireContact(tenantId, id));
    }

    @Transactional(readOnly = true)
    public long countForTenant(String tenantId) {
        return contactRepository.countByTenantId(tenantId);
    }

    private Contact requireContact(String tenantId, String id) {
        return contactRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> ApiException.notFound("Contact", id));
    }

    private void apply(Contact contact, CrmDtos.ContactRequest request) {
        contact.setFullName(request.fullName());
        contact.setPhone(request.phone());
        contact.setEmail(request.email() == null ? null : request.email().toLowerCase(Locale.ROOT));
        contact.setCompanyName(request.companyName());
        contact.setOwnerId(request.ownerId());
        contact.setTags(request.tags());
        contact.setSource(request.source());

        if (request.lifecycleStage() != null) {
            contact.setLifecycleStage(request.lifecycleStage());
        }
    }

    private CrmDtos.ContactResponse toResponse(Contact contact) {
        return new CrmDtos.ContactResponse(
                contact.getId(),
                contact.getFullName(),
                contact.getPhone(),
                contact.getEmail(),
                contact.getCompanyName(),
                contact.getLifecycleStage(),
                contact.getOwnerId(),
                contact.getLeadScore(),
                contact.getTags(),
                contact.getSource(),
                contact.isOptedOut(),
                contact.getLastContactedAt(),
                contact.getCreatedAt());
    }
}
