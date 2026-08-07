CC      ?= gcc
CFLAGS  ?= -std=c11 -O2 -Wall -Wextra -Wpedantic -Wshadow -Wstrict-prototypes -Iinclude
LDFLAGS ?=

SRC_DIR := src
OBJ_DIR := build
BIN_DIR := bin
TARGET  := $(BIN_DIR)/hubflow_fileops

SOURCES := $(wildcard $(SRC_DIR)/*.c)
OBJECTS := $(patsubst $(SRC_DIR)/%.c,$(OBJ_DIR)/%.o,$(SOURCES))

.PHONY: all clean run debug memcheck

all: $(TARGET)

$(TARGET): $(OBJECTS) | $(BIN_DIR)
	$(CC) $(OBJECTS) -o $@ $(LDFLAGS)

$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c | $(OBJ_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

$(OBJ_DIR) $(BIN_DIR):
	mkdir -p $@

debug: CFLAGS := -std=c11 -O0 -g -Wall -Wextra -Wpedantic -fsanitize=address,undefined -Iinclude
debug: LDFLAGS := -fsanitize=address,undefined
debug: clean $(TARGET)

run: $(TARGET)
	$(TARGET) report --input ../../samples/delivery_report.csv --campaign cmp_demo

memcheck: debug
	valgrind --leak-check=full --error-exitcode=1 \
		$(TARGET) report --input ../../samples/delivery_report.csv --campaign cmp_demo

clean:
	rm -rf $(OBJ_DIR) $(BIN_DIR)
