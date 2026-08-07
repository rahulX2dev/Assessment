#pragma once

#include <memory>
#include <string>

#include "Contact.hpp"

namespace hubflow {

class ScoringStrategy {
public:
    virtual ~ScoringStrategy() = default;
    virtual int score(const Contact& contact) const = 0;
    virtual std::string name() const = 0;
};

class WeightedScorer : public ScoringStrategy {
public:
    int score(const Contact& contact) const override;
    std::string name() const override { return "weighted"; }
};

class RecencyBiasedScorer : public ScoringStrategy {
public:
    explicit RecencyBiasedScorer(double recencyWeight = 1.6);

    int score(const Contact& contact) const override;
    std::string name() const override { return "recency-biased"; }

private:
    double recencyWeight_;
};

class LeadProcessor {
public:
    explicit LeadProcessor(std::unique_ptr<ScoringStrategy> strategy);

    void apply(ContactList& contacts) const;
    const ScoringStrategy& strategy() const { return *strategy_; }

    static std::unique_ptr<ScoringStrategy> strategyFor(const std::string& name);

private:
    std::unique_ptr<ScoringStrategy> strategy_;
};

}  // namespace hubflow
