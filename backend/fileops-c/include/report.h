#ifndef HUBFLOW_REPORT_H
#define HUBFLOW_REPORT_H

#include "common.h"
#include "records.h"

typedef struct {
    size_t total;
    size_t by_state[HF_STATE_COUNT];
    size_t retried;
    double delivery_rate;
    double read_rate;
    double failure_rate;
    double average_latency;
    long p50_latency;
    long p95_latency;
    long max_latency;
} hf_report_summary;

void hf_report_build(const hf_record_store *store, hf_report_summary *summary);
int hf_report_write_text(const hf_report_summary *summary, const char *campaign, const char *path);
int hf_report_write_csv(const hf_report_summary *summary, const char *campaign, const char *path);
void hf_report_print(const hf_report_summary *summary, const char *campaign);

#endif
