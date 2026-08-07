#include "records.h"

#include <stdlib.h>
#include <string.h>

static const char *g_state_names[HF_STATE_COUNT] = {
    "QUEUED", "SENT", "DELIVERED", "READ", "FAILED", "SKIPPED"
};

static void copy_field(char *destination, size_t size, const char *source) {
    if (destination == NULL || size == 0) {
        return;
    }

    if (source == NULL) {
        destination[0] = '\0';
        return;
    }

    strncpy(destination, source, size - 1);
    destination[size - 1] = '\0';
}

const char *hf_state_name(hf_delivery_state state) {
    if (state < 0 || state >= HF_STATE_COUNT) {
        return "QUEUED";
    }
    return g_state_names[state];
}

hf_delivery_state hf_state_from_name(const char *name) {
    int i;

    if (name == NULL) {
        return HF_STATE_QUEUED;
    }

    for (i = 0; i < HF_STATE_COUNT; i++) {
        if (hf_str_ieq(name, g_state_names[i])) {
            return (hf_delivery_state)i;
        }
    }

    return HF_STATE_QUEUED;
}

int hf_store_init(hf_record_store *store, size_t capacity) {
    if (store == NULL) {
        return HF_ERR_ARGUMENT;
    }

    store->items = NULL;
    store->count = 0;
    store->capacity = 0;

    if (capacity == 0) {
        return HF_OK;
    }

    store->items = (hf_campaign_record *)hf_calloc(capacity, sizeof(hf_campaign_record));
    if (store->items == NULL) {
        return HF_ERR_ALLOC;
    }

    store->capacity = capacity;
    return HF_OK;
}

void hf_store_free(hf_record_store *store) {
    if (store == NULL) {
        return;
    }

    hf_free(store->items);
    store->items = NULL;
    store->count = 0;
    store->capacity = 0;
}

int hf_store_reserve(hf_record_store *store, size_t capacity) {
    hf_campaign_record *items;

    if (store == NULL) {
        return HF_ERR_ARGUMENT;
    }

    if (capacity <= store->capacity) {
        return HF_OK;
    }

    items = (hf_campaign_record *)hf_realloc(store->items, capacity * sizeof(hf_campaign_record));
    if (items == NULL) {
        return HF_ERR_ALLOC;
    }

    memset(items + store->capacity, 0,
           (capacity - store->capacity) * sizeof(hf_campaign_record));

    store->items = items;
    store->capacity = capacity;
    return HF_OK;
}

int hf_store_add(hf_record_store *store, const hf_campaign_record *record) {
    int status;

    if (store == NULL || record == NULL) {
        return HF_ERR_ARGUMENT;
    }

    if (store->count == store->capacity) {
        size_t next = (store->capacity == 0) ? 32 : store->capacity * 2;
        status = hf_store_reserve(store, next);
        if (status != HF_OK) {
            return status;
        }
    }

    store->items[store->count] = *record;
    store->count++;
    return HF_OK;
}

const hf_campaign_record *hf_store_find(const hf_record_store *store, const char *message_id) {
    size_t i;

    if (store == NULL || message_id == NULL) {
        return NULL;
    }

    for (i = 0; i < store->count; i++) {
        if (strcmp(store->items[i].message_id, message_id) == 0) {
            return &store->items[i];
        }
    }

    return NULL;
}

size_t hf_store_count_state(const hf_record_store *store, hf_delivery_state state) {
    size_t i;
    size_t total = 0;

    if (store == NULL) {
        return 0;
    }

    for (i = 0; i < store->count; i++) {
        if (store->items[i].state == state) {
            total++;
        }
    }

    return total;
}

size_t hf_store_remove_state(hf_record_store *store, hf_delivery_state state) {
    size_t read_index;
    size_t write_index = 0;
    size_t removed = 0;

    if (store == NULL) {
        return 0;
    }

    for (read_index = 0; read_index < store->count; read_index++) {
        if (store->items[read_index].state == state) {
            removed++;
            continue;
        }

        if (write_index != read_index) {
            store->items[write_index] = store->items[read_index];
        }
        write_index++;
    }

    store->count = write_index;
    return removed;
}

static int compare_latency(const void *left, const void *right) {
    const hf_campaign_record *a = (const hf_campaign_record *)left;
    const hf_campaign_record *b = (const hf_campaign_record *)right;

    if (a->latency_micros < b->latency_micros) return -1;
    if (a->latency_micros > b->latency_micros) return 1;
    return 0;
}

void hf_store_sort_by_latency(hf_record_store *store) {
    if (store == NULL || store->count < 2) {
        return;
    }

    qsort(store->items, store->count, sizeof(hf_campaign_record), compare_latency);
}

long hf_store_latency_percentile(const hf_record_store *store, double fraction) {
    hf_record_store copy;
    size_t index;
    long result;

    if (store == NULL || store->count == 0) {
        return 0;
    }

    if (hf_store_init(&copy, store->count) != HF_OK) {
        return 0;
    }

    memcpy(copy.items, store->items, store->count * sizeof(hf_campaign_record));
    copy.count = store->count;

    hf_store_sort_by_latency(&copy);

    index = (size_t)(fraction * (double)(copy.count - 1));
    if (index >= copy.count) {
        index = copy.count - 1;
    }

    result = copy.items[index].latency_micros;
    hf_store_free(&copy);

    return result;
}

int hf_store_load_csv(hf_record_store *store, const char *path, size_t *rejected) {
    hf_csv_reader reader;
    hf_csv_row row;
    hf_campaign_record record;
    int status;
    size_t skipped = 0;

    static const char *const required[] = {"message_id", "contact_id", "state"};

    if (store == NULL || path == NULL) {
        return HF_ERR_ARGUMENT;
    }

    status = hf_csv_open(&reader, path, ',');
    if (status != HF_OK) {
        return status;
    }

    status = hf_csv_require_columns(&reader, required, sizeof(required) / sizeof(required[0]));
    if (status != HF_OK) {
        hf_csv_close(&reader);
        return status;
    }

    if (hf_csv_row_init(&row, reader.header.count) != HF_OK) {
        hf_csv_close(&reader);
        return HF_ERR_ALLOC;
    }

    while (hf_csv_next(&reader, &row) == HF_OK) {
        const char *message_id = hf_csv_field(&reader, &row, "message_id");
        const char *contact_id = hf_csv_field(&reader, &row, "contact_id");
        const char *state = hf_csv_field(&reader, &row, "state");

        if (message_id == NULL || contact_id == NULL || state == NULL ||
            message_id[0] == '\0' || contact_id[0] == '\0') {
            skipped++;
            continue;
        }

        memset(&record, 0, sizeof(record));
        copy_field(record.message_id, sizeof(record.message_id), message_id);
        copy_field(record.contact_id, sizeof(record.contact_id), contact_id);
        copy_field(record.phone, sizeof(record.phone), hf_csv_field(&reader, &row, "phone"));
        copy_field(record.priority, sizeof(record.priority), hf_csv_field(&reader, &row, "priority"));
        copy_field(record.failure_reason, sizeof(record.failure_reason),
                   hf_csv_field(&reader, &row, "failure_reason"));

        record.state = hf_state_from_name(state);

        {
            const char *attempts = hf_csv_field(&reader, &row, "attempts");
            const char *latency = hf_csv_field(&reader, &row, "latency_micros");
            record.attempts = (attempts != NULL && attempts[0] != '\0') ? atoi(attempts) : 0;
            record.latency_micros = (latency != NULL && latency[0] != '\0') ? atol(latency) : 0L;
        }

        if (hf_store_add(store, &record) != HF_OK) {
            hf_csv_row_free(&row);
            hf_csv_close(&reader);
            return HF_ERR_ALLOC;
        }
    }

    hf_csv_row_free(&row);
    hf_csv_close(&reader);

    if (rejected != NULL) {
        *rejected = skipped;
    }

    return HF_OK;
}

int hf_store_write_csv(const hf_record_store *store, const char *path) {
    FILE *out;
    size_t i;

    if (store == NULL || path == NULL) {
        return HF_ERR_ARGUMENT;
    }

    out = fopen(path, "wb");
    if (out == NULL) {
        return HF_ERR_IO;
    }

    fputs("message_id,contact_id,phone,priority,state,attempts,latency_micros,failure_reason\n", out);

    for (i = 0; i < store->count; i++) {
        const hf_campaign_record *record = &store->items[i];

        hf_csv_write_escaped(out, record->message_id);
        fputc(',', out);
        hf_csv_write_escaped(out, record->contact_id);
        fputc(',', out);
        hf_csv_write_escaped(out, record->phone);
        fputc(',', out);
        hf_csv_write_escaped(out, record->priority);
        fputc(',', out);
        fputs(hf_state_name(record->state), out);
        fprintf(out, ",%d,%ld,", record->attempts, record->latency_micros);
        hf_csv_write_escaped(out, record->failure_reason);
        fputc('\n', out);
    }

    if (fclose(out) != 0) {
        return HF_ERR_IO;
    }

    return HF_OK;
}
