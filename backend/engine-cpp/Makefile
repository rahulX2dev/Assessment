CXX      ?= g++
CXXFLAGS ?= -std=c++17 -O2 -Wall -Wextra -Wpedantic -Iinclude
LDFLAGS  ?= -pthread

SRC_DIR  := src
OBJ_DIR  := build
BIN_DIR  := bin
TARGET   := $(BIN_DIR)/hubflow_engine

SOURCES  := $(wildcard $(SRC_DIR)/*.cpp)
OBJECTS  := $(patsubst $(SRC_DIR)/%.cpp,$(OBJ_DIR)/%.o,$(SOURCES))

.PHONY: all clean run debug

all: $(TARGET)

$(TARGET): $(OBJECTS) | $(BIN_DIR)
	$(CXX) $(OBJECTS) -o $@ $(LDFLAGS)

$(OBJ_DIR)/%.o: $(SRC_DIR)/%.cpp | $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

$(OBJ_DIR) $(BIN_DIR):
	mkdir -p $@

debug: CXXFLAGS := -std=c++17 -O0 -g -Wall -Wextra -fsanitize=address,undefined -Iinclude
debug: LDFLAGS := -pthread -fsanitize=address,undefined
debug: clean $(TARGET)

run: $(TARGET)
	mkdir -p reports
	$(TARGET) --input ../../samples/contacts.csv --out reports --campaign cmp_demo --format txt

clean:
	rm -rf $(OBJ_DIR) $(BIN_DIR)
