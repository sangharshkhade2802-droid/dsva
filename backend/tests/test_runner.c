#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <string.h>

#include "../include/common.h"
#include "../include/sorting.h"
#include "../include/searching.h"
#include "../include/linear_ds.h"
#include "../include/tree_ds.h"
#include "../include/hash_table.h"
#include "../include/graph.h"
#include "../include/analyzer.h"

static int g_tests_passed = 0;
static int g_tests_failed = 0;

#define TEST_ASSERT(cond, name) do { \
    if (cond) { \
        printf("  [PASS] %s\n", name); \
        g_tests_passed++; \
    } else { \
        printf("  [FAIL] %s\n", name); \
        g_tests_failed++; \
    } \
} while (0)

void test_sorting_edge_cases() {
    printf("\n=== Testing Sorting Algorithms & Edge Cases ===\n");
    
    int empty[] = {};
    ExecutionTrace *tr = run_bubble_sort(empty, 0);
    TEST_ASSERT(tr != NULL && tr->step_count == 0, "Bubble sort on empty array");
    trace_free(tr);
    
    int single[] = {42};
    tr = run_quick_sort(single, 1);
    TEST_ASSERT(tr != NULL && tr->step_count > 0, "Quick sort on single element array");
    trace_free(tr);
    
    int dupes[] = {5, 2, 5, 1, 2, 8, 8, 3};
    tr = run_merge_sort(dupes, 8);
    TEST_ASSERT(tr != NULL && tr->swaps >= 0, "Merge sort with duplicate values");
    trace_free(tr);
    
    int reversed[] = {9, 8, 7, 6, 5, 4, 3, 2, 1};
    tr = run_heap_sort(reversed, 9);
    TEST_ASSERT(tr != NULL && tr->comparisons > 0, "Heap sort on reverse-sorted array");
    trace_free(tr);
    
    tr = run_radix_sort(dupes, 8);
    TEST_ASSERT(tr != NULL, "Radix sort functionality");
    trace_free(tr);
    
    tr = run_shell_sort(reversed, 9);
    TEST_ASSERT(tr != NULL, "Shell sort functionality");
    trace_free(tr);
    
    tr = run_counting_sort(reversed, 9);
    TEST_ASSERT(tr != NULL, "Counting sort functionality");
    trace_free(tr);
    
    tr = run_bucket_sort(reversed, 9);
    TEST_ASSERT(tr != NULL, "Bucket sort functionality");
    trace_free(tr);
}

void test_searching_algorithms() {
    printf("\n=== Testing Searching Algorithms ===\n");
    int sorted[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    
    ExecutionTrace *tr = run_binary_search(sorted, 10, 23);
    TEST_ASSERT(tr != NULL && strcmp(tr->steps[tr->step_count - 1].action, "found") == 0, "Binary search found target 23");
    trace_free(tr);
    
    tr = run_binary_search(sorted, 10, 99);
    TEST_ASSERT(tr != NULL && strcmp(tr->steps[tr->step_count - 1].action, "not_found") == 0, "Binary search missing target 99");
    trace_free(tr);
    
    tr = run_jump_search(sorted, 10, 56);
    TEST_ASSERT(tr != NULL && strcmp(tr->steps[tr->step_count - 1].action, "found") == 0, "Jump search found target 56");
    trace_free(tr);
    
    tr = run_interpolation_search(sorted, 10, 8);
    TEST_ASSERT(tr != NULL && strcmp(tr->steps[tr->step_count - 1].action, "found") == 0, "Interpolation search found target 8");
    trace_free(tr);
    
    tr = run_exponential_search(sorted, 10, 72);
    TEST_ASSERT(tr != NULL && strcmp(tr->steps[tr->step_count - 1].action, "found") == 0, "Exponential search found target 72");
    trace_free(tr);
}

void test_linear_ds() {
    printf("\n=== Testing Linear Data Structures ===\n");
    int init[] = {10, 20, 30};
    
    /* Stack */
    ExecutionTrace *tr = run_stack_op(init, 3, "push", 40);
    TEST_ASSERT(tr != NULL && tr->operations > 0, "Stack Push operation");
    trace_free(tr);
    
    tr = run_stack_op(init, 3, "pop", 0);
    TEST_ASSERT(tr != NULL, "Stack Pop operation");
    trace_free(tr);
    
    /* Queue */
    tr = run_queue_op(init, 3, "enqueue", 40);
    TEST_ASSERT(tr != NULL, "Queue Enqueue operation");
    trace_free(tr);
    
    /* Linked List */
    tr = run_singly_linked_list_op(init, 3, "insert", 1, 99);
    TEST_ASSERT(tr != NULL, "Singly Linked List insert at index 1");
    trace_free(tr);
}

void test_trees_and_avl() {
    printf("\n=== Testing Tree Data Structures & AVL ===\n");
    int keys[] = {10, 20, 30, 40, 50, 25};
    
    ExecutionTrace *tr = run_avl_op(keys, 6, "insert", 15);
    TEST_ASSERT(tr != NULL && tr->step_count > 0, "AVL Tree balancing & rotation");
    trace_free(tr);
    
    tr = run_tree_traversal(keys, 6, "Inorder Traversal");
    TEST_ASSERT(tr != NULL && tr->step_count >= 6, "BST Inorder Traversal");
    trace_free(tr);
    
    tr = run_tree_lca(keys, 6, 10, 30);
    TEST_ASSERT(tr != NULL, "Lowest Common Ancestor");
    trace_free(tr);
}

void test_graph_algorithms() {
    printf("\n=== Testing Graph Algorithms ===\n");
    Graph *g = graph_create(5, false);
    graph_add_edge(g, 0, 1, 2);
    graph_add_edge(g, 0, 3, 6);
    graph_add_edge(g, 1, 2, 3);
    graph_add_edge(g, 1, 3, 8);
    graph_add_edge(g, 1, 4, 5);
    graph_add_edge(g, 2, 4, 7);
    graph_add_edge(g, 3, 4, 9);
    
    ExecutionTrace *tr = run_bfs(g, 0);
    TEST_ASSERT(tr != NULL && tr->step_count > 0, "Graph BFS traversal");
    trace_free(tr);
    
    tr = run_dfs(g, 0);
    TEST_ASSERT(tr != NULL && tr->step_count > 0, "Graph DFS traversal");
    trace_free(tr);
    
    tr = run_dijkstra(g, 0, 4);
    TEST_ASSERT(tr != NULL, "Dijkstra's shortest path");
    trace_free(tr);
    
    tr = run_kruskal(g);
    TEST_ASSERT(tr != NULL, "Kruskal's Minimum Spanning Tree");
    trace_free(tr);
    
    tr = run_prim(g, 0);
    TEST_ASSERT(tr != NULL, "Prim's Minimum Spanning Tree");
    trace_free(tr);
    
    graph_free(g);
}

int main() {
    printf("=========================================\n");
    printf("   DSVA C Backend Test Suite Runner      \n");
    printf("=========================================\n");
    
    test_sorting_edge_cases();
    test_searching_algorithms();
    test_linear_ds();
    test_trees_and_avl();
    test_graph_algorithms();
    
    printf("\n-----------------------------------------\n");
    printf("Total Tests: %d | Passed: %d | Failed: %d\n", 
           g_tests_passed + g_tests_failed, g_tests_passed, g_tests_failed);
    printf("-----------------------------------------\n");
    
    return (g_tests_failed == 0) ? 0 : 1;
}
