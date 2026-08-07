#include "CampaignEngine.hpp"

#include <chrono>
#include <sstream>

#include "Logger.hpp"

namespace hubflow {

namespace {

unsigned nextRandom(unsigned& state) {
    state = state * 1664525u + 1013904223u;
    return state;
}

std::string makeMessageId(const std::string& campaignId, std::size_t index) {
    std::ostringstream out;
    out << "wamid." << campaignId << '.' << index;
    return out.str();
}

}  // namespace

const char* toString(DeliveryState state) {
    switch (state) {
        case DeliveryState::Queued:    return "QUEUED";
        case DeliveryState::Sent:      return "SENT";
        case DeliveryState::Delivered: return "DELIVERED";
        case DeliveryState::Read:      return "READ";
        case DeliveryState::Failed:    return "FAILED";
        case DeliveryState::Skipped:   return "SKIPPED";
    }
    return "QUEUED";
}

CampaignEngine::CampaignEngine(CampaignConfig config)
    : config_(std::move(config)), queue_(0) {

    if (config_.workers == 0) {
        config_.workers = 1;
    }
}

std::vector<OutboundMessage> CampaignEngine::buildMessages(const ContactList& contacts) {
    std::vector<OutboundMessage> messages;
    messages.reserve(contacts.size());

    std::size_t index = 0;
    for (const auto& contact : contacts) {
        if (!contact.isReachable()) {
            skipped_.fetch_add(1);

            DeliveryRecord record;
            record.messageId = "-";
            record.contactId = contact.id();
            record.phone = contact.phone();
            record.priority = contact.priority();
            record.state = DeliveryState::Skipped;
            record.failureReason = contact.optedOut() ? "opted_out" : "invalid_phone";

            std::lock_guard<std::mutex> guard(resultsMutex_);
            results_.push_back(std::move(record));
            continue;
        }

        OutboundMessage message;
        message.messageId = makeMessageId(config_.campaignId, index++);
        message.contactId = contact.id();
        message.phone = contact.phone();
        message.templateName = config_.templateName;
        message.priority = contact.priority();
        message.body = "Hi " + contact.name() + ", " + config_.templateName + " is live for you.";

        messages.push_back(std::move(message));
    }

    return messages;
}

DeliveryState CampaignEngine::simulateDelivery(const OutboundMessage& message,
                                               unsigned& state,
                                               double failureRate) {
    const double roll = static_cast<double>(nextRandom(state) % 10000) / 10000.0;

    if (roll < failureRate) {
        return DeliveryState::Failed;
    }

    const double readRoll = static_cast<double>(nextRandom(state) % 10000) / 10000.0;
    if (message.priority >= Priority::High) {
        return readRoll < 0.72 ? DeliveryState::Read : DeliveryState::Delivered;
    }
    return readRoll < 0.48 ? DeliveryState::Read : DeliveryState::Delivered;
}

void CampaignEngine::worker(std::size_t workerId) {
    unsigned randomState = config_.failureSeed + static_cast<unsigned>(workerId) * 7919u;
    std::vector<DeliveryRecord> local;

    while (auto message = queue_.pop()) {
        const auto started = std::chrono::steady_clock::now();

        DeliveryRecord record;
        record.messageId = message->messageId;
        record.contactId = message->contactId;
        record.phone = message->phone;
        record.priority = message->priority;

        DeliveryState state = DeliveryState::Failed;
        int attempt = 0;

        while (attempt < config_.maxAttempts) {
            ++attempt;
            state = simulateDelivery(*message, randomState, config_.failureRate);
            if (state != DeliveryState::Failed) {
                break;
            }
        }

        record.attempts = attempt;
        record.state = state;
        if (state == DeliveryState::Failed) {
            record.failureReason = "provider_rejected_after_retries";
        }

        const auto finished = std::chrono::steady_clock::now();
        record.latencyMicros =
            std::chrono::duration_cast<std::chrono::microseconds>(finished - started).count();

        local.push_back(std::move(record));
        processed_.fetch_add(1);
    }

    std::lock_guard<std::mutex> guard(resultsMutex_);
    results_.insert(results_.end(),
                    std::make_move_iterator(local.begin()),
                    std::make_move_iterator(local.end()));
}

std::vector<DeliveryRecord> CampaignEngine::run(const ContactList& contacts) {
    auto& logger = Logger::instance();

    std::ostringstream startMessage;
    startMessage << "campaign " << config_.campaignId << " starting with " << contacts.size()
                 << " contacts across " << config_.workers << " workers";
    logger.info(startMessage.str());

    const auto started = std::chrono::steady_clock::now();

    std::vector<OutboundMessage> messages = buildMessages(contacts);

    std::vector<std::thread> pool;
    pool.reserve(config_.workers);
    for (std::size_t i = 0; i < config_.workers; ++i) {
        pool.emplace_back(&CampaignEngine::worker, this, i);
    }

    queue_.pushBatch(std::move(messages));
    queue_.close();

    for (auto& thread : pool) {
        thread.join();
    }

    const auto finished = std::chrono::steady_clock::now();
    elapsedSeconds_ =
        std::chrono::duration_cast<std::chrono::duration<double>>(finished - started).count();

    std::ostringstream doneMessage;
    doneMessage << "campaign " << config_.campaignId << " finished, dispatched "
                << queue_.dequeuedTotal() << " messages, skipped " << skipped_.load()
                << ", elapsed " << elapsedSeconds_ << "s";
    logger.info(doneMessage.str());

    std::lock_guard<std::mutex> guard(resultsMutex_);
    return results_;
}

double CampaignEngine::throughputPerSecond() const {
    if (elapsedSeconds_ <= 0.0) {
        return 0.0;
    }
    return static_cast<double>(processed_.load()) / elapsedSeconds_;
}

}  // namespace hubflow
