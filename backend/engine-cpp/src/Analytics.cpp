#include "Analytics.hpp"

#include <algorithm>
#include <cmath>
#include <unordered_map>

namespace hubflow {

double AnalyticsEngine::percentile(std::vector<long long> values, double fraction) {
    if (values.empty()) {
        return 0.0;
    }

    std::sort(values.begin(), values.end());

    const double position = fraction * static_cast<double>(values.size() - 1);
    const auto lower = static_cast<std::size_t>(std::floor(position));
    const auto upper = static_cast<std::size_t>(std::ceil(position));

    if (lower == upper) {
        return static_cast<double>(values[lower]);
    }

    const double weight = position - static_cast<double>(lower);
    return static_cast<double>(values[lower]) * (1.0 - weight) +
           static_cast<double>(values[upper]) * weight;
}

CampaignSummary AnalyticsEngine::summarise(const std::string& campaignId,
                                           const ContactList& contacts,
                                           const std::vector<DeliveryRecord>& records,
                                           double elapsedSeconds,
                                           double throughput) const {
    CampaignSummary summary;
    summary.campaignId = campaignId;
    summary.totalContacts = contacts.size();
    summary.elapsedSeconds = elapsedSeconds;
    summary.throughputPerSecond = throughput;

    std::unordered_map<std::string, SegmentStat> segments;
    long long scoreTotal = 0;

    for (const auto& contact : contacts) {
        scoreTotal += contact.score();

        if (contact.score() >= 75) {
            ++summary.hotLeads;
        } else if (contact.score() >= 45) {
            ++summary.warmLeads;
        }

        auto& stat = segments[contact.segment()];
        stat.segment = contact.segment();
        stat.contacts += 1;
        stat.scoreTotal += contact.score();

        summary.byPriority[toString(contact.priority())] += 1;
    }

    if (!contacts.empty()) {
        summary.averageScore =
            static_cast<double>(scoreTotal) / static_cast<double>(contacts.size());
    }

    std::vector<long long> latencies;
    latencies.reserve(records.size());

    std::size_t delivered = 0;
    std::size_t read = 0;
    std::size_t failed = 0;

    for (const auto& record : records) {
        summary.byState[toString(record.state)] += 1;

        if (record.state == DeliveryState::Skipped) {
            ++summary.skipped;
            continue;
        }

        ++summary.dispatched;
        latencies.push_back(record.latencyMicros);

        switch (record.state) {
            case DeliveryState::Read:
                ++read;
                ++delivered;
                break;
            case DeliveryState::Delivered:
                ++delivered;
                break;
            case DeliveryState::Failed:
                ++failed;
                break;
            default:
                break;
        }
    }

    const auto denominator = static_cast<double>(std::max<std::size_t>(summary.dispatched, 1));
    summary.deliveryRate = static_cast<double>(delivered) * 100.0 / denominator;
    summary.readRate = static_cast<double>(read) * 100.0 / denominator;
    summary.failureRate = static_cast<double>(failed) * 100.0 / denominator;

    if (!latencies.empty()) {
        long long total = 0;
        for (const auto value : latencies) {
            total += value;
        }
        summary.averageLatencyMicros =
            static_cast<double>(total) / static_cast<double>(latencies.size());
        summary.p95LatencyMicros = percentile(latencies, 0.95);
    }

    summary.segments.reserve(segments.size());
    for (auto& entry : segments) {
        summary.segments.push_back(entry.second);
    }

    std::sort(summary.segments.begin(), summary.segments.end(),
              [](const SegmentStat& left, const SegmentStat& right) {
                  return left.averageScore() > right.averageScore();
              });

    return summary;
}

}  // namespace hubflow
