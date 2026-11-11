#ifndef DSVA_LINEAR_DS_H
#define DSVA_LINEAR_DS_H

#include "common.h"

/* Array Operations */
ExecutionTrace* run_array_op(const int *initial, int size, const char *op, int index, int value);

/* Linked List Operations (Singly, Doubly, Circular) */
ExecutionTrace* run_singly_linked_list_op(const int *initial, int size, const char *op, int pos, int value);
ExecutionTrace* run_doubly_linked_list_op(const int *initial, int size, const char *op, int pos, int value);
ExecutionTrace* run_circular_linked_list_op(const int *initial, int size, const char *op, int pos, int value);

/* Stack Operations (Push, Pop, Peek) */
ExecutionTrace* run_stack_op(const int *initial, int size, const char *op, int value);

/* Queue Operations (Enqueue, Dequeue, Peek) */
ExecutionTrace* run_queue_op(const int *initial, int size, const char *op, int value);

/* Circular Queue Operations */
ExecutionTrace* run_circular_queue_op(const int *initial, int size, int capacity, const char *op, int value);

/* Deque Operations (PushFront, PushBack, PopFront, PopBack) */
ExecutionTrace* run_deque_op(const int *initial, int size, const char *op, int value);

#endif /* DSVA_LINEAR_DS_H */
