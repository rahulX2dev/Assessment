#include "CsvReader.hpp"

#include <algorithm>
#include <cctype>
#include <sstream>

namespace hubflow {

namespace {

std::string toLower(std::string value) {
    std::transform(value.begin(), value.end(), value.begin(),
                   [](unsigned char c) { return static_cast<char>(std::tolower(c)); });
    return value;
}

}  // namespace

CsvRow::CsvRow(const std::unordered_map<std::string, std::size_t>* index,
               std::vector<std::string> cells,
               std::size_t lineNumber)
    : index_(index), cells_(std::move(cells)), line_(lineNumber) {}

bool CsvRow::has(const std::string& column) const {
    const auto it = index_->find(column);
    return it != index_->end() && it->second < cells_.size();
}

const std::string& CsvRow::at(const std::string& column) const {
    const auto it = index_->find(column);
    if (it == index_->end() || it->second >= cells_.size()) {
        throw CsvError("Column '" + column + "' is missing from this row", line_);
    }
    return cells_[it->second];
}

std::string CsvRow::get(const std::string& column, const std::string& fallback) const {
    if (!has(column)) {
        return fallback;
    }
    const std::string& value = at(column);
    return value.empty() ? fallback : value;
}

int CsvRow::getInt(const std::string& column, int fallback) const {
    const std::string value = get(column);
    if (value.empty()) {
        return fallback;
    }

    try {
        return std::stoi(value);
    } catch (const std::exception&) {
        return fallback;
    }
}

bool CsvRow::getBool(const std::string& column, bool fallback) const {
    const std::string value = toLower(get(column));
    if (value.empty()) {
        return fallback;
    }
    return value == "1" || value == "true" || value == "yes" || value == "y";
}

CsvReader::CsvReader(std::istream& input, char delimiter)
    : input_(input), delimiter_(delimiter) {

    std::string line;
    if (!readLogicalLine(line)) {
        throw CsvError("The CSV file is empty", 0);
    }

    if (!line.empty() && static_cast<unsigned char>(line[0]) == 0xEF && line.size() >= 3) {
        line.erase(0, 3);
    }

    headers_ = splitLine(line, delimiter_);
    for (std::size_t i = 0; i < headers_.size(); ++i) {
        headers_[i] = toLower(trim(headers_[i]));
        index_[headers_[i]] = i;
    }

    if (headers_.empty()) {
        throw CsvError("The CSV header row has no columns", 1);
    }
}

void CsvReader::requireColumns(const std::vector<std::string>& required) const {
    std::vector<std::string> missing;
    for (const auto& column : required) {
        if (index_.find(column) == index_.end()) {
            missing.push_back(column);
        }
    }

    if (!missing.empty()) {
        std::ostringstream out;
        out << "CSV is missing required column(s):";
        for (const auto& column : missing) {
            out << ' ' << column;
        }
        throw CsvError(out.str(), 1);
    }
}

bool CsvReader::readLogicalLine(std::string& out) {
    if (!std::getline(input_, out)) {
        return false;
    }
    ++physicalLine_;

    if (!out.empty() && out.back() == '\r') {
        out.pop_back();
    }

    std::size_t quotes = static_cast<std::size_t>(std::count(out.begin(), out.end(), '"'));
    while (quotes % 2 != 0) {
        std::string continuation;
        if (!std::getline(input_, continuation)) {
            break;
        }
        ++physicalLine_;

        if (!continuation.empty() && continuation.back() == '\r') {
            continuation.pop_back();
        }

        out += '\n';
        out += continuation;
        quotes += static_cast<std::size_t>(std::count(continuation.begin(), continuation.end(), '"'));
    }

    return true;
}

bool CsvReader::next(CsvRow& row) {
    std::string line;

    while (readLogicalLine(line)) {
        if (trim(line).empty()) {
            continue;
        }

        std::vector<std::string> cells = splitLine(line, delimiter_);
        for (auto& cell : cells) {
            cell = trim(cell);
        }

        cells.resize(headers_.size());
        ++rowsRead_;
        row = CsvRow(&index_, std::move(cells), physicalLine_);
        return true;
    }

    return false;
}

std::vector<std::string> CsvReader::splitLine(const std::string& line, char delimiter) {
    std::vector<std::string> cells;
    std::string current;
    bool inQuotes = false;

    for (std::size_t i = 0; i < line.size(); ++i) {
        const char c = line[i];

        if (inQuotes) {
            if (c == '"') {
                if (i + 1 < line.size() && line[i + 1] == '"') {
                    current += '"';
                    ++i;
                } else {
                    inQuotes = false;
                }
            } else {
                current += c;
            }
            continue;
        }

        if (c == '"') {
            inQuotes = true;
        } else if (c == delimiter) {
            cells.push_back(current);
            current.clear();
        } else {
            current += c;
        }
    }

    cells.push_back(current);
    return cells;
}

std::string CsvReader::trim(const std::string& value) {
    const auto begin = value.find_first_not_of(" \t\r\n");
    if (begin == std::string::npos) {
        return "";
    }
    const auto end = value.find_last_not_of(" \t\r\n");
    return value.substr(begin, end - begin + 1);
}

}  // namespace hubflow
