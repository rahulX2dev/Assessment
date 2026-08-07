#include "common.h"

#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    size_t allocations;
    size_t frees;
    size_t live_bytes;
} hf_memory_stats;

static hf_memory_stats g_stats = {0, 0, 0};

typedef struct {
    size_t size;
} hf_block_header;

static void *hf_track_alloc(void *raw, size_t size) {
    hf_block_header *header;

    if (raw == NULL) {
        return NULL;
    }

    header = (hf_block_header *)raw;
    header->size = size;

    g_stats.allocations++;
    g_stats.live_bytes += size;

    return (char *)raw + sizeof(hf_block_header);
}

const char *hf_strerror(int code) {
    switch (code) {
        case HF_OK:             return "ok";
        case HF_ERR_ALLOC:      return "out of memory";
        case HF_ERR_IO:         return "file input/output failure";
        case HF_ERR_FORMAT:     return "malformed file content";
        case HF_ERR_NOT_FOUND:  return "resource not found";
        case HF_ERR_ARGUMENT:   return "invalid argument";
        case HF_ERR_LIMIT:      return "limit exceeded";
        default:                return "unknown error";
    }
}

void *hf_malloc(size_t size) {
    void *raw;

    if (size == 0) {
        return NULL;
    }

    raw = malloc(size + sizeof(hf_block_header));
    return hf_track_alloc(raw, size);
}

void *hf_calloc(size_t count, size_t size) {
    void *block;
    size_t total;

    if (count == 0 || size == 0) {
        return NULL;
    }

    if (count > (size_t)-1 / size) {
        return NULL;
    }

    total = count * size;
    block = hf_malloc(total);

    if (block != NULL) {
        memset(block, 0, total);
    }

    return block;
}

void *hf_realloc(void *ptr, size_t size) {
    hf_block_header *header;
    void *raw;
    size_t previous;

    if (ptr == NULL) {
        return hf_malloc(size);
    }

    if (size == 0) {
        hf_free(ptr);
        return NULL;
    }

    header = (hf_block_header *)((char *)ptr - sizeof(hf_block_header));
    previous = header->size;

    raw = realloc(header, size + sizeof(hf_block_header));
    if (raw == NULL) {
        return NULL;
    }

    header = (hf_block_header *)raw;
    header->size = size;

    g_stats.live_bytes -= previous;
    g_stats.live_bytes += size;

    return (char *)raw + sizeof(hf_block_header);
}

char *hf_strdup(const char *source) {
    if (source == NULL) {
        return NULL;
    }
    return hf_strndup(source, strlen(source));
}

char *hf_strndup(const char *source, size_t length) {
    char *copy;

    if (source == NULL) {
        return NULL;
    }

    copy = (char *)hf_malloc(length + 1);
    if (copy == NULL) {
        return NULL;
    }

    memcpy(copy, source, length);
    copy[length] = '\0';
    return copy;
}

void hf_free(void *ptr) {
    hf_block_header *header;

    if (ptr == NULL) {
        return;
    }

    header = (hf_block_header *)((char *)ptr - sizeof(hf_block_header));

    g_stats.frees++;
    g_stats.live_bytes -= header->size;

    free(header);
}

size_t hf_alloc_count(void) {
    return g_stats.allocations;
}

size_t hf_free_count(void) {
    return g_stats.frees;
}

size_t hf_live_bytes(void) {
    return g_stats.live_bytes;
}

void hf_memory_report(void) {
    printf("memory: %lu allocations, %lu frees, %lu bytes still held\n",
           (unsigned long)g_stats.allocations,
           (unsigned long)g_stats.frees,
           (unsigned long)g_stats.live_bytes);

    if (g_stats.allocations != g_stats.frees) {
        printf("memory: WARNING %lu blocks were never released\n",
               (unsigned long)(g_stats.allocations - g_stats.frees));
    }
}

char *hf_trim(char *text) {
    char *end;

    if (text == NULL) {
        return NULL;
    }

    while (*text != '\0' && isspace((unsigned char)*text)) {
        text++;
    }

    if (*text == '\0') {
        return text;
    }

    end = text + strlen(text) - 1;
    while (end > text && isspace((unsigned char)*end)) {
        *end = '\0';
        end--;
    }

    return text;
}

int hf_str_ieq(const char *left, const char *right) {
    if (left == NULL || right == NULL) {
        return left == right;
    }

    while (*left != '\0' && *right != '\0') {
        if (tolower((unsigned char)*left) != tolower((unsigned char)*right)) {
            return 0;
        }
        left++;
        right++;
    }

    return *left == *right;
}

void hf_str_lower(char *text) {
    if (text == NULL) {
        return;
    }

    while (*text != '\0') {
        *text = (char)tolower((unsigned char)*text);
        text++;
    }
}
