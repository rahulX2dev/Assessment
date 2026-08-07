#include "csv.h"

#include <stdlib.h>
#include <string.h>

static int hf_csv_row_grow(hf_csv_row *row) {
    size_t capacity;
    char **values;

    capacity = (row->capacity == 0) ? 8 : row->capacity * 2;
    if (capacity > HF_MAX_COLUMNS * 4) {
        return HF_ERR_LIMIT;
    }

    values = (char **)hf_realloc(row->values, capacity * sizeof(char *));
    if (values == NULL) {
        return HF_ERR_ALLOC;
    }

    row->values = values;
    row->capacity = capacity;
    return HF_OK;
}

int hf_csv_row_init(hf_csv_row *row, size_t capacity) {
    if (row == NULL) {
        return HF_ERR_ARGUMENT;
    }

    row->values = NULL;
    row->count = 0;
    row->capacity = 0;

    if (capacity > 0) {
        row->values = (char **)hf_calloc(capacity, sizeof(char *));
        if (row->values == NULL) {
            return HF_ERR_ALLOC;
        }
        row->capacity = capacity;
    }

    return HF_OK;
}

void hf_csv_row_free(hf_csv_row *row) {
    size_t i;

    if (row == NULL) {
        return;
    }

    for (i = 0; i < row->count; i++) {
        hf_free(row->values[i]);
    }

    hf_free(row->values);
    row->values = NULL;
    row->count = 0;
    row->capacity = 0;
}

int hf_csv_row_push(hf_csv_row *row, const char *value, size_t length) {
    char *copy;
    int status;

    if (row == NULL) {
        return HF_ERR_ARGUMENT;
    }

    if (row->count == row->capacity) {
        status = hf_csv_row_grow(row);
        if (status != HF_OK) {
            return status;
        }
    }

    copy = hf_strndup(value == NULL ? "" : value, length);
    if (copy == NULL) {
        return HF_ERR_ALLOC;
    }

    row->values[row->count] = copy;
    row->count++;
    return HF_OK;
}

const char *hf_csv_row_at(const hf_csv_row *row, size_t index) {
    if (row == NULL || index >= row->count) {
        return NULL;
    }
    return row->values[index];
}

int hf_csv_parse_line(const char *line, char delimiter, hf_csv_row *row) {
    size_t start;
    size_t i;
    int in_quotes;
    int status;
    char *field;
    size_t field_len;
    size_t j;

    if (line == NULL || row == NULL) {
        return HF_ERR_ARGUMENT;
    }

    field = (char *)hf_malloc(strlen(line) + 1);
    if (field == NULL) {
        return HF_ERR_ALLOC;
    }

    start = 0;
    in_quotes = 0;
    field_len = 0;
    j = 0;

    for (i = 0; line[i] != '\0'; i++) {
        char c = line[i];

        if (in_quotes) {
            if (c == '"') {
                if (line[i + 1] == '"') {
                    field[j++] = '"';
                    i++;
                } else {
                    in_quotes = 0;
                }
            } else {
                field[j++] = c;
            }
            continue;
        }

        if (c == '"') {
            in_quotes = 1;
        } else if (c == delimiter) {
            field[j] = '\0';
            field_len = j;
            status = hf_csv_row_push(row, field, field_len);
            if (status != HF_OK) {
                hf_free(field);
                return status;
            }
            j = 0;
        } else {
            field[j++] = c;
        }
    }

    field[j] = '\0';
    status = hf_csv_row_push(row, field, j);
    hf_free(field);

    (void)start;
    return status;
}

int hf_csv_open_stream(hf_csv_reader *reader, FILE *stream, char delimiter) {
    int status;

    if (reader == NULL || stream == NULL) {
        return HF_ERR_ARGUMENT;
    }

    reader->stream = stream;
    reader->delimiter = (delimiter == '\0') ? ',' : delimiter;
    reader->line_number = 0;
    reader->rows_read = 0;
    reader->owns_stream = 0;
    reader->buffer_size = HF_MAX_LINE_LEN;
    reader->buffer = (char *)hf_malloc(reader->buffer_size);

    if (reader->buffer == NULL) {
        return HF_ERR_ALLOC;
    }

    status = hf_csv_row_init(&reader->header, 16);
    if (status != HF_OK) {
        hf_free(reader->buffer);
        reader->buffer = NULL;
        return status;
    }

    if (fgets(reader->buffer, (int)reader->buffer_size, reader->stream) == NULL) {
        hf_csv_row_free(&reader->header);
        hf_free(reader->buffer);
        reader->buffer = NULL;
        return HF_ERR_FORMAT;
    }

    reader->line_number++;
    reader->buffer[strcspn(reader->buffer, "\r\n")] = '\0';

    status = hf_csv_parse_line(reader->buffer, reader->delimiter, &reader->header);
    if (status != HF_OK) {
        hf_csv_row_free(&reader->header);
        hf_free(reader->buffer);
        reader->buffer = NULL;
        return status;
    }

    {
        size_t i;
        for (i = 0; i < reader->header.count; i++) {
            char *trimmed = hf_trim(reader->header.values[i]);
            if (trimmed != reader->header.values[i]) {
                memmove(reader->header.values[i], trimmed, strlen(trimmed) + 1);
            }
            hf_str_lower(reader->header.values[i]);
        }
    }

    return HF_OK;
}

int hf_csv_open(hf_csv_reader *reader, const char *path, char delimiter) {
    FILE *stream;
    int status;

    if (reader == NULL || path == NULL) {
        return HF_ERR_ARGUMENT;
    }

    stream = fopen(path, "rb");
    if (stream == NULL) {
        return HF_ERR_NOT_FOUND;
    }

    status = hf_csv_open_stream(reader, stream, delimiter);
    if (status != HF_OK) {
        fclose(stream);
        return status;
    }

    reader->owns_stream = 1;
    return HF_OK;
}

void hf_csv_close(hf_csv_reader *reader) {
    if (reader == NULL) {
        return;
    }

    hf_csv_row_free(&reader->header);

    if (reader->buffer != NULL) {
        hf_free(reader->buffer);
        reader->buffer = NULL;
    }

    if (reader->owns_stream && reader->stream != NULL) {
        fclose(reader->stream);
    }

    reader->stream = NULL;
}

int hf_csv_next(hf_csv_reader *reader, hf_csv_row *row) {
    char *trimmed;

    if (reader == NULL || row == NULL || reader->stream == NULL) {
        return HF_ERR_ARGUMENT;
    }

    while (fgets(reader->buffer, (int)reader->buffer_size, reader->stream) != NULL) {
        reader->line_number++;
        reader->buffer[strcspn(reader->buffer, "\r\n")] = '\0';

        trimmed = hf_trim(reader->buffer);
        if (*trimmed == '\0') {
            continue;
        }

        hf_csv_row_free(row);

        if (hf_csv_row_init(row, reader->header.count) != HF_OK) {
            return HF_ERR_ALLOC;
        }

        row->count = 0;

        if (hf_csv_parse_line(trimmed, reader->delimiter, row) != HF_OK) {
            return HF_ERR_FORMAT;
        }

        reader->rows_read++;
        return HF_OK;
    }

    return HF_ERR_NOT_FOUND;
}

int hf_csv_column_index(const hf_csv_reader *reader, const char *name) {
    size_t i;

    if (reader == NULL || name == NULL) {
        return -1;
    }

    for (i = 0; i < reader->header.count; i++) {
        if (hf_str_ieq(reader->header.values[i], name)) {
            return (int)i;
        }
    }

    return -1;
}

const char *hf_csv_field(const hf_csv_reader *reader, const hf_csv_row *row, const char *name) {
    int index = hf_csv_column_index(reader, name);

    if (index < 0) {
        return NULL;
    }

    return hf_csv_row_at(row, (size_t)index);
}

int hf_csv_require_columns(const hf_csv_reader *reader, const char *const *names, size_t count) {
    size_t i;

    if (reader == NULL || names == NULL) {
        return HF_ERR_ARGUMENT;
    }

    for (i = 0; i < count; i++) {
        if (hf_csv_column_index(reader, names[i]) < 0) {
            fprintf(stderr, "csv: required column '%s' is missing\n", names[i]);
            return HF_ERR_FORMAT;
        }
    }

    return HF_OK;
}

int hf_csv_write_escaped(FILE *stream, const char *value) {
    int needs_quotes;
    const char *cursor;

    if (stream == NULL) {
        return HF_ERR_ARGUMENT;
    }

    if (value == NULL) {
        return HF_OK;
    }

    needs_quotes = (strpbrk(value, ",\"\n\r") != NULL);

    if (!needs_quotes) {
        fputs(value, stream);
        return HF_OK;
    }

    fputc('"', stream);
    for (cursor = value; *cursor != '\0'; cursor++) {
        if (*cursor == '"') {
            fputc('"', stream);
        }
        fputc(*cursor, stream);
    }
    fputc('"', stream);

    return HF_OK;
}
