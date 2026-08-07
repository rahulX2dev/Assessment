#pragma once

#include <cstddef>
#include <istream>
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <vector>

namespace hubflow {

class CsvError : public std::runtime_error {
public:
    CsvError(std::string message, std::size_t line)
        : std::runtime_error(std::move(message)), line_(line) {}

    std::size_t line() const { return line_; }

private:
    std::size_t line_;
};

class CsvRow {
public:
    CsvRow(const std::unordered_map<std::string, std::size_t>* index,
           std::vector<std::string> cells,
           std::size_t lineNumber);

    const std::string& at(const std::string& column) const;
    std::string get(const std::string& column, const std::string& fallback = "") const;
    int getInt(const std::string& column, int fallback = 0) const;
    bool getBool(const std::string& column, bool fallback = false) const;
    bool has(const std::string& column) const;

    std::size_t lineNumber() const { return line_; }
    std::size_t size() const { return cells_.size(); }

private:
    const std::unordered_map<std::string, std::size_t>* index_;
    std::vector<std::string> cells_;
    std::size_t line_;
};

class CsvReader {
public:
    explicit CsvReader(std::istream& input, char delimiter = ',');

    const std::vector<std::string>& headers() const { return headers_; }
    bool next(CsvRow& row);
    std::size_t rowsRead() const { return rowsRead_; }

    void requireColumns(const std::vector<std::string>& required) const;

    static std::vector<std::string> splitLine(const std::string& line, char delimiter);
    static std::string trim(const std::string& value);

private:
    bool readLogicalLine(std::string& out);

    std::istream& input_;
    char delimiter_;
    std::vector<std::string> headers_;
    std::unordered_map<std::string, std::size_t> index_;
    std::size_t physicalLine_ = 0;
    std::size_t rowsRead_ = 0;
};

}  // namespace hubflow
