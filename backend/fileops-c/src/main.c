#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "common.h"
#include "csv.h"
#include "fileutil.h"
#include "records.h"
#include "report.h"

static void print_usage(void) {
    printf(
        "hubflow_fileops - campaign record and delivery report utility\n\n"
        "Usage:\n"
        "  hubflow_fileops <command> [options]\n\n"
        "Commands:\n"
        "  import   --input <file.csv> [--out <clean.csv>]   Load and normalise records\n"
        "  report   --input <file.csv> [--out <report.txt>] [--campaign <id>] [--format txt|csv]\n"
        "  stats    --input <file>                           File size, line count, checksum\n"
        "  backup   --input <file> [--keep <n>]              Rotate timestamped backups\n"
        "  verify   --input <file> --checksum <hex>          Compare a stored checksum\n\n"
        "Every command prints an allocation summary so leaks are visible.\n");
}

static const char *option_value(int argc, char **argv, const char *name) {
    int i;

    for (i = 2; i < argc - 1; i++) {
        if (strcmp(argv[i], name) == 0) {
            return argv[i + 1];
        }
    }

    return NULL;
}

static int command_import(int argc, char **argv) {
    hf_record_store store;
    const char *input = option_value(argc, argv, "--input");
    const char *output = option_value(argc, argv, "--out");
    size_t rejected = 0;
    int status;

    if (input == NULL) {
        fprintf(stderr, "import: --input is required\n");
        return HF_ERR_ARGUMENT;
    }

    if (hf_store_init(&store, 64) != HF_OK) {
        return HF_ERR_ALLOC;
    }

    status = hf_store_load_csv(&store, input, &rejected);
    if (status != HF_OK) {
        fprintf(stderr, "import: %s (%s)\n", hf_strerror(status), input);
        hf_store_free(&store);
        return status;
    }

    printf("imported %lu records from %s (%lu rows rejected)\n",
           (unsigned long)store.count, input, (unsigned long)rejected);

    printf("  queued=%lu sent=%lu delivered=%lu read=%lu failed=%lu skipped=%lu\n",
           (unsigned long)hf_store_count_state(&store, HF_STATE_QUEUED),
           (unsigned long)hf_store_count_state(&store, HF_STATE_SENT),
           (unsigned long)hf_store_count_state(&store, HF_STATE_DELIVERED),
           (unsigned long)hf_store_count_state(&store, HF_STATE_READ),
           (unsigned long)hf_store_count_state(&store, HF_STATE_FAILED),
           (unsigned long)hf_store_count_state(&store, HF_STATE_SKIPPED));

    if (output != NULL) {
        size_t removed = hf_store_remove_state(&store, HF_STATE_SKIPPED);
        status = hf_store_write_csv(&store, output);

        if (status != HF_OK) {
            fprintf(stderr, "import: could not write %s (%s)\n", output, hf_strerror(status));
        } else {
            printf("wrote %lu deliverable records to %s (dropped %lu skipped)\n",
                   (unsigned long)store.count, output, (unsigned long)removed);
        }
    }

    hf_store_free(&store);
    return status;
}

static int command_report(int argc, char **argv) {
    hf_record_store store;
    hf_report_summary summary;
    const char *input = option_value(argc, argv, "--input");
    const char *output = option_value(argc, argv, "--out");
    const char *campaign = option_value(argc, argv, "--campaign");
    const char *format = option_value(argc, argv, "--format");
    int status;

    if (input == NULL) {
        fprintf(stderr, "report: --input is required\n");
        return HF_ERR_ARGUMENT;
    }

    if (hf_store_init(&store, 64) != HF_OK) {
        return HF_ERR_ALLOC;
    }

    status = hf_store_load_csv(&store, input, NULL);
    if (status != HF_OK) {
        fprintf(stderr, "report: %s (%s)\n", hf_strerror(status), input);
        hf_store_free(&store);
        return status;
    }

    hf_report_build(&store, &summary);
    hf_report_print(&summary, campaign);

    if (output != NULL) {
        if (format != NULL && strcmp(format, "csv") == 0) {
            status = hf_report_write_csv(&summary, campaign, output);
        } else {
            status = hf_report_write_text(&summary, campaign, output);
        }

        if (status != HF_OK) {
            fprintf(stderr, "report: could not write %s (%s)\n", output, hf_strerror(status));
        } else {
            printf("\nreport written to %s\n", output);
        }
    }

    hf_store_free(&store);
    return status;
}

static int command_stats(int argc, char **argv) {
    hf_file_stats stats;
    const char *input = option_value(argc, argv, "--input");
    int status;

    if (input == NULL) {
        fprintf(stderr, "stats: --input is required\n");
        return HF_ERR_ARGUMENT;
    }

    status = hf_file_stats_of(input, &stats);
    if (status != HF_OK) {
        fprintf(stderr, "stats: %s (%s)\n", hf_strerror(status), input);
        return status;
    }

    printf("file      : %s\n", input);
    printf("size      : %ld bytes\n", stats.size_bytes);
    printf("lines     : %lu\n", (unsigned long)stats.line_count);
    printf("checksum  : %08lx\n", stats.checksum);

    return HF_OK;
}

static int command_backup(int argc, char **argv) {
    const char *input = option_value(argc, argv, "--input");
    const char *keep_text = option_value(argc, argv, "--keep");
    unsigned int keep = 3;
    int status;

    if (input == NULL) {
        fprintf(stderr, "backup: --input is required\n");
        return HF_ERR_ARGUMENT;
    }

    if (keep_text != NULL) {
        int parsed = atoi(keep_text);
        if (parsed > 0 && parsed < 100) {
            keep = (unsigned int)parsed;
        }
    }

    status = hf_file_backup(input, keep);
    if (status != HF_OK) {
        fprintf(stderr, "backup: %s (%s)\n", hf_strerror(status), input);
        return status;
    }

    printf("backup created for %s, keeping %u generations\n", input, keep);
    return HF_OK;
}

static int command_verify(int argc, char **argv) {
    const char *input = option_value(argc, argv, "--input");
    const char *expected = option_value(argc, argv, "--checksum");
    unsigned long actual = 0;
    unsigned long wanted = 0;
    int status;

    if (input == NULL || expected == NULL) {
        fprintf(stderr, "verify: --input and --checksum are required\n");
        return HF_ERR_ARGUMENT;
    }

    status = hf_checksum_file(input, &actual);
    if (status != HF_OK) {
        fprintf(stderr, "verify: %s (%s)\n", hf_strerror(status), input);
        return status;
    }

    wanted = strtoul(expected, NULL, 16);

    printf("expected  : %08lx\n", wanted);
    printf("actual    : %08lx\n", actual);

    if (wanted != actual) {
        printf("result    : MISMATCH\n");
        return HF_ERR_FORMAT;
    }

    printf("result    : MATCH\n");
    return HF_OK;
}

int main(int argc, char **argv) {
    int status;

    if (argc < 2) {
        print_usage();
        return 2;
    }

    if (strcmp(argv[1], "--help") == 0 || strcmp(argv[1], "-h") == 0) {
        print_usage();
        return 0;
    }

    if (strcmp(argv[1], "import") == 0) {
        status = command_import(argc, argv);
    } else if (strcmp(argv[1], "report") == 0) {
        status = command_report(argc, argv);
    } else if (strcmp(argv[1], "stats") == 0) {
        status = command_stats(argc, argv);
    } else if (strcmp(argv[1], "backup") == 0) {
        status = command_backup(argc, argv);
    } else if (strcmp(argv[1], "verify") == 0) {
        status = command_verify(argc, argv);
    } else {
        fprintf(stderr, "unknown command: %s\n\n", argv[1]);
        print_usage();
        return 2;
    }

    printf("\n");
    hf_memory_report();

    return status == HF_OK ? 0 : 1;
}
