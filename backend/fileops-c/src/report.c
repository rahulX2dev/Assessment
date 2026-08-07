#include "report.h"

#include <stdio.h>
#include <string.h>

#include "fileutil.h"

void hf_report_build(const hf_record_store *store, hf_report_summary *summary) {
    size_t i;
    size_t dispatched;
    long long latency_total = 0;

    if (store == NULL || summary == NULL) {
        return;
    }

    memset(summary, 0, sizeof(*summary));
    summary->total = store->count;

    for (i = 0; i < store->count; i++) {
        const hf_campaign_record *record = &store->items[i];

        if (record->state >= 0 && record->state < HF_STATE_COUNT) {
            summary->by_state[record->state]++;
        }

        if (record->attempts > 1) {
            summary->retried++;
        }

        latency_total += record->latency_micros;

        if (record->latency_micros > summary->max_latency) {
            summary->max_latency = record->latency_micros;
        }
    }

    dispatched = store->count - summary->by_state[HF_STATE_SKIPPED];
    if (dispatched == 0) {
        dispatched = 1;
    }

    summary->delivery_rate =
        (double)(summary->by_state[HF_STATE_DELIVERED] + summary->by_state[HF_STATE_READ]) * 100.0 /
        (double)dispatched;

    summary->read_rate =
        (double)summary->by_state[HF_STATE_READ] * 100.0 / (double)dispatched;

    summary->failure_rate =
        (double)summary->by_state[HF_STATE_FAILED] * 100.0 / (double)dispatched;

    if (store->count > 0) {
        summary->average_latency = (double)latency_total / (double)store->count;
    }

    summary->p50_latency = hf_store_latency_percentile(store, 0.50);
    summary->p95_latency = hf_store_latency_percentile(store, 0.95);
}

void hf_report_print(const hf_report_summary *summary, const char *campaign) {
    int i;

    if (summary == NULL) {
        return;
    }

    printf("\nDelivery report for %s\n", campaign == NULL ? "campaign" : campaign);
    printf("--------------------------------------------\n");
    printf("Records         : %lu\n", (unsigned long)summary->total);

    for (i = 0; i < HF_STATE_COUNT; i++) {
        printf("  %-10s    %lu\n", hf_state_name((hf_delivery_state)i),
               (unsigned long)summary->by_state[i]);
    }

    printf("Retried         : %lu\n", (unsigned long)summary->retried);
    printf("Delivery rate   : %.2f %%\n", summary->delivery_rate);
    printf("Read rate       : %.2f %%\n", summary->read_rate);
    printf("Failure rate    : %.2f %%\n", summary->failure_rate);
    printf("Latency avg     : %.2f us\n", summary->average_latency);
    printf("Latency p50     : %ld us\n", summary->p50_latency);
    printf("Latency p95     : %ld us\n", summary->p95_latency);
    printf("Latency max     : %ld us\n", summary->max_latency);
}

int hf_report_write_text(const hf_report_summary *summary, const char *campaign, const char *path) {
    char buffer[4096];
    int written;
    int offset = 0;
    int i;

    if (summary == NULL || path == NULL) {
        return HF_ERR_ARGUMENT;
    }

    written = snprintf(buffer + offset, sizeof(buffer) - (size_t)offset,
                       "HUBFLOW DELIVERY REPORT\n"
                       "=======================\n\n"
                       "Campaign        : %s\n"
                       "Records         : %lu\n\n"
                       "STATE BREAKDOWN\n---------------\n",
                       campaign == NULL ? "unknown" : campaign,
                       (unsigned long)summary->total);

    if (written < 0) {
        return HF_ERR_IO;
    }
    offset += written;

    for (i = 0; i < HF_STATE_COUNT; i++) {
        written = snprintf(buffer + offset, sizeof(buffer) - (size_t)offset,
                           "  %-10s  %lu\n",
                           hf_state_name((hf_delivery_state)i),
                           (unsigned long)summary->by_state[i]);
        if (written < 0 || (size_t)(offset + written) >= sizeof(buffer)) {
            return HF_ERR_LIMIT;
        }
        offset += written;
    }

    written = snprintf(buffer + offset, sizeof(buffer) - (size_t)offset,
                       "\nRATES\n-----\n"
                       "Delivery rate   : %.2f %%\n"
                       "Read rate       : %.2f %%\n"
                       "Failure rate    : %.2f %%\n"
                       "Retried         : %lu\n\n"
                       "LATENCY (microseconds)\n----------------------\n"
                       "Average         : %.2f\n"
                       "P50             : %ld\n"
                       "P95             : %ld\n"
                       "Max             : %ld\n",
                       summary->delivery_rate,
                       summary->read_rate,
                       summary->failure_rate,
                       (unsigned long)summary->retried,
                       summary->average_latency,
                       summary->p50_latency,
                       summary->p95_latency,
                       summary->max_latency);

    if (written < 0 || (size_t)(offset + written) >= sizeof(buffer)) {
        return HF_ERR_LIMIT;
    }
    offset += written;

    return hf_write_atomic(path, buffer, (size_t)offset);
}

int hf_report_write_csv(const hf_report_summary *summary, const char *campaign, const char *path) {
    FILE *out;
    int i;

    if (summary == NULL || path == NULL) {
        return HF_ERR_ARGUMENT;
    }

    out = fopen(path, "wb");
    if (out == NULL) {
        return HF_ERR_IO;
    }

    fputs("metric,value\n", out);
    fprintf(out, "campaign,%s\n", campaign == NULL ? "unknown" : campaign);
    fprintf(out, "records,%lu\n", (unsigned long)summary->total);

    for (i = 0; i < HF_STATE_COUNT; i++) {
        fprintf(out, "state_%s,%lu\n",
                hf_state_name((hf_delivery_state)i),
                (unsigned long)summary->by_state[i]);
    }

    fprintf(out, "retried,%lu\n", (unsigned long)summary->retried);
    fprintf(out, "delivery_rate,%.2f\n", summary->delivery_rate);
    fprintf(out, "read_rate,%.2f\n", summary->read_rate);
    fprintf(out, "failure_rate,%.2f\n", summary->failure_rate);
    fprintf(out, "latency_avg,%.2f\n", summary->average_latency);
    fprintf(out, "latency_p50,%ld\n", summary->p50_latency);
    fprintf(out, "latency_p95,%ld\n", summary->p95_latency);
    fprintf(out, "latency_max,%ld\n", summary->max_latency);

    if (fclose(out) != 0) {
        return HF_ERR_IO;
    }

    return HF_OK;
}
