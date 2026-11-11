#ifndef DSVA_COMMON_H
#define DSVA_COMMON_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <stdint.h>
#include <time.h>

#ifdef _WIN32
#include <windows.h>
#else
#include <sys/time.h>
#endif

/* Dynamic String / JSON Buffer */
typedef struct {
    char *data;
    size_t capacity;
    size_t length;
} StringBuilder;

StringBuilder* sb_create(size_t initial_cap);
void sb_append(StringBuilder *sb, const char *str);
void sb_append_format(StringBuilder *sb, const char *fmt, ...);
char* sb_finish(StringBuilder *sb);
void sb_free(StringBuilder *sb);

/* Event Trace System */
typedef struct {
    int step;
    char action[32];
    char description[256];
    int line_number;
    
    /* Optional metadata arrays */
    int indices[8];
    int indices_count;
    
    int *array_state;
    int array_size;
    
    /* Structure-specific auxiliary data */
    char aux_json[512];
} EventStep;

typedef struct {
    char title[64];
    char category[64];
    EventStep *steps;
    int step_count;
    int step_capacity;
    
    int comparisons;
    int swaps;
    int operations;
    double execution_time_us;
} ExecutionTrace;

ExecutionTrace* trace_create(const char *title, const char *category);
void trace_add_step(ExecutionTrace *trace, const char *action, const char *desc, int line, 
                    const int *indices, int idx_count, 
                    const int *arr, int arr_size, 
                    const char *aux_json);
void trace_free(ExecutionTrace *trace);
char* trace_to_json(ExecutionTrace *trace);

/* High resolution timer */
double get_time_us(void);

#endif /* DSVA_COMMON_H */
