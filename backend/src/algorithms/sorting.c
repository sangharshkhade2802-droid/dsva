#include "sorting.h"

/* Helper to clone array */
static int* clone_arr(const int *src, int n) {
    if (n <= 0) return NULL;
    int *dst = (int*)malloc(sizeof(int) * n);
    memcpy(dst, src, sizeof(int) * n);
    return dst;
}

/* 1. Bubble Sort */
ExecutionTrace* run_bubble_sort(const int *input, int size) {
    ExecutionTrace *tr = trace_create("Bubble Sort", "Sorting");
    if (size <= 0) return tr;
    int *arr = clone_arr(input, size);
    
    double t0 = get_time_us();
    trace_add_step(tr, "init", "Initial unsorted array", 1, NULL, 0, arr, size, NULL);
    
    for (int i = 0; i < size - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < size - i - 1; j++) {
            int idx[2] = {j, j + 1};
            char desc[128];
            snprintf(desc, sizeof(desc), "Comparing array[%d]=%d and array[%d]=%d", j, arr[j], j + 1, arr[j + 1]);
            trace_add_step(tr, "compare", desc, 5, idx, 2, arr, size, NULL);
            
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
                
                snprintf(desc, sizeof(desc), "Swapped elements at indices %d and %d", j, j + 1);
                trace_add_step(tr, "swap", desc, 8, idx, 2, arr, size, NULL);
            }
        }
        int sorted_idx[1] = {size - 1 - i};
        trace_add_step(tr, "mark_sorted", "Element locked into sorted position", 12, sorted_idx, 1, arr, size, NULL);
        if (!swapped) break;
    }
    
    double t1 = get_time_us();
    tr->execution_time_us = t1 - t0;
    trace_add_step(tr, "complete", "Bubble sort complete. Array fully sorted", 15, NULL, 0, arr, size, NULL);
    free(arr);
    return tr;
}

/* 2. Selection Sort */
ExecutionTrace* run_selection_sort(const int *input, int size) {
    ExecutionTrace *tr = trace_create("Selection Sort", "Sorting");
    if (size <= 0) return tr;
    int *arr = clone_arr(input, size);
    
    double t0 = get_time_us();
    trace_add_step(tr, "init", "Initial unsorted array", 1, NULL, 0, arr, size, NULL);
    
    for (int i = 0; i < size - 1; i++) {
        int min_idx = i;
        int cur[1] = {i};
        trace_add_step(tr, "highlight", "Scanning for minimum element", 3, cur, 1, arr, size, NULL);
        
        for (int j = i + 1; j < size; j++) {
            int cmp[2] = {j, min_idx};
            char desc[128];
            snprintf(desc, sizeof(desc), "Checking if array[%d]=%d < current minimum array[%d]=%d", j, arr[j], min_idx, arr[min_idx]);
            trace_add_step(tr, "compare", desc, 6, cmp, 2, arr, size, NULL);
            
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
                int new_min[1] = {min_idx};
                snprintf(desc, sizeof(desc), "New minimum found at index %d (value %d)", min_idx, arr[min_idx]);
                trace_add_step(tr, "select", desc, 8, new_min, 1, arr, size, NULL);
            }
        }
        
        if (min_idx != i) {
            int temp = arr[i];
            arr[i] = arr[min_idx];
            arr[min_idx] = temp;
            int swp[2] = {i, min_idx};
            trace_add_step(tr, "swap", "Swapping found minimum into sorted partition", 13, swp, 2, arr, size, NULL);
        }
        int s[1] = {i};
        trace_add_step(tr, "mark_sorted", "Index marked sorted", 16, s, 1, arr, size, NULL);
    }
    
    double t1 = get_time_us();
    tr->execution_time_us = t1 - t0;
    trace_add_step(tr, "complete", "Selection sort complete", 20, NULL, 0, arr, size, NULL);
    free(arr);
    return tr;
}

/* 3. Insertion Sort */
ExecutionTrace* run_insertion_sort(const int *input, int size) {
    ExecutionTrace *tr = trace_create("Insertion Sort", "Sorting");
    if (size <= 0) return tr;
    int *arr = clone_arr(input, size);
    
    double t0 = get_time_us();
    trace_add_step(tr, "init", "Initial unsorted array", 1, NULL, 0, arr, size, NULL);
    
    for (int i = 1; i < size; i++) {
        int key = arr[i];
        int j = i - 1;
        int cur[1] = {i};
        char desc[128];
        snprintf(desc, sizeof(desc), "Selected key %d at index %d for insertion", key, i);
        trace_add_step(tr, "select", desc, 4, cur, 1, arr, size, NULL);
        
        while (j >= 0) {
            int cmp[2] = {j, j + 1};
            snprintf(desc, sizeof(desc), "Comparing key %d with array[%d]=%d", key, j, arr[j]);
            trace_add_step(tr, "compare", desc, 7, cmp, 2, arr, size, NULL);
            
            if (arr[j] > key) {
                arr[j + 1] = arr[j];
                int s[2] = {j, j + 1};
                snprintf(desc, sizeof(desc), "Shifted %d to index %d", arr[j], j + 1);
                trace_add_step(tr, "shift", desc, 10, s, 2, arr, size, NULL);
                j--;
            } else {
                break;
            }
        }
        arr[j + 1] = key;
        int ins[1] = {j + 1};
        snprintf(desc, sizeof(desc), "Inserted key %d at sorted position index %d", key, j + 1);
        trace_add_step(tr, "insert", desc, 15, ins, 1, arr, size, NULL);
    }
    
    double t1 = get_time_us();
    tr->execution_time_us = t1 - t0;
    trace_add_step(tr, "complete", "Insertion sort complete", 19, NULL, 0, arr, size, NULL);
    free(arr);
    return tr;
}

/* 4. Merge Sort */
static void merge(ExecutionTrace *tr, int *arr, int l, int m, int r, int total_size) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int *L = (int*)malloc(sizeof(int) * n1);
    int *R = (int*)malloc(sizeof(int) * n2);
    
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        int idx[2] = {l + i, m + 1 + j};
        char desc[128];
        snprintf(desc, sizeof(desc), "Comparing left element %d and right element %d", L[i], R[j]);
        trace_add_step(tr, "compare", desc, 12, idx, 2, arr, total_size, NULL);
        
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            int wr[1] = {k};
            snprintf(desc, sizeof(desc), "Placed %d at index %d from left subarray", L[i], k);
            trace_add_step(tr, "overwrite", desc, 15, wr, 1, arr, total_size, NULL);
            i++;
        } else {
            arr[k] = R[j];
            int wr[1] = {k};
            snprintf(desc, sizeof(desc), "Placed %d at index %d from right subarray", R[j], k);
            trace_add_step(tr, "overwrite", desc, 18, wr, 1, arr, total_size, NULL);
            j++;
        }
        k++;
    }
    
    while (i < n1) {
        arr[k] = L[i];
        int wr[1] = {k};
        trace_add_step(tr, "overwrite", "Placing remaining left element", 23, wr, 1, arr, total_size, NULL);
        i++;
        k++;
    }
    while (j < n2) {
        arr[k] = R[j];
        int wr[1] = {k};
        trace_add_step(tr, "overwrite", "Placing remaining right element", 28, wr, 1, arr, total_size, NULL);
        j++;
        k++;
    }
    
    free(L);
    free(R);
}

static void merge_sort_rec(ExecutionTrace *tr, int *arr, int l, int r, int total_size) {
    if (l < r) {
        int m = l + (r - l) / 2;
        int sub[2] = {l, r};
        char desc[128];
        snprintf(desc, sizeof(desc), "Dividing subarray range [%d..%d] at mid %d", l, r, m);
        trace_add_step(tr, "split", desc, 5, sub, 2, arr, total_size, NULL);
        
        merge_sort_rec(tr, arr, l, m, total_size);
        merge_sort_rec(tr, arr, m + 1, r, total_size);
        
        snprintf(desc, sizeof(desc), "Merging sorted subarrays [%d..%d] and [%d..%d]", l, m, m + 1, r);
        trace_add_step(tr, "merge", desc, 9, sub, 2, arr, total_size, NULL);
        merge(tr, arr, l, m, r, total_size);
    }
}

ExecutionTrace* run_merge_sort(const int *input, int size) {
    ExecutionTrace *tr = trace_create("Merge Sort", "Sorting");
    if (size <= 0) return tr;
    int *arr = clone_arr(input, size);
    
    double t0 = get_time_us();
    trace_add_step(tr, "init", "Initial unsorted array", 1, NULL, 0, arr, size, NULL);
    merge_sort_rec(tr, arr, 0, size - 1, size);
    double t1 = get_time_us();
    tr->execution_time_us = t1 - t0;
    
    trace_add_step(tr, "complete", "Merge sort complete", 35, NULL, 0, arr, size, NULL);
    free(arr);
    return tr;
}

/* 5. Quick Sort */
static int partition(ExecutionTrace *tr, int *arr, int low, int high, int total_size) {
    int pivot = arr[high];
    int p_idx[1] = {high};
    char desc[128];
    snprintf(desc, sizeof(desc), "Selected pivot %d at index %d", pivot, high);
    trace_add_step(tr, "pivot", desc, 4, p_idx, 1, arr, total_size, NULL);
    
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        int cmp[2] = {j, high};
        snprintf(desc, sizeof(desc), "Comparing array[%d]=%d with pivot %d", j, arr[j], pivot);
        trace_add_step(tr, "compare", desc, 8, cmp, 2, arr, total_size, NULL);
        
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            if (i != j) {
                int swp[2] = {i, j};
                snprintf(desc, sizeof(desc), "Swapping array[%d] and array[%d] to partition smaller elements", i, j);
                trace_add_step(tr, "swap", desc, 12, swp, 2, arr, total_size, NULL);
            }
        }
    }
    
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    int swp[2] = {i + 1, high};
    snprintf(desc, sizeof(desc), "Placed pivot %d in its final sorted position index %d", pivot, i + 1);
    trace_add_step(tr, "swap", desc, 18, swp, 2, arr, total_size, NULL);
    
    int s[1] = {i + 1};
    trace_add_step(tr, "mark_sorted", "Pivot element settled in place", 20, s, 1, arr, total_size, NULL);
    return (i + 1);
}

static void quick_sort_rec(ExecutionTrace *tr, int *arr, int low, int high, int total_size) {
    if (low < high) {
        int pi = partition(tr, arr, low, high, total_size);
        quick_sort_rec(tr, arr, low, pi - 1, total_size);
        quick_sort_rec(tr, arr, pi + 1, high, total_size);
    }
}

ExecutionTrace* run_quick_sort(const int *input, int size) {
    ExecutionTrace *tr = trace_create("Quick Sort", "Sorting");
    if (size <= 0) return tr;
    int *arr = clone_arr(input, size);
    
    double t0 = get_time_us();
    trace_add_step(tr, "init", "Initial unsorted array", 1, NULL, 0, arr, size, NULL);
    quick_sort_rec(tr, arr, 0, size - 1, size);
    double t1 = get_time_us();
    tr->execution_time_us = t1 - t0;
    
    trace_add_step(tr, "complete", "Quick sort complete", 30, NULL, 0, arr, size, NULL);
    free(arr);
    return tr;
}

/* 6. Heap Sort */
static void heapify(ExecutionTrace *tr, int *arr, int n, int i, int total_size) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    
    if (left < n) {
        int cmp[2] = {left, largest};
        trace_add_step(tr, "compare", "Comparing left child with largest", 6, cmp, 2, arr, total_size, NULL);
        if (arr[left] > arr[largest]) largest = left;
    }
    if (right < n) {
        int cmp[2] = {right, largest};
        trace_add_step(tr, "compare", "Comparing right child with largest", 10, cmp, 2, arr, total_size, NULL);
        if (arr[right] > arr[largest]) largest = right;
    }
    
    if (largest != i) {
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        int swp[2] = {i, largest};
        trace_add_step(tr, "swap", "Heapify: Swapping parent with larger child", 15, swp, 2, arr, total_size, NULL);
        heapify(tr, arr, n, largest, total_size);
    }
}

ExecutionTrace* run_heap_sort(const int *input, int size) {
    ExecutionTrace *tr = trace_create("Heap Sort", "Sorting");
    if (size <= 0) return tr;
    int *arr = clone_arr(input, size);
    
    double t0 = get_time_us();
    trace_add_step(tr, "init", "Initial unsorted array", 1, NULL, 0, arr, size, NULL);
    
    /* Build heap */
    trace_add_step(tr, "phase", "Building Max-Heap from array", 3, NULL, 0, arr, size, NULL);
    for (int i = size / 2 - 1; i >= 0; i--) {
        heapify(tr, arr, size, i, size);
    }
    
    /* Extract elements */
    trace_add_step(tr, "phase", "Extracting max elements one by one", 9, NULL, 0, arr, size, NULL);
    for (int i = size - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        int swp[2] = {0, i};
        trace_add_step(tr, "swap", "Moved maximum root to end of heap", 12, swp, 2, arr, size, NULL);
        
        int s[1] = {i};
        trace_add_step(tr, "mark_sorted", "Element locked into sorted position", 14, s, 1, arr, size, NULL);
        heapify(tr, arr, i, 0, size);
    }
    
    double t1 = get_time_us();
    tr->execution_time_us = t1 - t0;
    trace_add_step(tr, "complete", "Heap sort complete", 20, NULL, 0, arr, size, NULL);
    free(arr);
    return tr;
}

/* 7. Counting Sort */
ExecutionTrace* run_counting_sort(const int *input, int size) {
    ExecutionTrace *tr = trace_create("Counting Sort", "Sorting");
    if (size <= 0) return tr;
    int *arr = clone_arr(input, size);
    
    double t0 = get_time_us();
    trace_add_step(tr, "init", "Initial unsorted array", 1, NULL, 0, arr, size, NULL);
    
    int max_val = arr[0];
    int min_val = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] > max_val) max_val = arr[i];
        if (arr[i] < min_val) min_val = arr[i];
    }
    
    int range = max_val - min_val + 1;
    if (range > 10000) range = 10000; /* guard reasonable memory */
    int *count = (int*)calloc(range, sizeof(int));
    int *output = (int*)malloc(sizeof(int) * size);
    
    trace_add_step(tr, "phase", "Counting occurrences of each value", 5, NULL, 0, arr, size, NULL);
    for (int i = 0; i < size; i++) {
        count[arr[i] - min_val]++;
        int idx[1] = {i};
        char desc[128];
        snprintf(desc, sizeof(desc), "Counted value %d (frequency %d)", arr[i], count[arr[i] - min_val]);
        trace_add_step(tr, "count", desc, 8, idx, 1, arr, size, NULL);
    }
    
    for (int i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }
    
    for (int i = size - 1; i >= 0; i--) {
        int pos = count[arr[i] - min_val] - 1;
        output[pos] = arr[i];
        count[arr[i] - min_val]--;
    }
    
    for (int i = 0; i < size; i++) {
        arr[i] = output[i];
        int idx[1] = {i};
        char desc[128];
        snprintf(desc, sizeof(desc), "Placed %d at sorted position %d", arr[i], i);
        trace_add_step(tr, "overwrite", desc, 20, idx, 1, arr, size, NULL);
    }
    
    double t1 = get_time_us();
    tr->execution_time_us = t1 - t0;
    trace_add_step(tr, "complete", "Counting sort complete", 25, NULL, 0, arr, size, NULL);
    
    free(count);
    free(output);
    free(arr);
    return tr;
}

/* 8. Radix Sort */
static int get_max(const int *arr, int n) {
    int mx = arr[0];
    for (int i = 1; i < n; i++) if (arr[i] > mx) mx = arr[i];
    return mx;
}

static void count_sort_radix(ExecutionTrace *tr, int *arr, int n, int exp, int total_size) {
    int *output = (int*)malloc(sizeof(int) * n);
    int count[10] = {0};
    
    for (int i = 0; i < n; i++) {
        count[(arr[i] / exp) % 10]++;
    }
    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    for (int i = n - 1; i >= 0; i--) {
        int digit = (arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
    }
    for (int i = 0; i < n; i++) {
        arr[i] = output[i];
        int idx[1] = {i};
        char desc[128];
        snprintf(desc, sizeof(desc), "Radix (exp=%d): Placed %d at index %d", exp, arr[i], i);
        trace_add_step(tr, "overwrite", desc, 18, idx, 1, arr, total_size, NULL);
    }
    free(output);
}

ExecutionTrace* run_radix_sort(const int *input, int size) {
    ExecutionTrace *tr = trace_create("Radix Sort", "Sorting");
    if (size <= 0) return tr;
    int *arr = clone_arr(input, size);
    
    double t0 = get_time_us();
    trace_add_step(tr, "init", "Initial unsorted array", 1, NULL, 0, arr, size, NULL);
    
    int m = get_max(arr, size);
    for (int exp = 1; m / exp > 0; exp *= 10) {
        char desc[128];
        snprintf(desc, sizeof(desc), "Radix Pass: Sorting by digit position %d", exp);
        trace_add_step(tr, "phase", desc, 6, NULL, 0, arr, size, NULL);
        count_sort_radix(tr, arr, size, exp, size);
    }
    
    double t1 = get_time_us();
    tr->execution_time_us = t1 - t0;
    trace_add_step(tr, "complete", "Radix sort complete", 22, NULL, 0, arr, size, NULL);
    free(arr);
    return tr;
}

/* 9. Shell Sort */
ExecutionTrace* run_shell_sort(const int *input, int size) {
    ExecutionTrace *tr = trace_create("Shell Sort", "Sorting");
    if (size <= 0) return tr;
    int *arr = clone_arr(input, size);
    
    double t0 = get_time_us();
    trace_add_step(tr, "init", "Initial unsorted array", 1, NULL, 0, arr, size, NULL);
    
    for (int gap = size / 2; gap > 0; gap /= 2) {
        char desc[128];
        snprintf(desc, sizeof(desc), "Starting gap sequence with gap = %d", gap);
        trace_add_step(tr, "phase", desc, 4, NULL, 0, arr, size, NULL);
        
        for (int i = gap; i < size; i++) {
            int temp = arr[i];
            int j;
            int idx[1] = {i};
            snprintf(desc, sizeof(desc), "Considering element %d at index %d for gap-%d insertion", temp, i, gap);
            trace_add_step(tr, "select", desc, 8, idx, 1, arr, size, NULL);
            
            for (j = i; j >= gap; j -= gap) {
                int cmp[2] = {j - gap, j};
                snprintf(desc, sizeof(desc), "Comparing array[%d]=%d with key %d (gap %d)", j - gap, arr[j - gap], temp, gap);
                trace_add_step(tr, "compare", desc, 11, cmp, 2, arr, size, NULL);
                
                if (arr[j - gap] > temp) {
                    arr[j] = arr[j - gap];
                    int sh[2] = {j - gap, j};
                    trace_add_step(tr, "shift", "Shifted element across gap distance", 14, sh, 2, arr, size, NULL);
                } else {
                    break;
                }
            }
            arr[j] = temp;
            int placed[1] = {j};
            snprintf(desc, sizeof(desc), "Placed key %d at index %d", temp, j);
            trace_add_step(tr, "insert", desc, 19, placed, 1, arr, size, NULL);
        }
    }
    
    double t1 = get_time_us();
    tr->execution_time_us = t1 - t0;
    trace_add_step(tr, "complete", "Shell sort complete", 24, NULL, 0, arr, size, NULL);
    free(arr);
    return tr;
}

/* 10. Bucket Sort */
ExecutionTrace* run_bucket_sort(const int *input, int size) {
    ExecutionTrace *tr = trace_create("Bucket Sort", "Sorting");
    if (size <= 0) return tr;
    int *arr = clone_arr(input, size);
    
    double t0 = get_time_us();
    trace_add_step(tr, "init", "Initial unsorted array", 1, NULL, 0, arr, size, NULL);
    
    int max_val = arr[0], min_val = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] > max_val) max_val = arr[i];
        if (arr[i] < min_val) min_val = arr[i];
    }
    
    int bucket_count = 5;
    if (bucket_count > size) bucket_count = size;
    if (bucket_count < 2) bucket_count = 2;
    
    /* Allocate buckets */
    int **buckets = (int**)malloc(sizeof(int*) * bucket_count);
    int *bucket_sizes = (int*)calloc(bucket_count, sizeof(int));
    for (int b = 0; b < bucket_count; b++) {
        buckets[b] = (int*)malloc(sizeof(int) * size);
    }
    
    int range = max_val - min_val + 1;
    trace_add_step(tr, "phase", "Distributing elements into buckets", 8, NULL, 0, arr, size, NULL);
    
    for (int i = 0; i < size; i++) {
        int b_idx = (int)(((long long)(arr[i] - min_val) * (bucket_count - 1)) / (range > 0 ? range : 1));
        if (b_idx >= bucket_count) b_idx = bucket_count - 1;
        buckets[b_idx][bucket_sizes[b_idx]++] = arr[i];
        
        int idx[1] = {i};
        char desc[128];
        snprintf(desc, sizeof(desc), "Element %d placed in Bucket #%d", arr[i], b_idx);
        trace_add_step(tr, "bucket_distribute", desc, 14, idx, 1, arr, size, NULL);
    }
    
    /* Sort each bucket using insertion sort */
    trace_add_step(tr, "phase", "Sorting individual buckets", 18, NULL, 0, arr, size, NULL);
    int out_idx = 0;
    for (int b = 0; b < bucket_count; b++) {
        for (int i = 1; i < bucket_sizes[b]; i++) {
            int key = buckets[b][i];
            int j = i - 1;
            while (j >= 0 && buckets[b][j] > key) {
                buckets[b][j + 1] = buckets[b][j];
                j--;
            }
            buckets[b][j + 1] = key;
        }
        
        for (int i = 0; i < bucket_sizes[b]; i++) {
            arr[out_idx] = buckets[b][i];
            int idx[1] = {out_idx};
            char desc[128];
            snprintf(desc, sizeof(desc), "Collected %d from Bucket #%d to position %d", arr[out_idx], b, out_idx);
            trace_add_step(tr, "overwrite", desc, 28, idx, 1, arr, size, NULL);
            out_idx++;
        }
    }
    
    double t1 = get_time_us();
    tr->execution_time_us = t1 - t0;
    trace_add_step(tr, "complete", "Bucket sort complete", 33, NULL, 0, arr, size, NULL);
    
    for (int b = 0; b < bucket_count; b++) free(buckets[b]);
    free(buckets);
    free(bucket_sizes);
    free(arr);
    return tr;
}
