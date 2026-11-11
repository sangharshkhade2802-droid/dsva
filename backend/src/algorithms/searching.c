#include "searching.h"
#include <math.h>

static int* clone_arr(const int *src, int n) {
    if (n <= 0) return NULL;
    int *dst = (int*)malloc(sizeof(int) * n);
    memcpy(dst, src, sizeof(int) * n);
    return dst;
}

/* 1. Linear Search */
ExecutionTrace* run_linear_search(const int *input, int size, int target) {
    ExecutionTrace *tr = trace_create("Linear Search", "Searching");
    if (size <= 0) return tr;
    int *arr = clone_arr(input, size);
    
    double t0 = get_time_us();
    char aux_buf[128];
    snprintf(aux_buf, sizeof(aux_buf), "{\"target\": %d}", target);
    trace_add_step(tr, "init", "Starting Linear Search for target", 1, NULL, 0, arr, size, aux_buf);
    
    bool found = false;
    for (int i = 0; i < size; i++) {
        int idx[1] = {i};
        char desc[128];
        snprintf(desc, sizeof(desc), "Checking array[%d]=%d against target %d", i, arr[i], target);
        snprintf(aux_buf, sizeof(aux_buf), "{\"target\": %d, \"current\": %d}", target, i);
        trace_add_step(tr, "compare", desc, 4, idx, 1, arr, size, aux_buf);
        
        if (arr[i] == target) {
            snprintf(desc, sizeof(desc), "Target %d FOUND at index %d!", target, i);
            snprintf(aux_buf, sizeof(aux_buf), "{\"target\": %d, \"found_index\": %d}", target, i);
            trace_add_step(tr, "found", desc, 7, idx, 1, arr, size, aux_buf);
            found = true;
            break;
        }
    }
    
    if (!found) {
        char desc[128];
        snprintf(desc, sizeof(desc), "Target %d NOT FOUND in array after scanning all %d elements", target, size);
        trace_add_step(tr, "not_found", desc, 12, NULL, 0, arr, size, aux_buf);
    }
    
    double t1 = get_time_us();
    tr->execution_time_us = t1 - t0;
    free(arr);
    return tr;
}

/* 2. Binary Search */
ExecutionTrace* run_binary_search(const int *input, int size, int target) {
    ExecutionTrace *tr = trace_create("Binary Search", "Searching");
    if (size <= 0) return tr;
    int *arr = clone_arr(input, size);
    
    double t0 = get_time_us();
    char aux_buf[256];
    snprintf(aux_buf, sizeof(aux_buf), "{\"target\": %d, \"low\": 0, \"high\": %d}", target, size - 1);
    trace_add_step(tr, "init", "Starting Binary Search on sorted array", 1, NULL, 0, arr, size, aux_buf);
    
    int low = 0;
    int high = size - 1;
    bool found = false;
    
    while (low <= high) {
        int mid = low + (high - low) / 2;
        int idx[3] = {low, mid, high};
        char desc[128];
        snprintf(desc, sizeof(desc), "Search bounds [%d..%d]. Middle index %d with value %d", low, high, mid, arr[mid]);
        snprintf(aux_buf, sizeof(aux_buf), "{\"target\": %d, \"low\": %d, \"high\": %d, \"mid\": %d}", target, low, high, mid);
        trace_add_step(tr, "examine_mid", desc, 6, idx, 3, arr, size, aux_buf);
        
        trace_add_step(tr, "compare", "Comparing middle value with target", 9, &mid, 1, arr, size, aux_buf);
        
        if (arr[mid] == target) {
            snprintf(desc, sizeof(desc), "Target %d FOUND at index %d!", target, mid);
            trace_add_step(tr, "found", desc, 11, &mid, 1, arr, size, aux_buf);
            found = true;
            break;
        } else if (arr[mid] < target) {
            snprintf(desc, sizeof(desc), "Value %d < target %d. Eliminating left half [%d..%d]", arr[mid], target, low, mid);
            trace_add_step(tr, "eliminate_left", desc, 15, idx, 2, arr, size, aux_buf);
            low = mid + 1;
        } else {
            snprintf(desc, sizeof(desc), "Value %d > target %d. Eliminating right half [%d..%d]", arr[mid], target, mid, high);
            trace_add_step(tr, "eliminate_right", desc, 18, idx, 2, arr, size, aux_buf);
            high = mid - 1;
        }
    }
    
    if (!found) {
        char desc[128];
        snprintf(desc, sizeof(desc), "Target %d NOT FOUND in sorted array", target);
        snprintf(aux_buf, sizeof(aux_buf), "{\"target\": %d}", target);
        trace_add_step(tr, "not_found", desc, 23, NULL, 0, arr, size, aux_buf);
    }
    
    double t1 = get_time_us();
    tr->execution_time_us = t1 - t0;
    free(arr);
    return tr;
}

/* 3. Jump Search */
ExecutionTrace* run_jump_search(const int *input, int size, int target) {
    ExecutionTrace *tr = trace_create("Jump Search", "Searching");
    if (size <= 0) return tr;
    int *arr = clone_arr(input, size);
    
    double t0 = get_time_us();
    int step = (int)sqrt((double)size);
    if (step < 1) step = 1;
    
    char aux_buf[256];
    snprintf(aux_buf, sizeof(aux_buf), "{\"target\": %d, \"block_step\": %d}", target, step);
    trace_add_step(tr, "init", "Starting Jump Search with block jump step", 1, NULL, 0, arr, size, aux_buf);
    
    int prev = 0;
    while (arr[((step < size ? step : size) - 1)] < target) {
        int idx[2] = {prev, (step < size ? step : size) - 1};
        char desc[128];
        snprintf(desc, sizeof(desc), "Jumping block [%d..%d]. Element %d < target %d", prev, idx[1], arr[idx[1]], target);
        trace_add_step(tr, "jump", desc, 6, idx, 2, arr, size, aux_buf);
        
        prev = step;
        step += (int)sqrt((double)size);
        if (prev >= size) {
            trace_add_step(tr, "not_found", "Jumped beyond array bounds. Target not found", 11, NULL, 0, arr, size, aux_buf);
            double t1 = get_time_us();
            tr->execution_time_us = t1 - t0;
            free(arr);
            return tr;
        }
    }
    
    int end = step < size ? step : size;
    char desc[128];
    snprintf(desc, sizeof(desc), "Target lies within block [%d..%d]. Initiating linear scan", prev, end - 1);
    trace_add_step(tr, "linear_block", desc, 16, NULL, 0, arr, size, aux_buf);
    
    bool found = false;
    for (int i = prev; i < end; i++) {
        int idx[1] = {i};
        snprintf(desc, sizeof(desc), "Checking array[%d]=%d against target %d", i, arr[i], target);
        trace_add_step(tr, "compare", desc, 19, idx, 1, arr, size, aux_buf);
        
        if (arr[i] == target) {
            snprintf(desc, sizeof(desc), "Target %d FOUND at index %d!", target, i);
            trace_add_step(tr, "found", desc, 22, idx, 1, arr, size, aux_buf);
            found = true;
            break;
        }
    }
    
    if (!found) {
        trace_add_step(tr, "not_found", "Target not found in candidate block", 27, NULL, 0, arr, size, aux_buf);
    }
    
    double t1 = get_time_us();
    tr->execution_time_us = t1 - t0;
    free(arr);
    return tr;
}

/* 4. Interpolation Search */
ExecutionTrace* run_interpolation_search(const int *input, int size, int target) {
    ExecutionTrace *tr = trace_create("Interpolation Search", "Searching");
    if (size <= 0) return tr;
    int *arr = clone_arr(input, size);
    
    double t0 = get_time_us();
    char aux_buf[256];
    snprintf(aux_buf, sizeof(aux_buf), "{\"target\": %d}", target);
    trace_add_step(tr, "init", "Starting Interpolation Search on uniformly distributed array", 1, NULL, 0, arr, size, aux_buf);
    
    int low = 0;
    int high = size - 1;
    bool found = false;
    
    while (low <= high && target >= arr[low] && target <= arr[high]) {
        if (low == high) {
            if (arr[low] == target) {
                int idx[1] = {low};
                trace_add_step(tr, "found", "Target found at single remaining index", 7, idx, 1, arr, size, aux_buf);
                found = true;
            }
            break;
        }
        
        /* Probe position formula */
        long long pos = low + (((double)(high - low) / (arr[high] - arr[low])) * (target - arr[low]));
        if (pos < low || pos > high) break;
        
        int idx[3] = {low, (int)pos, high};
        char desc[128];
        snprintf(desc, sizeof(desc), "Interpolation probe computed at index %d (value %d)", (int)pos, arr[pos]);
        trace_add_step(tr, "probe", desc, 13, idx, 3, arr, size, aux_buf);
        
        if (arr[pos] == target) {
            int f_idx[1] = {(int)pos};
            snprintf(desc, sizeof(desc), "Target %d FOUND at probe index %d!", target, (int)pos);
            trace_add_step(tr, "found", desc, 16, f_idx, 1, arr, size, aux_buf);
            found = true;
            break;
        }
        
        if (arr[pos] < target) {
            trace_add_step(tr, "eliminate_left", "Probe value < target. Adjusting low bound", 21, idx, 2, arr, size, aux_buf);
            low = (int)pos + 1;
        } else {
            trace_add_step(tr, "eliminate_right", "Probe value > target. Adjusting high bound", 24, idx, 2, arr, size, aux_buf);
            high = (int)pos - 1;
        }
    }
    
    if (!found) {
        trace_add_step(tr, "not_found", "Target not found within probe ranges", 29, NULL, 0, arr, size, aux_buf);
    }
    
    double t1 = get_time_us();
    tr->execution_time_us = t1 - t0;
    free(arr);
    return tr;
}

/* 5. Exponential Search */
ExecutionTrace* run_exponential_search(const int *input, int size, int target) {
    ExecutionTrace *tr = trace_create("Exponential Search", "Searching");
    if (size <= 0) return tr;
    int *arr = clone_arr(input, size);
    
    double t0 = get_time_us();
    char aux_buf[256];
    snprintf(aux_buf, sizeof(aux_buf), "{\"target\": %d}", target);
    trace_add_step(tr, "init", "Starting Exponential Search for unbounded/sorted arrays", 1, NULL, 0, arr, size, aux_buf);
    
    if (arr[0] == target) {
        int idx[1] = {0};
        trace_add_step(tr, "found", "Target found at index 0!", 4, idx, 1, arr, size, aux_buf);
        tr->execution_time_us = get_time_us() - t0;
        free(arr);
        return tr;
    }
    
    int i = 1;
    while (i < size && arr[i] <= target) {
        int idx[1] = {i};
        char desc[128];
        snprintf(desc, sizeof(desc), "Exponential range check at index %d (value %d <= target %d)", i, arr[i], target);
        trace_add_step(tr, "exp_jump", desc, 9, idx, 1, arr, size, aux_buf);
        i = i * 2;
    }
    
    int low = i / 2;
    int high = (i < size) ? i : size - 1;
    char desc[128];
    snprintf(desc, sizeof(desc), "Range bound found [%d..%d]. Running binary search in range", low, high);
    trace_add_step(tr, "bounded_binary", desc, 14, NULL, 0, arr, size, aux_buf);
    
    bool found = false;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        int idx[3] = {low, mid, high};
        snprintf(desc, sizeof(desc), "Binary search mid %d (value %d)", mid, arr[mid]);
        trace_add_step(tr, "examine_mid", desc, 18, idx, 3, arr, size, aux_buf);
        
        if (arr[mid] == target) {
            snprintf(desc, sizeof(desc), "Target %d FOUND at index %d!", target, mid);
            trace_add_step(tr, "found", desc, 21, &mid, 1, arr, size, aux_buf);
            found = true;
            break;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    
    if (!found) {
        trace_add_step(tr, "not_found", "Target not found in range", 28, NULL, 0, arr, size, aux_buf);
    }
    
    double t1 = get_time_us();
    tr->execution_time_us = t1 - t0;
    free(arr);
    return tr;
}
