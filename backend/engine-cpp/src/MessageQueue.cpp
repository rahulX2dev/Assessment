#include "MessageQueue.hpp"

namespace hubflow {

BulkMessageQueue::BulkMessageQueue(std::size_t capacity) : capacity_(capacity) {}

void BulkMessageQueue::push(OutboundMessage message) {
    std::unique_lock<std::mutex> lock(mutex_);

    if (closed_) {
        rejected_.fetch_add(1);
        return;
    }

    if (capacity_ > 0) {
        notFull_.wait(lock, [this] { return closed_ || queue_.size() < capacity_; });
        if (closed_) {
            rejected_.fetch_add(1);
            return;
        }
    }

    message.sequence = nextSequence_++;
    queue_.push(std::move(message));
    enqueued_.fetch_add(1);

    lock.unlock();
    notEmpty_.notify_one();
}

void BulkMessageQueue::pushBatch(std::vector<OutboundMessage> messages) {
    for (auto& message : messages) {
        push(std::move(message));
    }
}

std::optional<OutboundMessage> BulkMessageQueue::pop() {
    std::unique_lock<std::mutex> lock(mutex_);

    notEmpty_.wait(lock, [this] { return closed_ || !queue_.empty(); });

    if (queue_.empty()) {
        return std::nullopt;
    }

    OutboundMessage message = queue_.top();
    queue_.pop();
    dequeued_.fetch_add(1);

    lock.unlock();
    notFull_.notify_one();

    return message;
}

void BulkMessageQueue::close() {
    {
        std::lock_guard<std::mutex> guard(mutex_);
        closed_ = true;
    }
    notEmpty_.notify_all();
    notFull_.notify_all();
}

bool BulkMessageQueue::closed() const {
    std::lock_guard<std::mutex> guard(mutex_);
    return closed_;
}

std::size_t BulkMessageQueue::size() const {
    std::lock_guard<std::mutex> guard(mutex_);
    return queue_.size();
}

}  // namespace hubflow
