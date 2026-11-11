#include "server.h"
#include <ctype.h>

static char* my_strdup(const char *s) {
    if (!s) return NULL;
    size_t len = strlen(s) + 1;
    char *dup = (char*)malloc(len);
    if (dup) memcpy(dup, s, len);
    return dup;
}

/* Simple JSON parser helpers */
static int parse_int_value(const char *json, const char *key, int default_val) {
    if (!json || !key) return default_val;
    char pattern[64];
    snprintf(pattern, sizeof(pattern), "\"%s\"", key);
    const char *pos = strstr(json, pattern);
    if (!pos) return default_val;
    pos = strchr(pos + strlen(pattern), ':');
    if (!pos) return default_val;
    while (*pos && (*pos == ':' || *pos == ' ' || *pos == '\t')) pos++;
    return atoi(pos);
}

static void parse_string_value(const char *json, const char *key, char *out, int max_len) {
    out[0] = '\0';
    if (!json || !key) return;
    char pattern[64];
    snprintf(pattern, sizeof(pattern), "\"%s\"", key);
    const char *pos = strstr(json, pattern);
    if (!pos) return;
    pos = strchr(pos + strlen(pattern), ':');
    if (!pos) return;
    pos = strchr(pos, '"');
    if (!pos) return;
    pos++;
    const char *end = strchr(pos, '"');
    if (!end) return;
    int len = (int)(end - pos);
    if (len >= max_len) len = max_len - 1;
    strncpy(out, pos, len);
    out[len] = '\0';
}

static int parse_int_array(const char *json, const char *key, int *out, int max_size) {
    if (!json || !key) return 0;
    char pattern[64];
    snprintf(pattern, sizeof(pattern), "\"%s\"", key);
    const char *pos = strstr(json, pattern);
    if (!pos) return 0;
    pos = strchr(pos, '[');
    if (!pos) return 0;
    pos++;
    
    int count = 0;
    while (*pos && *pos != ']' && count < max_size) {
        while (*pos && (isspace(*pos) || *pos == ',')) pos++;
        if (*pos == ']') break;
        if (isdigit(*pos) || *pos == '-') {
            out[count++] = atoi(pos);
            while (*pos && (isdigit(*pos) || *pos == '-')) pos++;
        } else {
            pos++;
        }
    }
    return count;
}

char* handle_api_request(const char *method, const char *path, const char *body) {
    if (strcmp(method, "OPTIONS") == 0) {
        return my_strdup("{\"status\":\"ok\"}");
    }
    
    if (strcmp(path, "/api/health") == 0) {
        return my_strdup("{\"status\":\"healthy\",\"engine\":\"DSVA C Core Engine\",\"version\":\"1.0.0\"}");
    }
    
    if (strcmp(path, "/api/algorithms") == 0) {
        return my_strdup("{\n"
            "  \"sorting\": [\"Bubble Sort\", \"Selection Sort\", \"Insertion Sort\", \"Merge Sort\", \"Quick Sort\", \"Heap Sort\", \"Counting Sort\", \"Radix Sort\", \"Shell Sort\", \"Bucket Sort\"],\n"
            "  \"searching\": [\"Linear Search\", \"Binary Search\", \"Jump Search\", \"Interpolation Search\", \"Exponential Search\"],\n"
            "  \"graph\": [\"Breadth First Search\", \"Depth First Search\", \"Dijkstra's Algorithm\", \"Bellman-Ford Algorithm\", \"Floyd-Warshall Algorithm\", \"Kruskal's Algorithm\", \"Prim's Algorithm\", \"Topological Sorting\"],\n"
            "  \"trees\": [\"Inorder Traversal\", \"Preorder Traversal\", \"Postorder Traversal\", \"Level Order Traversal\", \"Lowest Common Ancestor\", \"AVL Balancing\"]\n"
            "}");
    }
    
    if (strcmp(path, "/api/data-structures") == 0) {
        return my_strdup("{\n"
            "  \"linear\": [\"Array\", \"Singly Linked List\", \"Doubly Linked List\", \"Circular Linked List\", \"Stack\", \"Queue\", \"Circular Queue\", \"Deque\"],\n"
            "  \"non_linear\": [\"Binary Tree\", \"Binary Search Tree\", \"AVL Tree\", \"Red-Black Tree\", \"Binary Heap\", \"Min Heap\", \"Max Heap\", \"Trie\", \"B-Tree\", \"B+ Tree\"],\n"
            "  \"hash\": [\"Hash Table\", \"Hash Map\", \"Linear Probing\", \"Quadratic Probing\", \"Separate Chaining\"]\n"
            "}");
    }
    
    /* Sorting Endpoints */
    if (strstr(path, "/api/sorting/")) {
        const char *algo = path + strlen("/api/sorting/");
        int arr[128];
        int n = parse_int_array(body, "array", arr, 128);
        if (n == 0) {
            int def_arr[] = {29, 10, 14, 37, 13, 42, 18, 25};
            n = 8;
            memcpy(arr, def_arr, sizeof(def_arr));
        }
        
        ExecutionTrace *tr = NULL;
        if (strcmp(algo, "bubble-sort") == 0 || strcmp(algo, "bubble") == 0) tr = run_bubble_sort(arr, n);
        else if (strcmp(algo, "selection-sort") == 0 || strcmp(algo, "selection") == 0) tr = run_selection_sort(arr, n);
        else if (strcmp(algo, "insertion-sort") == 0 || strcmp(algo, "insertion") == 0) tr = run_insertion_sort(arr, n);
        else if (strcmp(algo, "merge-sort") == 0 || strcmp(algo, "merge") == 0) tr = run_merge_sort(arr, n);
        else if (strcmp(algo, "quick-sort") == 0 || strcmp(algo, "quick") == 0) tr = run_quick_sort(arr, n);
        else if (strcmp(algo, "heap-sort") == 0 || strcmp(algo, "heap") == 0) tr = run_heap_sort(arr, n);
        else if (strcmp(algo, "counting-sort") == 0 || strcmp(algo, "counting") == 0) tr = run_counting_sort(arr, n);
        else if (strcmp(algo, "radix-sort") == 0 || strcmp(algo, "radix") == 0) tr = run_radix_sort(arr, n);
        else if (strcmp(algo, "shell-sort") == 0 || strcmp(algo, "shell") == 0) tr = run_shell_sort(arr, n);
        else if (strcmp(algo, "bucket-sort") == 0 || strcmp(algo, "bucket") == 0) tr = run_bucket_sort(arr, n);
        else tr = run_bubble_sort(arr, n);
        
        char *json = trace_to_json(tr);
        trace_free(tr);
        return json;
    }
    
    /* Searching Endpoints */
    if (strstr(path, "/api/searching/")) {
        const char *algo = path + strlen("/api/searching/");
        int arr[128];
        int n = parse_int_array(body, "array", arr, 128);
        if (n == 0) {
            int def_arr[] = {10, 13, 14, 18, 25, 29, 37, 42, 55, 68};
            n = 10;
            memcpy(arr, def_arr, sizeof(def_arr));
        }
        int target = parse_int_value(body, "target", 29);
        
        ExecutionTrace *tr = NULL;
        if (strcmp(algo, "linear-search") == 0 || strcmp(algo, "linear") == 0) tr = run_linear_search(arr, n, target);
        else if (strcmp(algo, "binary-search") == 0 || strcmp(algo, "binary") == 0) tr = run_binary_search(arr, n, target);
        else if (strcmp(algo, "jump-search") == 0 || strcmp(algo, "jump") == 0) tr = run_jump_search(arr, n, target);
        else if (strcmp(algo, "interpolation-search") == 0 || strcmp(algo, "interpolation") == 0) tr = run_interpolation_search(arr, n, target);
        else if (strcmp(algo, "exponential-search") == 0 || strcmp(algo, "exponential") == 0) tr = run_exponential_search(arr, n, target);
        else tr = run_binary_search(arr, n, target);
        
        char *json = trace_to_json(tr);
        trace_free(tr);
        return json;
    }
    
    /* Linear Data Structures Endpoints */
    if (strstr(path, "/api/data-structures/")) {
        const char *sub = path + strlen("/api/data-structures/");
        int arr[128];
        int n = parse_int_array(body, "initial", arr, 128);
        if (n == 0) {
            int def_arr[] = {15, 30, 45, 60};
            n = 4;
            memcpy(arr, def_arr, sizeof(def_arr));
        }
        char op[32];
        parse_string_value(body, "op", op, sizeof(op));
        if (op[0] == '\0') strcpy(op, "insert");
        int val = parse_int_value(body, "value", 99);
        int pos = parse_int_value(body, "pos", 1);
        int idx = parse_int_value(body, "index", 1);
        
        ExecutionTrace *tr = NULL;
        if (strstr(sub, "array")) {
            tr = run_array_op(arr, n, op, idx, val);
        } else if (strstr(sub, "linked-list") || strstr(sub, "singly")) {
            tr = run_singly_linked_list_op(arr, n, op, pos, val);
        } else if (strstr(sub, "doubly")) {
            tr = run_doubly_linked_list_op(arr, n, op, pos, val);
        } else if (strstr(sub, "circular-list")) {
            tr = run_circular_linked_list_op(arr, n, op, pos, val);
        } else if (strstr(sub, "stack")) {
            tr = run_stack_op(arr, n, op, val);
        } else if (strstr(sub, "queue") && !strstr(sub, "circular-queue")) {
            tr = run_queue_op(arr, n, op, val);
        } else if (strstr(sub, "circular-queue")) {
            int cap = parse_int_value(body, "capacity", 8);
            tr = run_circular_queue_op(arr, n, cap, op, val);
        } else if (strstr(sub, "deque")) {
            tr = run_deque_op(arr, n, op, val);
        } else if (strstr(sub, "hash")) {
            char mode[32];
            parse_string_value(body, "mode", mode, sizeof(mode));
            if (mode[0] == '\0') strcpy(mode, "linear");
            int cap = parse_int_value(body, "capacity", 10);
            tr = run_hash_table_op(arr, n, cap, mode, op, val, val);
        } else {
            tr = run_array_op(arr, n, op, idx, val);
        }
        
        char *json = trace_to_json(tr);
        trace_free(tr);
        return json;
    }
    
    /* Graph Endpoints */
    if (strstr(path, "/api/graph/")) {
        const char *algo = path + strlen("/api/graph/");
        int V = parse_int_value(body, "vertices", 6);
        if (V <= 0 || V > MAX_VERTICES) V = 6;
        bool directed = (parse_int_value(body, "directed", 0) == 1);
        Graph *g = graph_create(V, directed);
        
        /* Default demo graph edges if none specified */
        graph_add_edge(g, 0, 1, 4);
        graph_add_edge(g, 0, 2, 2);
        graph_add_edge(g, 1, 2, 1);
        graph_add_edge(g, 1, 3, 5);
        graph_add_edge(g, 2, 3, 8);
        graph_add_edge(g, 2, 4, 10);
        graph_add_edge(g, 3, 4, 2);
        graph_add_edge(g, 3, 5, 6);
        graph_add_edge(g, 4, 5, 3);
        
        int start = parse_int_value(body, "start", 0);
        int dest = parse_int_value(body, "dest", 5);
        
        ExecutionTrace *tr = NULL;
        if (strcmp(algo, "bfs") == 0) tr = run_bfs(g, start);
        else if (strcmp(algo, "dfs") == 0) tr = run_dfs(g, start);
        else if (strcmp(algo, "dijkstra") == 0) tr = run_dijkstra(g, start, dest);
        else if (strcmp(algo, "bellman-ford") == 0) tr = run_bellman_ford(g, start);
        else if (strcmp(algo, "floyd-warshall") == 0) tr = run_floyd_warshall(g);
        else if (strcmp(algo, "kruskal") == 0) tr = run_kruskal(g);
        else if (strcmp(algo, "prim") == 0) tr = run_prim(g, start);
        else if (strcmp(algo, "topological-sort") == 0 || strcmp(algo, "topo") == 0) tr = run_topological_sort(g);
        else tr = run_bfs(g, start);
        
        char *json = trace_to_json(tr);
        trace_free(tr);
        graph_free(g);
        return json;
    }
    
    /* Tree Endpoints */
    if (strstr(path, "/api/tree/")) {
        const char *algo = path + strlen("/api/tree/");
        int keys[128];
        int n = parse_int_array(body, "keys", keys, 128);
        if (n == 0) {
            int def_keys[] = {50, 30, 70, 20, 40, 60, 80};
            n = 7;
            memcpy(keys, def_keys, sizeof(def_keys));
        }
        int val = parse_int_value(body, "value", 45);
        char op[32];
        parse_string_value(body, "op", op, sizeof(op));
        if (op[0] == '\0') strcpy(op, "insert");
        
        ExecutionTrace *tr = NULL;
        if (strcmp(algo, "bst") == 0) tr = run_bst_op(keys, n, op, val);
        else if (strcmp(algo, "avl") == 0) tr = run_avl_op(keys, n, op, val);
        else if (strcmp(algo, "red-black") == 0) tr = run_red_black_op(keys, n, op, val);
        else if (strcmp(algo, "heap") == 0) tr = run_heap_op(keys, n, "max", op, val);
        else if (strcmp(algo, "traversal") == 0) {
            char ttype[64];
            parse_string_value(body, "type", ttype, sizeof(ttype));
            if (ttype[0] == '\0') strcpy(ttype, "Inorder Traversal");
            tr = run_tree_traversal(keys, n, ttype);
        } else if (strcmp(algo, "lca") == 0) {
            int n1 = parse_int_value(body, "n1", 20);
            int n2 = parse_int_value(body, "n2", 40);
            tr = run_tree_lca(keys, n, n1, n2);
        } else {
            tr = run_bst_op(keys, n, op, val);
        }
        
        char *json = trace_to_json(tr);
        trace_free(tr);
        return json;
    }
    
    /* Analyzer Comparison Endpoint */
    if (strstr(path, "/api/analyzer/compare")) {
        const char *algos[] = {"Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort", "Quick Sort", "Heap Sort"};
        int arr[256];
        int n = parse_int_array(body, "array", arr, 256);
        if (n == 0) {
            n = 50;
            for (int i = 0; i < n; i++) arr[i] = rand() % 1000;
        }
        ComparisonResult *cr = analyzer_compare_sorting(algos, 6, arr, n);
        char *json = comparison_to_json(cr);
        comparison_free(cr);
        return json;
    }
    
    return my_strdup("{\"error\":\"Endpoint not found\"}");
}
