#ifndef HUBFLOW_CSV_H
#define HUBFLOW_CSV_H

#include <stdio.h>

#include "common.h"

typedef struct {
    char **values;
    size_t count;
    size_t capacity;
} hf_csv_row;

typedef struct {
    FILE *stream;
    char delimiter;
    hf_csv_row header;
    size_t line_number;
    size_t rows_read;
    char *buffer;
    size_t buffer_size;
    int owns_stream;
} hf_csv_reader;

int hf_csv_row_init(hf_csv_row *row, size_t capacity);
void hf_csv_row_free(hf_csv_row *row);
int hf_csv_row_push(hf_csv_row *row, const char *value, size_t length);
const char *hf_csv_row_at(const hf_csv_row *row, size_t index);

int hf_csv_open(hf_csv_reader *reader, const char *path, char delimiter);
int hf_csv_open_stream(hf_csv_reader *reader, FILE *stream, char delimiter);
void hf_csv_close(hf_csv_reader *reader);

int hf_csv_next(hf_csv_reader *reader, hf_csv_row *row);
int hf_csv_column_index(const hf_csv_reader *reader, const char *name);
const char *hf_csv_field(const hf_csv_reader *reader, const hf_csv_row *row, const char *name);
int hf_csv_require_columns(const hf_csv_reader *reader, const char *const *names, size_t count);

int hf_csv_parse_line(const char *line, char delimiter, hf_csv_row *row);
int hf_csv_write_escaped(FILE *stream, const char *value);

#endif
