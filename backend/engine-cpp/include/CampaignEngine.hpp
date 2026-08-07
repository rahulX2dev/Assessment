#pragma once

#include <atomic>
#include <cstddef>
#include <mutex>
#include <string>
#include <thread>
#include <vector>

#include "Contact.hpp"
#include "MessageQueue.hpp"

namespace hubflow {

enum class DeliveryState { Queued, Sent, Delivered, Read, Failed, Skipped };

const char* toString(DeliveryState state);

struct DeliveryRecord {
    std::string messageId;
    std::string contactId;
    std::string phone;
    Priority priority = Priority::Low;
    DeliveryState state = DeliveryState::Queued;
    int attempts = 0;
    long long latencyMicros = 0;
    std::string failureReason;
};

struct CampaignConfig {
    std::string campaignId = "cmp_local";
    std::string templateName = "monsoon_offer";
    std::size_t workers = 4;
    int maxAttempts = 3;
    unsigned failureSeed = 42;
    double failureRate = 0.06;
};

class CampaignEngine {
public:
    explicit CampaignEngine(CampaignConfig config);

    std::vector<DeliveryRecord> run(const ContactList& contacts);

    std::size_t skipped() const { return skipped_.load(); }
    double elapsedSeconds() const { return elapsedSeconds_; }
    double throughputPerSecond() const;

private:
    void worker(std::size_t workerId);
    std::vector<OutboundMessage> buildMessages(const ContactList& contacts);
    static DeliveryState simulateDelivery(const OutboundMessage& message, unsigned& state, double failureRate);

    CampaignConfig config_;
    BulkMessageQueue queue_;

    std::mutex resultsMutex_;
    std::vector<DeliveryRecord> results_;

    std::atomic<std::size_t> skipped_{0};
    std::atomic<std::size_t> processed_{0};
    double elapsedSeconds_ = 0.0;
};

}  // namespace hubflow
