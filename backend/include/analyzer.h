#ifndef DSVA_ANALYZER_H
#define DSVA_ANALYZER_H

#include "common.h"

typedef struct {
    char name[64];
    int n;
    double time_us;
    int comparisons;
    int swaps;
    int operations;
    char time_complexity[32];
    char space_complexity[32];
} AlgorithmMetric;

typedef struct {
    char comparison_name[128];
    AlgorithmMetric *metrics;
    int count;
    int capacity;
} ComparisonResult;

ComparisonResult* analyzer_compare_sorting(const char *algorithms[], int algo_count, const int *input, int size);
void comparison_free(ComparisonResult *cr);
char* comparison_to_json(ComparisonResult *cr);

/* Benchmark suite for scaling N */
char* analyzer_benchmark_scaling(const char *algorithms[], int algo_count, const int sizes[], int sizes_count);

#endif /* DSVA_ANALYZER_H */
