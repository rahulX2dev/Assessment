#ifndef HUBFLOW_RECORDS_H
#define HUBFLOW_RECORDS_H

#include "common.h"
#include "csv.h"

typedef enum {
    HF_STATE_QUEUED = 0,
    HF_STATE_SENT,
    HF_STATE_DELIVERED,
    HF_STATE_READ,
    HF_STATE_FAILED,
    HF_STATE_SKIPPED,
    HF_STATE_COUNT
} hf_delivery_state;

typedef struct {
    char message_id[64];
    char contact_id[32];
    char phone[24];
    char priority[16];
    char failure_reason[96];
    hf_delivery_state state;
    int attempts;
    long latency_micros;
} hf_campaign_record;

typedef struct {
    hf_campaign_record *items;
    size_t count;
    size_t capacity;
} hf_record_store;

const char *hf_state_name(hf_delivery_state state);
hf_delivery_state hf_state_from_name(const char *name);

int hf_store_init(hf_record_store *store, size_t capacity);
void hf_store_free(hf_record_store *store);
int hf_store_add(hf_record_store *store, const hf_campaign_record *record);
int hf_store_reserve(hf_record_store *store, size_t capacity);

const hf_campaign_record *hf_store_find(const hf_record_store *store, const char *message_id);
size_t hf_store_count_state(const hf_record_store *store, hf_delivery_state state);
size_t hf_store_remove_state(hf_record_store *store, hf_delivery_state state);

void hf_store_sort_by_latency(hf_record_store *store);
long hf_store_latency_percentile(const hf_record_store *store, double fraction);

int hf_store_load_csv(hf_record_store *store, const char *path, size_t *rejected);
int hf_store_write_csv(const hf_record_store *store, const char *path);

#endif
