#include "ReportWriter.hpp"

#include <fstream>
#include <iomanip>
#include <sstream>
#include <stdexcept>

namespace hubflow {

namespace {

std::string escapeCsv(const std::string& value) {
    if (value.find_first_of(",\"\n") == std::string::npos) {
        return value;
    }

    std::string escaped = "\"";
    for (const char c : value) {
        if (c == '"') {
            escaped += "\"\"";
        } else {
            escaped += c;
        }
    }
    escaped += '"';
    return escaped;
}

std::string escapeJson(const std::string& value) {
    std::string escaped;
    escaped.reserve(value.size() + 8);

    for (const char c : value) {
        switch (c) {
            case '"':  escaped += "\\\""; break;
            case '\\': escaped += "\\\\"; break;
            case '\n': escaped += "\\n"; break;
            case '\r': escaped += "\\r"; break;
            case '\t': escaped += "\\t"; break;
            default:   escaped += c;
        }
    }

    return escaped;
}

std::ofstream openOrThrow(const std::string& path) {
    std::ofstream out(path, std::ios::binary | std::ios::trunc);
    if (!out) {
        throw std::runtime_error("Could not open report file for writing: " + path);
    }
    return out;
}

}  // namespace

std::unique_ptr<ReportWriter> ReportWriter::forFormat(const std::string& format) {
    if (format == "json") {
        return std::make_unique<JsonReportWriter>();
    }
    if (format == "txt" || format == "text") {
        return std::make_unique<TextReportWriter>();
    }
    if (format == "csv" || format.empty()) {
        return std::make_unique<CsvReportWriter>();
    }
    throw std::invalid_argument("Unsupported report format: " + format);
}

void CsvReportWriter::write(const std::string& path,
                            const CampaignSummary& summary,
                            const std::vector<DeliveryRecord>& records) const {
    std::ofstream out = openOrThrow(path);

    out << "message_id,contact_id,phone,priority,state,attempts,latency_micros,failure_reason\n";

    for (const auto& record : records) {
        out << escapeCsv(record.messageId) << ','
            << escapeCsv(record.contactId) << ','
            << escapeCsv(record.phone) << ','
            << toString(record.priority) << ','
            << toString(record.state) << ','
            << record.attempts << ','
            << record.latencyMicros << ','
            << escapeCsv(record.failureReason) << '\n';
    }

    out << "\n# campaign," << escapeCsv(summary.campaignId)
        << "\n# dispatched," << summary.dispatched
        << "\n# skipped," << summary.skipped
        << "\n# delivery_rate," << std::fixed << std::setprecision(2) << summary.deliveryRate
        << "\n# read_rate," << summary.readRate
        << "\n# failure_rate," << summary.failureRate << '\n';
}

void JsonReportWriter::write(const std::string& path,
                             const CampaignSummary& summary,
                             const std::vector<DeliveryRecord>& records) const {
    std::ofstream out = openOrThrow(path);
    out << std::fixed << std::setprecision(2);

    out << "{\n  \"campaignId\": \"" << escapeJson(summary.campaignId) << "\",\n";
    out << "  \"totalContacts\": " << summary.totalContacts << ",\n";
    out << "  \"dispatched\": " << summary.dispatched << ",\n";
    out << "  \"skipped\": " << summary.skipped << ",\n";
    out << "  \"deliveryRate\": " << summary.deliveryRate << ",\n";
    out << "  \"readRate\": " << summary.readRate << ",\n";
    out << "  \"failureRate\": " << summary.failureRate << ",\n";
    out << "  \"averageScore\": " << summary.averageScore << ",\n";
    out << "  \"hotLeads\": " << summary.hotLeads << ",\n";
    out << "  \"warmLeads\": " << summary.warmLeads << ",\n";
    out << "  \"elapsedSeconds\": " << summary.elapsedSeconds << ",\n";
    out << "  \"throughputPerSecond\": " << summary.throughputPerSecond << ",\n";
    out << "  \"averageLatencyMicros\": " << summary.averageLatencyMicros << ",\n";
    out << "  \"p95LatencyMicros\": " << summary.p95LatencyMicros << ",\n";

    out << "  \"byState\": {";
    bool first = true;
    for (const auto& entry : summary.byState) {
        if (!first) out << ", ";
        out << '"' << escapeJson(entry.first) << "\": " << entry.second;
        first = false;
    }
    out << "},\n";

    out << "  \"byPriority\": {";
    first = true;
    for (const auto& entry : summary.byPriority) {
        if (!first) out << ", ";
        out << '"' << escapeJson(entry.first) << "\": " << entry.second;
        first = false;
    }
    out << "},\n";

    out << "  \"segments\": [\n";
    for (std::size_t i = 0; i < summary.segments.size(); ++i) {
        const auto& segment = summary.segments[i];
        out << "    {\"segment\": \"" << escapeJson(segment.segment)
            << "\", \"contacts\": " << segment.contacts
            << ", \"averageScore\": " << segment.averageScore() << '}';
        if (i + 1 < summary.segments.size()) out << ',';
        out << '\n';
    }
    out << "  ],\n";

    out << "  \"records\": " << records.size() << "\n}\n";
}

void TextReportWriter::write(const std::string& path,
                             const CampaignSummary& summary,
                             const std::vector<DeliveryRecord>& records) const {
    std::ofstream out = openOrThrow(path);
    out << std::fixed << std::setprecision(2);

    out << "HUBFLOW CAMPAIGN REPORT\n";
    out << "=======================\n\n";
    out << "Campaign        : " << summary.campaignId << '\n';
    out << "Contacts        : " << summary.totalContacts << '\n';
    out << "Dispatched      : " << summary.dispatched << '\n';
    out << "Skipped         : " << summary.skipped << '\n';
    out << "Records written : " << records.size() << "\n\n";

    out << "DELIVERY\n--------\n";
    out << "Delivery rate   : " << summary.deliveryRate << " %\n";
    out << "Read rate       : " << summary.readRate << " %\n";
    out << "Failure rate    : " << summary.failureRate << " %\n\n";

    out << "PERFORMANCE\n-----------\n";
    out << "Elapsed         : " << summary.elapsedSeconds << " s\n";
    out << "Throughput      : " << summary.throughputPerSecond << " msg/s\n";
    out << "Avg latency     : " << summary.averageLatencyMicros << " us\n";
    out << "P95 latency     : " << summary.p95LatencyMicros << " us\n\n";

    out << "LEADS\n-----\n";
    out << "Average score   : " << summary.averageScore << '\n';
    out << "Hot leads       : " << summary.hotLeads << '\n';
    out << "Warm leads      : " << summary.warmLeads << "\n\n";

    out << "BY STATE\n--------\n";
    for (const auto& entry : summary.byState) {
        out << "  " << std::left << std::setw(12) << entry.first << entry.second << '\n';
    }

    out << "\nBY SEGMENT\n----------\n";
    for (const auto& segment : summary.segments) {
        out << "  " << std::left << std::setw(16) << segment.segment
            << "contacts=" << segment.contacts
            << "  avg_score=" << segment.averageScore() << '\n';
    }
}

}  // namespace hubflow
