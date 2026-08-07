#pragma once

#include <atomic>
#include <condition_variable>
#include <cstddef>
#include <mutex>
#include <optional>
#include <queue>
#include <string>
#include <vector>

#include "Contact.hpp"

namespace hubflow {

struct OutboundMessage {
    std::string messageId;
    std::string contactId;
    std::string phone;
    std::string templateName;
    std::string body;
    Priority priority = Priority::Low;
    std::size_t sequence = 0;
    int attempt = 1;
};

struct MessageComparator {
    bool operator()(const OutboundMessage& left, const OutboundMessage& right) const {
        if (left.priority != right.priority) {
            return left.priority < right.priority;
        }
        return left.sequence > right.sequence;
    }
};

class BulkMessageQueue {
public:
    explicit BulkMessageQueue(std::size_t capacity = 0);

    void push(OutboundMessage message);
    void pushBatch(std::vector<OutboundMessage> messages);

    std::optional<OutboundMessage> pop();

    void close();
    bool closed() const;

    std::size_t size() const;
    std::size_t enqueuedTotal() const { return enqueued_.load(); }
    std::size_t dequeuedTotal() const { return dequeued_.load(); }
    std::size_t rejectedTotal() const { return rejected_.load(); }

private:
    mutable std::mutex mutex_;
    std::condition_variable notEmpty_;
    std::condition_variable notFull_;

    std::priority_queue<OutboundMessage, std::vector<OutboundMessage>, MessageComparator> queue_;
    std::size_t capacity_;
    bool closed_ = false;
    std::size_t nextSequence_ = 0;

    std::atomic<std::size_t> enqueued_{0};
    std::atomic<std::size_t> dequeued_{0};
    std::atomic<std::size_t> rejected_{0};
};

}  // namespace hubflow
