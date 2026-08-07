#include "fileutil.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define HF_COPY_CHUNK 8192
#define HF_FNV_OFFSET 2166136261UL
#define HF_FNV_PRIME  16777619UL

int hf_file_exists(const char *path) {
    FILE *stream;

    if (path == NULL) {
        return 0;
    }

    stream = fopen(path, "rb");
    if (stream == NULL) {
        return 0;
    }

    fclose(stream);
    return 1;
}

long hf_file_size(const char *path) {
    FILE *stream;
    long size;

    if (path == NULL) {
        return -1;
    }

    stream = fopen(path, "rb");
    if (stream == NULL) {
        return -1;
    }

    if (fseek(stream, 0, SEEK_END) != 0) {
        fclose(stream);
        return -1;
    }

    size = ftell(stream);
    fclose(stream);
    return size;
}

unsigned long hf_checksum_buffer(const unsigned char *data, size_t length) {
    unsigned long hash = HF_FNV_OFFSET;
    size_t i;

    if (data == NULL) {
        return hash;
    }

    for (i = 0; i < length; i++) {
        hash ^= (unsigned long)data[i];
        hash *= HF_FNV_PRIME;
        hash &= 0xFFFFFFFFUL;
    }

    return hash;
}

int hf_checksum_file(const char *path, unsigned long *checksum) {
    FILE *stream;
    unsigned char buffer[HF_COPY_CHUNK];
    size_t read_bytes;
    unsigned long hash = HF_FNV_OFFSET;
    size_t i;

    if (path == NULL || checksum == NULL) {
        return HF_ERR_ARGUMENT;
    }

    stream = fopen(path, "rb");
    if (stream == NULL) {
        return HF_ERR_NOT_FOUND;
    }

    while ((read_bytes = fread(buffer, 1, sizeof(buffer), stream)) > 0) {
        for (i = 0; i < read_bytes; i++) {
            hash ^= (unsigned long)buffer[i];
            hash *= HF_FNV_PRIME;
            hash &= 0xFFFFFFFFUL;
        }
    }

    fclose(stream);
    *checksum = hash;
    return HF_OK;
}

int hf_file_stats_of(const char *path, hf_file_stats *stats) {
    FILE *stream;
    unsigned char buffer[HF_COPY_CHUNK];
    size_t read_bytes;
    size_t i;
    unsigned long hash = HF_FNV_OFFSET;

    if (path == NULL || stats == NULL) {
        return HF_ERR_ARGUMENT;
    }

    stream = fopen(path, "rb");
    if (stream == NULL) {
        return HF_ERR_NOT_FOUND;
    }

    stats->size_bytes = 0;
    stats->line_count = 0;

    while ((read_bytes = fread(buffer, 1, sizeof(buffer), stream)) > 0) {
        stats->size_bytes += (long)read_bytes;

        for (i = 0; i < read_bytes; i++) {
            if (buffer[i] == '\n') {
                stats->line_count++;
            }
            hash ^= (unsigned long)buffer[i];
            hash *= HF_FNV_PRIME;
            hash &= 0xFFFFFFFFUL;
        }
    }

    fclose(stream);

    stats->checksum = hash;
    return HF_OK;
}

int hf_file_copy(const char *source, const char *destination) {
    FILE *in;
    FILE *out;
    unsigned char buffer[HF_COPY_CHUNK];
    size_t read_bytes;

    if (source == NULL || destination == NULL) {
        return HF_ERR_ARGUMENT;
    }

    in = fopen(source, "rb");
    if (in == NULL) {
        return HF_ERR_NOT_FOUND;
    }

    out = fopen(destination, "wb");
    if (out == NULL) {
        fclose(in);
        return HF_ERR_IO;
    }

    while ((read_bytes = fread(buffer, 1, sizeof(buffer), in)) > 0) {
        if (fwrite(buffer, 1, read_bytes, out) != read_bytes) {
            fclose(in);
            fclose(out);
            remove(destination);
            return HF_ERR_IO;
        }
    }

    fclose(in);

    if (fclose(out) != 0) {
        remove(destination);
        return HF_ERR_IO;
    }

    return HF_OK;
}

int hf_file_backup(const char *path, unsigned int keep) {
    char current[512];
    char next[512];
    unsigned int index;

    if (path == NULL || keep == 0) {
        return HF_ERR_ARGUMENT;
    }

    if (!hf_file_exists(path)) {
        return HF_ERR_NOT_FOUND;
    }

    for (index = keep; index > 1; index--) {
        snprintf(current, sizeof(current), "%s.%u.bak", path, index - 1);
        snprintf(next, sizeof(next), "%s.%u.bak", path, index);

        if (hf_file_exists(current)) {
            remove(next);
            rename(current, next);
        }
    }

    snprintf(next, sizeof(next), "%s.1.bak", path);
    remove(next);

    return hf_file_copy(path, next);
}

int hf_write_atomic(const char *path, const char *content, size_t length) {
    char temp_path[512];
    FILE *out;

    if (path == NULL || content == NULL) {
        return HF_ERR_ARGUMENT;
    }

    snprintf(temp_path, sizeof(temp_path), "%s.tmp", path);

    out = fopen(temp_path, "wb");
    if (out == NULL) {
        return HF_ERR_IO;
    }

    if (length > 0 && fwrite(content, 1, length, out) != length) {
        fclose(out);
        remove(temp_path);
        return HF_ERR_IO;
    }

    if (fflush(out) != 0 || fclose(out) != 0) {
        remove(temp_path);
        return HF_ERR_IO;
    }

    remove(path);

    if (rename(temp_path, path) != 0) {
        remove(temp_path);
        return HF_ERR_IO;
    }

    return HF_OK;
}

int hf_ensure_parent_writable(const char *path) {
    char probe[512];
    FILE *stream;
    const char *slash;
    size_t length;

    if (path == NULL) {
        return HF_ERR_ARGUMENT;
    }

    slash = strrchr(path, '/');
    if (slash == NULL) {
        slash = strrchr(path, '\\');
    }

    if (slash == NULL) {
        snprintf(probe, sizeof(probe), ".hubflow_probe");
    } else {
        length = (size_t)(slash - path);
        if (length >= sizeof(probe) - 20) {
            return HF_ERR_LIMIT;
        }
        memcpy(probe, path, length);
        probe[length] = '\0';
        strncat(probe, "/.hubflow_probe", sizeof(probe) - strlen(probe) - 1);
    }

    stream = fopen(probe, "wb");
    if (stream == NULL) {
        return HF_ERR_IO;
    }

    fclose(stream);
    remove(probe);
    return HF_OK;
}
