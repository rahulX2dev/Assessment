#ifndef HUBFLOW_COMMON_H
#define HUBFLOW_COMMON_H

#include <stddef.h>

#define HF_OK              0
#define HF_ERR_ALLOC      -1
#define HF_ERR_IO         -2
#define HF_ERR_FORMAT     -3
#define HF_ERR_NOT_FOUND  -4
#define HF_ERR_ARGUMENT   -5
#define HF_ERR_LIMIT      -6

#define HF_MAX_FIELD_LEN   256
#define HF_MAX_LINE_LEN    8192
#define HF_MAX_COLUMNS     64

const char *hf_strerror(int code);

void *hf_malloc(size_t size);
void *hf_calloc(size_t count, size_t size);
void *hf_realloc(void *ptr, size_t size);
char *hf_strdup(const char *source);
char *hf_strndup(const char *source, size_t length);
void hf_free(void *ptr);

size_t hf_alloc_count(void);
size_t hf_free_count(void);
size_t hf_live_bytes(void);
void hf_memory_report(void);

char *hf_trim(char *text);
int hf_str_ieq(const char *left, const char *right);
void hf_str_lower(char *text);

#endif
