#include "LeadScorer.hpp"

#include <algorithm>
#include <cmath>
#include <stdexcept>

namespace hubflow {

namespace {

int recencyPoints(int days) {
    if (days <= 1) return 25;
    if (days <= 3) return 18;
    if (days <= 7) return 12;
    if (days <= 14) return 6;
    if (days <= 30) return 2;
    return 0;
}

}  // namespace

int WeightedScorer::score(const Contact& contact) const {
    int total = 0;
    total += std::min(contact.replies() * 8, 32);
    total += std::min(contact.pageViews() * 3, 18);
    total += contact.openedPricing() ? 20 : 0;
    total += recencyPoints(contact.daysSinceLastTouch());

    return std::clamp(total, 0, 100);
}

RecencyBiasedScorer::RecencyBiasedScorer(double recencyWeight)
    : recencyWeight_(recencyWeight) {}

int RecencyBiasedScorer::score(const Contact& contact) const {
    const double engagement =
        std::min(contact.replies() * 8, 32) +
        std::min(contact.pageViews() * 3, 18) +
        (contact.openedPricing() ? 20 : 0);

    const double recency = recencyPoints(contact.daysSinceLastTouch()) * recencyWeight_;
    const double total = engagement + recency;

    return std::clamp(static_cast<int>(std::lround(total)), 0, 100);
}

LeadProcessor::LeadProcessor(std::unique_ptr<ScoringStrategy> strategy)
    : strategy_(std::move(strategy)) {
    if (!strategy_) {
        throw std::invalid_argument("LeadProcessor requires a scoring strategy");
    }
}

void LeadProcessor::apply(ContactList& contacts) const {
    for (auto& contact : contacts) {
        contact.setScore(strategy_->score(contact));
    }
}

std::unique_ptr<ScoringStrategy> LeadProcessor::strategyFor(const std::string& name) {
    if (name == "recency") {
        return std::make_unique<RecencyBiasedScorer>();
    }
    if (name == "weighted" || name.empty()) {
        return std::make_unique<WeightedScorer>();
    }
    throw std::invalid_argument("Unknown scoring strategy: " + name);
}

}  // namespace hubflow
