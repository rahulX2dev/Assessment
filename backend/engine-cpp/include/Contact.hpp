#pragma once

#include <string>
#include <vector>

namespace hubflow {

enum class Priority { Low = 0, Normal = 1, High = 2, Urgent = 3 };

const char* toString(Priority priority);

class Contact {
public:
    Contact() = default;
    Contact(std::string id, std::string name, std::string phone);

    const std::string& id() const { return id_; }
    const std::string& name() const { return name_; }
    const std::string& phone() const { return phone_; }
    const std::string& email() const { return email_; }
    const std::string& segment() const { return segment_; }

    int replies() const { return replies_; }
    int pageViews() const { return pageViews_; }
    int daysSinceLastTouch() const { return daysSinceLastTouch_; }
    bool openedPricing() const { return openedPricing_; }
    bool optedOut() const { return optedOut_; }
    int score() const { return score_; }
    Priority priority() const { return priority_; }

    void setEmail(std::string email) { email_ = std::move(email); }
    void setSegment(std::string segment) { segment_ = std::move(segment); }
    void setReplies(int value) { replies_ = value; }
    void setPageViews(int value) { pageViews_ = value; }
    void setDaysSinceLastTouch(int value) { daysSinceLastTouch_ = value; }
    void setOpenedPricing(bool value) { openedPricing_ = value; }
    void setOptedOut(bool value) { optedOut_ = value; }
    void setScore(int value);

    bool isReachable() const;
    static bool isValidPhone(const std::string& phone);
    static std::string normalisePhone(const std::string& raw);

private:
    std::string id_;
    std::string name_;
    std::string phone_;
    std::string email_;
    std::string segment_ = "default";

    int replies_ = 0;
    int pageViews_ = 0;
    int daysSinceLastTouch_ = 0;
    bool openedPricing_ = false;
    bool optedOut_ = false;

    int score_ = 0;
    Priority priority_ = Priority::Low;
};

using ContactList = std::vector<Contact>;

}  // namespace hubflow
