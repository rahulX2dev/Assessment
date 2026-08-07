#pragma once

#include <memory>
#include <string>
#include <vector>

#include "Analytics.hpp"
#include "CampaignEngine.hpp"

namespace hubflow {

class ReportWriter {
public:
    virtual ~ReportWriter() = default;

    virtual void write(const std::string& path,
                       const CampaignSummary& summary,
                       const std::vector<DeliveryRecord>& records) const = 0;

    virtual std::string extension() const = 0;

    static std::unique_ptr<ReportWriter> forFormat(const std::string& format);
};

class CsvReportWriter : public ReportWriter {
public:
    void write(const std::string& path,
               const CampaignSummary& summary,
               const std::vector<DeliveryRecord>& records) const override;

    std::string extension() const override { return "csv"; }
};

class JsonReportWriter : public ReportWriter {
public:
    void write(const std::string& path,
               const CampaignSummary& summary,
               const std::vector<DeliveryRecord>& records) const override;

    std::string extension() const override { return "json"; }
};

class TextReportWriter : public ReportWriter {
public:
    void write(const std::string& path,
               const CampaignSummary& summary,
               const std::vector<DeliveryRecord>& records) const override;

    std::string extension() const override { return "txt"; }
};

}  // namespace hubflow
