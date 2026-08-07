#include <algorithm>
#include <cstdio>
#include <cstdlib>
#include <exception>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <stdexcept>
#include <string>
#include <thread>
#include <vector>

#include "Analytics.hpp"
#include "CampaignEngine.hpp"
#include "Contact.hpp"
#include "CsvReader.hpp"
#include "LeadScorer.hpp"
#include "Logger.hpp"
#include "ReportWriter.hpp"

namespace {

struct Options {
    std::string input;
    std::string outDir = "reports";
    std::string campaignId = "cmp_local";
    std::string templateName = "monsoon_offer";
    std::string strategy = "weighted";
    std::string format = "csv";
    std::size_t workers = 0;
    bool verbose = false;
};

void printUsage() {
    std::cout <<
        "hubflow_engine - bulk campaign processing engine\n\n"
        "Usage:\n"
        "  hubflow_engine --input <contacts.csv> [options]\n\n"
        "Options:\n"
        "  --input <path>       CSV file with contacts (required)\n"
        "  --out <dir>          Output directory for reports (default: reports)\n"
        "  --campaign <id>      Campaign identifier (default: cmp_local)\n"
        "  --template <name>    Template name to dispatch (default: monsoon_offer)\n"
        "  --strategy <name>    Lead scoring strategy: weighted | recency\n"
        "  --format <fmt>       Report format: csv | json | txt (default: csv)\n"
        "  --workers <n>        Worker threads (default: hardware concurrency)\n"
        "  --verbose            Enable debug logging\n"
        "  --help               Show this message\n";
}

bool parseArgs(int argc, char** argv, Options& options, std::string& error) {
    for (int i = 1; i < argc; ++i) {
        const std::string arg = argv[i];

        auto requireValue = [&](std::string& target) {
            if (i + 1 >= argc) {
                error = arg + " requires a value";
                return false;
            }
            target = argv[++i];
            return true;
        };

        if (arg == "--help" || arg == "-h") {
            printUsage();
            std::exit(0);
        } else if (arg == "--input") {
            if (!requireValue(options.input)) return false;
        } else if (arg == "--out") {
            if (!requireValue(options.outDir)) return false;
        } else if (arg == "--campaign") {
            if (!requireValue(options.campaignId)) return false;
        } else if (arg == "--template") {
            if (!requireValue(options.templateName)) return false;
        } else if (arg == "--strategy") {
            if (!requireValue(options.strategy)) return false;
        } else if (arg == "--format") {
            if (!requireValue(options.format)) return false;
        } else if (arg == "--workers") {
            std::string value;
            if (!requireValue(value)) return false;
            try {
                options.workers = static_cast<std::size_t>(std::stoul(value));
            } catch (const std::exception&) {
                error = "--workers expects a positive integer";
                return false;
            }
        } else if (arg == "--verbose") {
            options.verbose = true;
        } else {
            error = "Unknown argument: " + arg;
            return false;
        }
    }

    if (options.input.empty()) {
        error = "--input is required";
        return false;
    }

    return true;
}

hubflow::ContactList loadContacts(const std::string& path, std::size_t& rejected) {
    std::ifstream file(path, std::ios::binary);
    if (!file) {
        throw std::runtime_error("Could not open input file: " + path);
    }

    hubflow::CsvReader reader(file);
    reader.requireColumns({"id", "name", "phone"});

    hubflow::ContactList contacts;
    hubflow::CsvRow row(nullptr, {}, 0);

    while (reader.next(row)) {
        const std::string id = row.get("id");
        const std::string name = row.get("name");
        const std::string phone = hubflow::Contact::normalisePhone(row.get("phone"));

        if (id.empty() || name.empty() || phone.empty()) {
            ++rejected;
            continue;
        }

        hubflow::Contact contact(id, name, phone);
        contact.setEmail(row.get("email"));
        contact.setSegment(row.get("segment", "default"));
        contact.setReplies(row.getInt("replies"));
        contact.setPageViews(row.getInt("page_views"));
        contact.setDaysSinceLastTouch(row.getInt("days_since_last_touch", 999));
        contact.setOpenedPricing(row.getBool("opened_pricing"));
        contact.setOptedOut(row.getBool("opted_out"));

        contacts.push_back(std::move(contact));
    }

    return contacts;
}

void ensureDirectory(const std::string& path) {
    std::ofstream probe(path + "/.hubflow_probe", std::ios::trunc);
    if (!probe) {
        throw std::runtime_error(
            "Output directory does not exist or is not writable: " + path);
    }
    probe.close();
    std::remove((path + "/.hubflow_probe").c_str());
}

}  // namespace

int main(int argc, char** argv) {
    Options options;
    std::string error;

    if (!parseArgs(argc, argv, options, error)) {
        std::cerr << "error: " << error << "\n\n";
        printUsage();
        return 2;
    }

    auto& logger = hubflow::Logger::instance();
    logger.setLevel(options.verbose ? hubflow::LogLevel::Debug : hubflow::LogLevel::Info);

    try {
        ensureDirectory(options.outDir);

        std::size_t rejected = 0;
        hubflow::ContactList contacts = loadContacts(options.input, rejected);

        if (contacts.empty()) {
            logger.error("no usable contacts were parsed from " + options.input);
            return 1;
        }

        logger.info("loaded " + std::to_string(contacts.size()) + " contacts, rejected " +
                    std::to_string(rejected) + " malformed rows");

        hubflow::LeadProcessor processor(hubflow::LeadProcessor::strategyFor(options.strategy));
        processor.apply(contacts);
        logger.info("scored contacts using the " + processor.strategy().name() + " strategy");

        hubflow::CampaignConfig config;
        config.campaignId = options.campaignId;
        config.templateName = options.templateName;
        config.workers = options.workers > 0
                             ? options.workers
                             : std::max(1u, std::thread::hardware_concurrency());

        hubflow::CampaignEngine engine(config);
        const std::vector<hubflow::DeliveryRecord> records = engine.run(contacts);

        hubflow::AnalyticsEngine analytics;
        const hubflow::CampaignSummary summary = analytics.summarise(
            options.campaignId, contacts, records,
            engine.elapsedSeconds(), engine.throughputPerSecond());

        const auto writer = hubflow::ReportWriter::forFormat(options.format);
        const std::string reportPath =
            options.outDir + "/" + options.campaignId + "_report." + writer->extension();
        writer->write(reportPath, summary, records);

        logger.info("report written to " + reportPath);

        std::cout << '\n'
                  << std::fixed << std::setprecision(2)
                  << "Contacts      : " << summary.totalContacts << '\n'
                  << "Dispatched    : " << summary.dispatched << '\n'
                  << "Skipped       : " << summary.skipped << '\n'
                  << "Delivery rate : " << summary.deliveryRate << " %\n"
                  << "Read rate     : " << summary.readRate << " %\n"
                  << "Failure rate  : " << summary.failureRate << " %\n"
                  << "Avg score     : " << summary.averageScore << '\n'
                  << "Throughput    : " << summary.throughputPerSecond << " msg/s\n"
                  << "P95 latency   : " << summary.p95LatencyMicros << " us\n";

        return 0;
    } catch (const hubflow::CsvError& ex) {
        logger.error(std::string("csv error on line ") + std::to_string(ex.line()) + ": " + ex.what());
        return 1;
    } catch (const std::exception& ex) {
        logger.error(std::string("fatal: ") + ex.what());
        return 1;
    }
}
