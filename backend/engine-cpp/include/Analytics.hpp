#pragma once

#include <cstddef>
#include <map>
#include <string>
#include <vector>

#include "CampaignEngine.hpp"
#include "Contact.hpp"

namespace hubflow {

struct SegmentStat {
    std::string segment;
    std::size_t contacts = 0;
    long long scoreTotal = 0;

    double averageScore() const {
        return contacts == 0 ? 0.0 : static_cast<double>(scoreTotal) / static_cast<double>(contacts);
    }
};

struct CampaignSummary {
    std::string campaignId;
    std::size_t totalContacts = 0;
    std::size_t dispatched = 0;
    std::size_t skipped = 0;

    std::map<std::string, std::size_t> byState;
    std::map<std::string, std::size_t> byPriority;
    std::vector<SegmentStat> segments;

    double deliveryRate = 0.0;
    double readRate = 0.0;
    double failureRate = 0.0;
    double averageLatencyMicros = 0.0;
    double p95LatencyMicros = 0.0;
    double throughputPerSecond = 0.0;
    double elapsedSeconds = 0.0;

    std::size_t hotLeads = 0;
    std::size_t warmLeads = 0;
    double averageScore = 0.0;
};

class AnalyticsEngine {
public:
    CampaignSummary summarise(const std::string& campaignId,
                              const ContactList& contacts,
                              const std::vector<DeliveryRecord>& records,
                              double elapsedSeconds,
                              double throughput) const;

private:
    static double percentile(std::vector<long long> values, double fraction);
};

}  // namespace hubflow
