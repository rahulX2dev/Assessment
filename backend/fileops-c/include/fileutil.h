#ifndef HUBFLOW_FILEUTIL_H
#define HUBFLOW_FILEUTIL_H

#include <stdio.h>

#include "common.h"

typedef struct {
    long size_bytes;
    size_t line_count;
    unsigned long checksum;
} hf_file_stats;

int hf_file_exists(const char *path);
long hf_file_size(const char *path);
int hf_file_stats_of(const char *path, hf_file_stats *stats);

unsigned long hf_checksum_buffer(const unsigned char *data, size_t length);
int hf_checksum_file(const char *path, unsigned long *checksum);

int hf_file_copy(const char *source, const char *destination);
int hf_file_backup(const char *path, unsigned int keep);
int hf_write_atomic(const char *path, const char *content, size_t length);
int hf_ensure_parent_writable(const char *path);

#endif
