#include "common.h"
#include <stdarg.h>

StringBuilder* sb_create(size_t initial_cap) {
    if (initial_cap == 0) initial_cap = 1024;
    StringBuilder *sb = (StringBuilder*)malloc(sizeof(StringBuilder));
    if (!sb) return NULL;
    sb->data = (char*)malloc(initial_cap);
    if (!sb->data) {
        free(sb);
        return NULL;
    }
    sb->data[0] = '\0';
    sb->capacity = initial_cap;
    sb->length = 0;
    return sb;
}

void sb_append(StringBuilder *sb, const char *str) {
    if (!sb || !str) return;
    size_t len = strlen(str);
    if (sb->length + len + 1 > sb->capacity) {
        size_t new_cap = sb->capacity * 2 + len + 1024;
        char *new_data = (char*)realloc(sb->data, new_cap);
        if (!new_data) return;
        sb->data = new_data;
        sb->capacity = new_cap;
    }
    memcpy(sb->data + sb->length, str, len);
    sb->length += len;
    sb->data[sb->length] = '\0';
}

void sb_append_format(StringBuilder *sb, const char *fmt, ...) {
    if (!sb || !fmt) return;
    va_list args;
    va_start(args, fmt);
    char buf[1024];
    vsnprintf(buf, sizeof(buf), fmt, args);
    va_end(args);
    sb_append(sb, buf);
}

char* sb_finish(StringBuilder *sb) {
    if (!sb) return NULL;
    char *res = sb->data;
    free(sb);
    return res;
}

void sb_free(StringBuilder *sb) {
    if (!sb) return;
    if (sb->data) free(sb->data);
    free(sb);
}

ExecutionTrace* trace_create(const char *title, const char *category) {
    ExecutionTrace *trace = (ExecutionTrace*)malloc(sizeof(ExecutionTrace));
    if (!trace) return NULL;
    strncpy(trace->title, title ? title : "Algorithm", sizeof(trace->title) - 1);
    trace->title[sizeof(trace->title) - 1] = '\0';
    strncpy(trace->category, category ? category : "General", sizeof(trace->category) - 1);
    trace->category[sizeof(trace->category) - 1] = '\0';
    
    trace->step_capacity = 256;
    trace->step_count = 0;
    trace->steps = (EventStep*)malloc(sizeof(EventStep) * trace->step_capacity);
    trace->comparisons = 0;
    trace->swaps = 0;
    trace->operations = 0;
    trace->execution_time_us = 0.0;
    return trace;
}

void trace_add_step(ExecutionTrace *trace, const char *action, const char *desc, int line,
                    const int *indices, int idx_count,
                    const int *arr, int arr_size,
                    const char *aux_json) {
    if (!trace) return;
    if (trace->step_count >= trace->step_capacity) {
        trace->step_capacity *= 2;
        trace->steps = (EventStep*)realloc(trace->steps, sizeof(EventStep) * trace->step_capacity);
    }
    
    EventStep *s = &trace->steps[trace->step_count++];
    s->step = trace->step_count;
    strncpy(s->action, action ? action : "step", sizeof(s->action) - 1);
    s->action[sizeof(s->action) - 1] = '\0';
    strncpy(s->description, desc ? desc : "", sizeof(s->description) - 1);
    s->description[sizeof(s->description) - 1] = '\0';
    s->line_number = line;
    
    s->indices_count = (idx_count > 8) ? 8 : idx_count;
    if (indices && s->indices_count > 0) {
        memcpy(s->indices, indices, sizeof(int) * s->indices_count);
    } else {
        s->indices_count = 0;
    }
    
    s->array_size = arr_size;
    if (arr && arr_size > 0) {
        s->array_state = (int*)malloc(sizeof(int) * arr_size);
        memcpy(s->array_state, arr, sizeof(int) * arr_size);
    } else {
        s->array_state = NULL;
    }
    
    if (aux_json) {
        strncpy(s->aux_json, aux_json, sizeof(s->aux_json) - 1);
        s->aux_json[sizeof(s->aux_json) - 1] = '\0';
    } else {
        s->aux_json[0] = '\0';
    }
    
    trace->operations++;
    if (action) {
        if (strcmp(action, "compare") == 0) trace->comparisons++;
        else if (strcmp(action, "swap") == 0) trace->swaps++;
    }
}

void trace_free(ExecutionTrace *trace) {
    if (!trace) return;
    for (int i = 0; i < trace->step_count; i++) {
        if (trace->steps[i].array_state) {
            free(trace->steps[i].array_state);
        }
    }
    free(trace->steps);
    free(trace);
}

char* trace_to_json(ExecutionTrace *trace) {
    if (!trace) return NULL;
    StringBuilder *sb = sb_create(4096);
    sb_append(sb, "{\n");
    sb_append_format(sb, "  \"algorithm\": \"%s\",\n", trace->title);
    sb_append_format(sb, "  \"category\": \"%s\",\n", trace->category);
    sb_append(sb, "  \"status\": \"completed\",\n");
    sb_append_format(sb, "  \"comparisons\": %d,\n", trace->comparisons);
    sb_append_format(sb, "  \"swaps\": %d,\n", trace->swaps);
    sb_append_format(sb, "  \"operations\": %d,\n", trace->operations);
    sb_append_format(sb, "  \"execution_time_us\": %.2f,\n", trace->execution_time_us);
    sb_append(sb, "  \"steps\": [\n");
    
    for (int i = 0; i < trace->step_count; i++) {
        EventStep *s = &trace->steps[i];
        sb_append(sb, "    {\n");
        sb_append_format(sb, "      \"step\": %d,\n", s->step);
        sb_append_format(sb, "      \"action\": \"%s\",\n", s->action);
        sb_append_format(sb, "      \"line\": %d,\n", s->line_number);
        
        /* Escape quotes in description */
        sb_append(sb, "      \"description\": \"");
        for (const char *p = s->description; *p; p++) {
            if (*p == '"') sb_append(sb, "\\\"");
            else if (*p == '\\') sb_append(sb, "\\\\");
            else if (*p == '\n') sb_append(sb, "\\n");
            else {
                char c[2] = {*p, '\0'};
                sb_append(sb, c);
            }
        }
        sb_append(sb, "\",\n");
        
        sb_append(sb, "      \"indices\": [");
        for (int k = 0; k < s->indices_count; k++) {
            sb_append_format(sb, "%d%s", s->indices[k], (k + 1 < s->indices_count) ? ", " : "");
        }
        sb_append(sb, "],\n");
        
        if (s->array_state && s->array_size > 0) {
            sb_append(sb, "      \"array\": [");
            for (int k = 0; k < s->array_size; k++) {
                sb_append_format(sb, "%d%s", s->array_state[k], (k + 1 < s->array_size) ? ", " : "");
            }
            sb_append(sb, "],\n");
        } else {
            sb_append(sb, "      \"array\": [],\n");
        }
        
        if (s->aux_json[0] != '\0') {
            sb_append_format(sb, "      \"aux\": %s\n", s->aux_json);
        } else {
            sb_append(sb, "      \"aux\": null\n");
        }
        
        sb_append_format(sb, "    }%s\n", (i + 1 < trace->step_count) ? "," : "");
    }
    sb_append(sb, "  ]\n");
    sb_append(sb, "}");
    
    return sb_finish(sb);
}

double get_time_us(void) {
#ifdef _WIN32
    LARGE_INTEGER freq, counter;
    QueryPerformanceFrequency(&freq);
    QueryPerformanceCounter(&counter);
    return ((double)counter.QuadPart * 1000000.0) / (double)freq.QuadPart;
#else
    struct timespec ts;
    clock_gettime(CLOCK_MONOTONIC, &ts);
    return (double)ts.tv_sec * 1000000.0 + (double)ts.tv_nsec / 1000.0;
#endif
}
