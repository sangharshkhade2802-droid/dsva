#ifndef DSVA_TREE_DS_H
#define DSVA_TREE_DS_H

#include "common.h"

/* BST & Binary Tree */
ExecutionTrace* run_bst_op(const int *keys, int size, const char *op, int value);
ExecutionTrace* run_tree_traversal(const int *keys, int size, const char *traversal_type);
ExecutionTrace* run_tree_lca(const int *keys, int size, int n1, int n2);

/* AVL Tree with Rotations */
ExecutionTrace* run_avl_op(const int *keys, int size, const char *op, int value);

/* Red-Black Tree */
ExecutionTrace* run_red_black_op(const int *keys, int size, const char *op, int value);

/* Binary Heap (Min & Max) */
ExecutionTrace* run_heap_op(const int *keys, int size, const char *type, const char *op, int value);

/* Trie (Prefix Tree) */
ExecutionTrace* run_trie_op(const char *words[], int word_count, const char *op, const char *arg);

/* B-Tree / B+ Tree */
ExecutionTrace* run_btree_op(const int *keys, int size, int order, const char *op, int value);

#endif /* DSVA_TREE_DS_H */
