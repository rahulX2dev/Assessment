#include "Contact.hpp"

#include <algorithm>
#include <cctype>

namespace hubflow {

const char* toString(Priority priority) {
    switch (priority) {
        case Priority::Low:    return "low";
        case Priority::Normal: return "normal";
        case Priority::High:   return "high";
        case Priority::Urgent: return "urgent";
    }
    return "low";
}

Contact::Contact(std::string id, std::string name, std::string phone)
    : id_(std::move(id)), name_(std::move(name)), phone_(std::move(phone)) {}

void Contact::setScore(int value) {
    score_ = std::clamp(value, 0, 100);

    if (score_ >= 80) {
        priority_ = Priority::Urgent;
    } else if (score_ >= 60) {
        priority_ = Priority::High;
    } else if (score_ >= 35) {
        priority_ = Priority::Normal;
    } else {
        priority_ = Priority::Low;
    }
}

bool Contact::isReachable() const {
    return !optedOut_ && isValidPhone(phone_);
}

bool Contact::isValidPhone(const std::string& phone) {
    if (phone.size() < 10 || phone.size() > 16) {
        return false;
    }

    std::size_t start = (phone[0] == '+') ? 1 : 0;
    if (start == 1 && phone.size() < 11) {
        return false;
    }

    for (std::size_t i = start; i < phone.size(); ++i) {
        if (!std::isdigit(static_cast<unsigned char>(phone[i]))) {
            return false;
        }
    }

    return phone[start] != '0';
}

std::string Contact::normalisePhone(const std::string& raw) {
    std::string digits;
    digits.reserve(raw.size());

    for (const char c : raw) {
        if (std::isdigit(static_cast<unsigned char>(c))) {
            digits += c;
        }
    }

    if (digits.size() == 10) {
        return "+91" + digits;
    }

    if (digits.size() > 10) {
        return "+" + digits;
    }

    return digits;
}

}  // namespace hubflow
