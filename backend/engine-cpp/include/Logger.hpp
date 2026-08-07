#pragma once

#include <chrono>
#include <iomanip>
#include <iostream>
#include <mutex>
#include <sstream>
#include <string>

namespace hubflow {

enum class LogLevel { Debug, Info, Warn, Error };

class Logger {
public:
    static Logger& instance() {
        static Logger logger;
        return logger;
    }

    void setLevel(LogLevel level) { level_ = level; }

    void log(LogLevel level, const std::string& message) {
        if (level < level_) {
            return;
        }

        std::lock_guard<std::mutex> guard(mutex_);
        std::ostream& sink = (level == LogLevel::Error) ? std::cerr : std::cout;
        sink << '[' << timestamp() << "] [" << label(level) << "] " << message << '\n';
    }

    void debug(const std::string& message) { log(LogLevel::Debug, message); }
    void info(const std::string& message) { log(LogLevel::Info, message); }
    void warn(const std::string& message) { log(LogLevel::Warn, message); }
    void error(const std::string& message) { log(LogLevel::Error, message); }

    Logger(const Logger&) = delete;
    Logger& operator=(const Logger&) = delete;

private:
    Logger() = default;

    static const char* label(LogLevel level) {
        switch (level) {
            case LogLevel::Debug: return "debug";
            case LogLevel::Info:  return "info ";
            case LogLevel::Warn:  return "warn ";
            case LogLevel::Error: return "error";
        }
        return "info ";
    }

    static std::string timestamp() {
        const auto now = std::chrono::system_clock::now();
        const auto time = std::chrono::system_clock::to_time_t(now);
        const auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(
                            now.time_since_epoch()) % 1000;

        std::tm parts{};
#ifdef _WIN32
        gmtime_s(&parts, &time);
#else
        gmtime_r(&time, &parts);
#endif

        std::ostringstream out;
        out << std::put_time(&parts, "%Y-%m-%dT%H:%M:%S")
            << '.' << std::setfill('0') << std::setw(3) << ms.count() << 'Z';
        return out.str();
    }

    LogLevel level_ = LogLevel::Info;
    std::mutex mutex_;
};

}  // namespace hubflow
