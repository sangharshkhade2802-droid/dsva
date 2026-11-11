#ifndef DSVA_SORTING_H
#define DSVA_SORTING_H

#include "common.h"

ExecutionTrace* run_bubble_sort(const int *input, int size);
ExecutionTrace* run_selection_sort(const int *input, int size);
ExecutionTrace* run_insertion_sort(const int *input, int size);
ExecutionTrace* run_merge_sort(const int *input, int size);
ExecutionTrace* run_quick_sort(const int *input, int size);
ExecutionTrace* run_heap_sort(const int *input, int size);
ExecutionTrace* run_counting_sort(const int *input, int size);
ExecutionTrace* run_radix_sort(const int *input, int size);
ExecutionTrace* run_shell_sort(const int *input, int size);
ExecutionTrace* run_bucket_sort(const int *input, int size);

#endif /* DSVA_SORTING_H */
