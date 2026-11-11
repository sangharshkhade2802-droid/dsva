#include "analyzer.h"
#include "sorting.h"
#include "searching.h"

static void get_sorting_complexities(const char *name, char *tc, char *sc) {
    if (strstr(name, "Bubble")) {
        strcpy(tc, "O(n²)");
        strcpy(sc, "O(1)");
    } else if (strstr(name, "Selection")) {
        strcpy(tc, "O(n²)");
        strcpy(sc, "O(1)");
    } else if (strstr(name, "Insertion")) {
        strcpy(tc, "O(n²)");
        strcpy(sc, "O(1)");
    } else if (strstr(name, "Merge")) {
        strcpy(tc, "O(n log n)");
        strcpy(sc, "O(n)");
    } else if (strstr(name, "Quick")) {
        strcpy(tc, "O(n log n)");
        strcpy(sc, "O(log n)");
    } else if (strstr(name, "Heap")) {
        strcpy(tc, "O(n log n)");
        strcpy(sc, "O(1)");
    } else if (strstr(name, "Counting")) {
        strcpy(tc, "O(n + k)");
        strcpy(sc, "O(k)");
    } else if (strstr(name, "Radix")) {
        strcpy(tc, "O(d * (n + b))");
        strcpy(sc, "O(n + b)");
    } else if (strstr(name, "Shell")) {
        strcpy(tc, "O(n log² n)");
        strcpy(sc, "O(1)");
    } else {
        strcpy(tc, "O(n + k)");
        strcpy(sc, "O(n + k)");
    }
}

ComparisonResult* analyzer_compare_sorting(const char *algorithms[], int algo_count, const int *input, int size) {
    ComparisonResult *cr = (ComparisonResult*)malloc(sizeof(ComparisonResult));
    strcpy(cr->comparison_name, "Sorting Algorithm Performance Comparison");
    cr->capacity = algo_count > 0 ? algo_count : 4;
    cr->count = 0;
    cr->metrics = (AlgorithmMetric*)malloc(sizeof(AlgorithmMetric) * cr->capacity);
    
    for (int i = 0; i < algo_count; i++) {
        const char *name = algorithms[i];
        ExecutionTrace *tr = NULL;
        
        if (strstr(name, "Bubble")) tr = run_bubble_sort(input, size);
        else if (strstr(name, "Selection")) tr = run_selection_sort(input, size);
        else if (strstr(name, "Insertion")) tr = run_insertion_sort(input, size);
        else if (strstr(name, "Merge")) tr = run_merge_sort(input, size);
        else if (strstr(name, "Quick")) tr = run_quick_sort(input, size);
        else if (strstr(name, "Heap")) tr = run_heap_sort(input, size);
        else if (strstr(name, "Counting")) tr = run_counting_sort(input, size);
        else if (strstr(name, "Radix")) tr = run_radix_sort(input, size);
        else if (strstr(name, "Shell")) tr = run_shell_sort(input, size);
        else if (strstr(name, "Bucket")) tr = run_bucket_sort(input, size);
        else tr = run_quick_sort(input, size);
        
        if (tr) {
            AlgorithmMetric *m = &cr->metrics[cr->count++];
            strncpy(m->name, tr->title, sizeof(m->name) - 1);
            m->name[sizeof(m->name) - 1] = '\0';
            m->n = size;
            m->time_us = tr->execution_time_us;
            m->comparisons = tr->comparisons;
            m->swaps = tr->swaps;
            m->operations = tr->operations;
            get_sorting_complexities(tr->title, m->time_complexity, m->space_complexity);
            trace_free(tr);
        }
    }
    return cr;
}

void comparison_free(ComparisonResult *cr) {
    if (!cr) return;
    if (cr->metrics) free(cr->metrics);
    free(cr);
}

char* comparison_to_json(ComparisonResult *cr) {
    if (!cr) return NULL;
    StringBuilder *sb = sb_create(2048);
    sb_append(sb, "{\n");
    sb_append_format(sb, "  \"comparison\": \"%s\",\n", cr->comparison_name);
    sb_append(sb, "  \"metrics\": [\n");
    
    for (int i = 0; i < cr->count; i++) {
        AlgorithmMetric *m = &cr->metrics[i];
        sb_append(sb, "    {\n");
        sb_append_format(sb, "      \"name\": \"%s\",\n", m->name);
        sb_append_format(sb, "      \"n\": %d,\n", m->n);
        sb_append_format(sb, "      \"time_us\": %.2f,\n", m->time_us);
        sb_append_format(sb, "      \"comparisons\": %d,\n", m->comparisons);
        sb_append_format(sb, "      \"swaps\": %d,\n", m->swaps);
        sb_append_format(sb, "      \"operations\": %d,\n", m->operations);
        sb_append_format(sb, "      \"time_complexity\": \"%s\",\n", m->time_complexity);
        sb_append_format(sb, "      \"space_complexity\": \"%s\"\n", m->space_complexity);
        sb_append_format(sb, "    }%s\n", (i + 1 < cr->count) ? "," : "");
    }
    sb_append(sb, "  ]\n");
    sb_append(sb, "}");
    return sb_finish(sb);
}

char* analyzer_benchmark_scaling(const char *algorithms[], int algo_count, const int sizes[], int sizes_count) {
    StringBuilder *sb = sb_create(4096);
    sb_append(sb, "{\n  \"benchmark_scaling\": [\n");
    
    for (int s = 0; s < sizes_count; s++) {
        int n = sizes[s];
        int *test_arr = (int*)malloc(sizeof(int) * n);
        for (int i = 0; i < n; i++) test_arr[i] = rand() % 10000;
        
        sb_append(sb, "    {\n");
        sb_append_format(sb, "      \"n\": %d,\n", n);
        sb_append(sb, "      \"results\": {\n");
        
        for (int a = 0; a < algo_count; a++) {
            const char *algo = algorithms[a];
            int *arr_copy = (int*)malloc(sizeof(int) * n);
            memcpy(arr_copy, test_arr, sizeof(int) * n);
            
            double t0 = get_time_us();
            if (strstr(algo, "Bubble")) {
                for (int i = 0; i < n - 1; i++) {
                    for (int j = 0; j < n - i - 1; j++) {
                        if (arr_copy[j] > arr_copy[j + 1]) {
                            int tmp = arr_copy[j]; arr_copy[j] = arr_copy[j + 1]; arr_copy[j + 1] = tmp;
                        }
                    }
                }
            } else if (strstr(algo, "Quick")) {
                /* standard quicksort benchmark */
                ExecutionTrace *tr = run_quick_sort(arr_copy, n);
                trace_free(tr);
            } else if (strstr(algo, "Merge")) {
                ExecutionTrace *tr = run_merge_sort(arr_copy, n);
                trace_free(tr);
            } else {
                ExecutionTrace *tr = run_heap_sort(arr_copy, n);
                trace_free(tr);
            }
            double t1 = get_time_us();
            
            sb_append_format(sb, "        \"%s\": %.2f%s\n", algo, (t1 - t0), (a + 1 < algo_count) ? "," : "");
            free(arr_copy);
        }
        
        sb_append(sb, "      }\n");
        sb_append_format(sb, "    }%s\n", (s + 1 < sizes_count) ? "," : "");
        free(test_arr);
    }
    
    sb_append(sb, "  ]\n}");
    return sb_finish(sb);
}
