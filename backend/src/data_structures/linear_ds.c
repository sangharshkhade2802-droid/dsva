#include "linear_ds.h"

/* 1. Array Operations */
ExecutionTrace* run_array_op(const int *initial, int size, const char *op, int index, int value) {
    ExecutionTrace *tr = trace_create("Array Operations", "Linear Data Structures");
    int *arr = (int*)malloc(sizeof(int) * (size + 10));
    for (int i = 0; i < size; i++) arr[i] = initial[i];
    int current_size = size;
    
    double t0 = get_time_us();
    trace_add_step(tr, "init", "Initial array state", 1, NULL, 0, arr, current_size, NULL);
    
    if (strcmp(op, "insert") == 0) {
        if (index < 0) index = 0;
        if (index > current_size) index = current_size;
        
        char desc[128];
        snprintf(desc, sizeof(desc), "Preparing to insert value %d at index %d", value, index);
        trace_add_step(tr, "prepare_insert", desc, 4, &index, 1, arr, current_size, NULL);
        
        for (int i = current_size; i > index; i--) {
            arr[i] = arr[i - 1];
            int idx[2] = {i - 1, i};
            snprintf(desc, sizeof(desc), "Shifted element %d right from index %d to %d", arr[i], i - 1, i);
            trace_add_step(tr, "shift", desc, 8, idx, 2, arr, current_size + 1, NULL);
        }
        
        arr[index] = value;
        current_size++;
        snprintf(desc, sizeof(desc), "Inserted value %d at index %d", value, index);
        trace_add_step(tr, "insert", desc, 12, &index, 1, arr, current_size, NULL);
    } else if (strcmp(op, "delete") == 0) {
        if (index >= 0 && index < current_size) {
            char desc[128];
            snprintf(desc, sizeof(desc), "Removing element %d at index %d", arr[index], index);
            trace_add_step(tr, "delete", desc, 16, &index, 1, arr, current_size, NULL);
            
            for (int i = index; i < current_size - 1; i++) {
                arr[i] = arr[i + 1];
                int idx[2] = {i, i + 1};
                snprintf(desc, sizeof(desc), "Shifted element %d left from index %d to %d", arr[i], i + 1, i);
                trace_add_step(tr, "shift", desc, 20, idx, 2, arr, current_size, NULL);
            }
            current_size--;
            trace_add_step(tr, "complete", "Deletion complete. Array length reduced", 24, NULL, 0, arr, current_size, NULL);
        }
    } else if (strcmp(op, "update") == 0) {
        if (index >= 0 && index < current_size) {
            char desc[128];
            snprintf(desc, sizeof(desc), "Updating index %d: changing %d to %d", index, arr[index], value);
            arr[index] = value;
            trace_add_step(tr, "update", desc, 28, &index, 1, arr, current_size, NULL);
        }
    } else if (strcmp(op, "search") == 0) {
        bool found = false;
        for (int i = 0; i < current_size; i++) {
            int idx[1] = {i};
            char desc[128];
            snprintf(desc, sizeof(desc), "Inspecting index %d (value %d)", i, arr[i]);
            trace_add_step(tr, "traverse", desc, 32, idx, 1, arr, current_size, NULL);
            if (arr[i] == value) {
                snprintf(desc, sizeof(desc), "Element %d found at index %d", value, i);
                trace_add_step(tr, "found", desc, 35, idx, 1, arr, current_size, NULL);
                found = true;
                break;
            }
        }
        if (!found) {
            trace_add_step(tr, "not_found", "Element not found in array", 39, NULL, 0, arr, current_size, NULL);
        }
    } else if (strcmp(op, "traverse") == 0) {
        for (int i = 0; i < current_size; i++) {
            int idx[1] = {i};
            char desc[128];
            snprintf(desc, sizeof(desc), "Traversing: element at index %d is %d", i, arr[i]);
            trace_add_step(tr, "traverse", desc, 43, idx, 1, arr, current_size, NULL);
        }
    }
    
    tr->execution_time_us = get_time_us() - t0;
    free(arr);
    return tr;
}

/* 2. Singly Linked List */
ExecutionTrace* run_singly_linked_list_op(const int *initial, int size, const char *op, int pos, int value) {
    ExecutionTrace *tr = trace_create("Singly Linked List", "Linear Data Structures");
    int *arr = (int*)malloc(sizeof(int) * (size + 10));
    for (int i = 0; i < size; i++) arr[i] = initial[i];
    int current_size = size;
    
    double t0 = get_time_us();
    char aux[256];
    snprintf(aux, sizeof(aux), "{\"type\": \"singly_linked_list\", \"size\": %d}", current_size);
    trace_add_step(tr, "init", "Current Linked List state", 1, NULL, 0, arr, current_size, aux);
    
    if (strcmp(op, "insert") == 0) {
        if (pos < 0) pos = 0;
        if (pos > current_size) pos = current_size;
        
        /* 1. Animate Node creation and heap allocation */
        char desc[128];
        snprintf(desc, sizeof(desc), "Node *newNode = (Node*)malloc(sizeof(Node)); newNode->data = %d (Address 0x%04X)", value, 0xA000 + value * 16);
        snprintf(aux, sizeof(aux), "{\"action\": \"allocate_node\", \"value\": %d, \"mem\": \"0x%04X\"}", value, 0xA000 + value * 16);
        trace_add_step(tr, "allocate", desc, 4, NULL, 0, arr, current_size, aux);
        
        if (pos == 0) {
            snprintf(desc, sizeof(desc), "newNode->next = head; head = newNode (Insert at Head)");
            snprintf(aux, sizeof(aux), "{\"action\": \"link_head\", \"new_head_value\": %d}", value);
            trace_add_step(tr, "pointer_assign", desc, 8, NULL, 0, arr, current_size, aux);
            
            for (int i = current_size; i > 0; i--) arr[i] = arr[i - 1];
            arr[0] = value;
            current_size++;
        } else {
            /* Traverse to pos - 1 */
            for (int i = 0; i < pos; i++) {
                int idx[1] = {i};
                snprintf(desc, sizeof(desc), "Traversing pointer: current = current->next to position %d", i);
                trace_add_step(tr, "traverse", desc, 12, idx, 1, arr, current_size, NULL);
            }
            snprintf(desc, sizeof(desc), "newNode->next = prev->next; prev->next = newNode (Splice into list)");
            snprintf(aux, sizeof(aux), "{\"action\": \"splice\", \"insert_pos\": %d, \"value\": %d}", pos, value);
            trace_add_step(tr, "pointer_assign", desc, 16, &pos, 1, arr, current_size, aux);
            
            for (int i = current_size; i > pos; i--) arr[i] = arr[i - 1];
            arr[pos] = value;
            current_size++;
        }
        trace_add_step(tr, "complete", "Linked List insertion successful", 20, &pos, 1, arr, current_size, NULL);
    } else if (strcmp(op, "delete") == 0) {
        if (pos >= 0 && pos < current_size) {
            char desc[128];
            for (int i = 0; i < pos; i++) {
                int idx[1] = {i};
                snprintf(desc, sizeof(desc), "Advancing pointer to target node index %d", i);
                trace_add_step(tr, "traverse", desc, 24, idx, 1, arr, current_size, NULL);
            }
            snprintf(desc, sizeof(desc), "Bypassing node %d: prev->next = target->next; free(target)", arr[pos]);
            snprintf(aux, sizeof(aux), "{\"action\": \"free_node\", \"deleted_value\": %d}", arr[pos]);
            trace_add_step(tr, "free_memory", desc, 28, &pos, 1, arr, current_size, aux);
            
            for (int i = pos; i < current_size - 1; i++) arr[i] = arr[i + 1];
            current_size--;
            trace_add_step(tr, "complete", "Node deallocated and pointers updated", 32, NULL, 0, arr, current_size, NULL);
        }
    } else if (strcmp(op, "search") == 0) {
        bool found = false;
        for (int i = 0; i < current_size; i++) {
            int idx[1] = {i};
            char desc[128];
            snprintf(desc, sizeof(desc), "Inspecting current node: value=%d (Next pointer: 0x%04X)", arr[i], (i + 1 < current_size ? 0xA000 + arr[i+1]*16 : 0));
            trace_add_step(tr, "traverse", desc, 36, idx, 1, arr, current_size, NULL);
            if (arr[i] == value) {
                snprintf(desc, sizeof(desc), "Target %d matched at node index %d", value, i);
                trace_add_step(tr, "found", desc, 39, idx, 1, arr, current_size, NULL);
                found = true;
                break;
            }
        }
        if (!found) {
            trace_add_step(tr, "not_found", "Reached NULL pointer without finding target", 43, NULL, 0, arr, current_size, NULL);
        }
    }
    
    tr->execution_time_us = get_time_us() - t0;
    free(arr);
    return tr;
}

/* 3. Doubly Linked List */
ExecutionTrace* run_doubly_linked_list_op(const int *initial, int size, const char *op, int pos, int value) {
    ExecutionTrace *tr = trace_create("Doubly Linked List", "Linear Data Structures");
    int *arr = (int*)malloc(sizeof(int) * (size + 10));
    for (int i = 0; i < size; i++) arr[i] = initial[i];
    int current_size = size;
    
    double t0 = get_time_us();
    char aux[256];
    snprintf(aux, sizeof(aux), "{\"type\": \"doubly_linked_list\", \"size\": %d}", current_size);
    trace_add_step(tr, "init", "Current Doubly Linked List state (prev & next pointers)", 1, NULL, 0, arr, current_size, aux);
    
    if (strcmp(op, "insert") == 0) {
        if (pos < 0) pos = 0;
        if (pos > current_size) pos = current_size;
        
        char desc[128];
        snprintf(desc, sizeof(desc), "Allocated Doubly-Linked Node (%d): initializing newNode->prev and newNode->next", value);
        trace_add_step(tr, "allocate", desc, 4, NULL, 0, arr, current_size, NULL);
        
        snprintf(desc, sizeof(desc), "Wiring both bidirectional links: newNode->next = nextNode; nextNode->prev = newNode");
        trace_add_step(tr, "pointer_assign", desc, 8, &pos, 1, arr, current_size, NULL);
        
        for (int i = current_size; i > pos; i--) arr[i] = arr[i - 1];
        arr[pos] = value;
        current_size++;
        trace_add_step(tr, "complete", "Bidirectional links established", 12, &pos, 1, arr, current_size, NULL);
    } else if (strcmp(op, "delete") == 0) {
        if (pos >= 0 && pos < current_size) {
            char desc[128];
            snprintf(desc, sizeof(desc), "Rewiring neighboring links: target->prev->next = target->next; target->next->prev = target->prev");
            trace_add_step(tr, "pointer_assign", desc, 16, &pos, 1, arr, current_size, NULL);
            for (int i = pos; i < current_size - 1; i++) arr[i] = arr[i + 1];
            current_size--;
            trace_add_step(tr, "complete", "Deleted doubly linked node safely", 20, NULL, 0, arr, current_size, NULL);
        }
    }
    
    tr->execution_time_us = get_time_us() - t0;
    free(arr);
    return tr;
}

/* 4. Circular Linked List */
ExecutionTrace* run_circular_linked_list_op(const int *initial, int size, const char *op, int pos, int value) {
    ExecutionTrace *tr = trace_create("Circular Linked List", "Linear Data Structures");
    int *arr = (int*)malloc(sizeof(int) * (size + 10));
    for (int i = 0; i < size; i++) arr[i] = initial[i];
    int current_size = size;
    
    double t0 = get_time_us();
    char aux[256];
    snprintf(aux, sizeof(aux), "{\"type\": \"circular_linked_list\", \"tail_points_to\": 0}");
    trace_add_step(tr, "init", "Circular Linked List: Tail node points back to Head node", 1, NULL, 0, arr, current_size, aux);
    
    if (strcmp(op, "insert") == 0) {
        for (int i = current_size; i > 0; i--) arr[i] = arr[i - 1];
        arr[0] = value;
        current_size++;
        trace_add_step(tr, "pointer_assign", "Inserted new node and reconnected tail->next = newHead", 6, NULL, 0, arr, current_size, aux);
    } else if (strcmp(op, "traverse") == 0) {
        for (int i = 0; i < current_size; i++) {
            int idx[1] = {i};
            char desc[128];
            snprintf(desc, sizeof(desc), "Visiting node %d -> next points to %s", arr[i], (i + 1 == current_size ? "HEAD (Loop closed)" : "Next Node"));
            trace_add_step(tr, "traverse", desc, 12, idx, 1, arr, current_size, NULL);
        }
    }
    
    tr->execution_time_us = get_time_us() - t0;
    free(arr);
    return tr;
}

/* 5. Stack Operations */
ExecutionTrace* run_stack_op(const int *initial, int size, const char *op, int value) {
    ExecutionTrace *tr = trace_create("Stack (LIFO)", "Linear Data Structures");
    int *arr = (int*)malloc(sizeof(int) * (size + 10));
    for (int i = 0; i < size; i++) arr[i] = initial[i];
    int top = size - 1;
    
    double t0 = get_time_us();
    char aux[128];
    snprintf(aux, sizeof(aux), "{\"top\": %d, \"capacity\": %d}", top, 10);
    trace_add_step(tr, "init", "Stack initialized (LIFO: Last-In, First-Out)", 1, NULL, 0, arr, top + 1, aux);
    
    if (strcmp(op, "push") == 0) {
        if (top >= 9) {
            trace_add_step(tr, "overflow", "STACK OVERFLOW: Stack capacity limit reached", 4, NULL, 0, arr, top + 1, aux);
        } else {
            top++;
            arr[top] = value;
            int idx[1] = {top};
            char desc[128];
            snprintf(desc, sizeof(desc), "PUSH(%d): Incremented top to %d and stored %d", value, top, value);
            snprintf(aux, sizeof(aux), "{\"top\": %d, \"pushed\": %d}", top, value);
            trace_add_step(tr, "push", desc, 8, idx, 1, arr, top + 1, aux);
        }
    } else if (strcmp(op, "pop") == 0) {
        if (top < 0) {
            trace_add_step(tr, "underflow", "STACK UNDERFLOW: Cannot pop from empty stack", 12, NULL, 0, arr, 0, aux);
        } else {
            int popped = arr[top];
            int idx[1] = {top};
            char desc[128];
            snprintf(desc, sizeof(desc), "POP(): Removed element %d from top. Decrementing top index", popped);
            snprintf(aux, sizeof(aux), "{\"top\": %d, \"popped\": %d}", top - 1, popped);
            trace_add_step(tr, "pop", desc, 16, idx, 1, arr, top + 1, aux);
            top--;
            trace_add_step(tr, "complete", "Top element popped", 19, NULL, 0, arr, top + 1, aux);
        }
    } else if (strcmp(op, "peek") == 0) {
        if (top < 0) {
            trace_add_step(tr, "peek_empty", "Stack is empty, peek returns NULL", 22, NULL, 0, arr, 0, aux);
        } else {
            int idx[1] = {top};
            char desc[128];
            snprintf(desc, sizeof(desc), "PEEK(): Top element is %d at index %d", arr[top], top);
            trace_add_step(tr, "peek", desc, 26, idx, 1, arr, top + 1, aux);
        }
    }
    
    tr->execution_time_us = get_time_us() - t0;
    free(arr);
    return tr;
}

/* 6. Queue Operations */
ExecutionTrace* run_queue_op(const int *initial, int size, const char *op, int value) {
    ExecutionTrace *tr = trace_create("Queue (FIFO)", "Linear Data Structures");
    int *arr = (int*)malloc(sizeof(int) * (size + 10));
    for (int i = 0; i < size; i++) arr[i] = initial[i];
    int current_size = size;
    
    double t0 = get_time_us();
    char aux[128];
    snprintf(aux, sizeof(aux), "{\"front\": 0, \"rear\": %d}", current_size - 1);
    trace_add_step(tr, "init", "Queue initialized (FIFO: First-In, First-Out)", 1, NULL, 0, arr, current_size, aux);
    
    if (strcmp(op, "enqueue") == 0) {
        arr[current_size] = value;
        int idx[1] = {current_size};
        char desc[128];
        snprintf(desc, sizeof(desc), "ENQUEUE(%d): Appended %d at REAR position index %d", value, value, current_size);
        current_size++;
        snprintf(aux, sizeof(aux), "{\"front\": 0, \"rear\": %d, \"enqueued\": %d}", current_size - 1, value);
        trace_add_step(tr, "enqueue", desc, 5, idx, 1, arr, current_size, aux);
    } else if (strcmp(op, "dequeue") == 0) {
        if (current_size <= 0) {
            trace_add_step(tr, "underflow", "QUEUE UNDERFLOW: Queue is empty", 9, NULL, 0, arr, 0, aux);
        } else {
            int dequeued = arr[0];
            int idx[1] = {0};
            char desc[128];
            snprintf(desc, sizeof(desc), "DEQUEUE(): Extracted %d from FRONT of queue", dequeued);
            trace_add_step(tr, "dequeue", desc, 13, idx, 1, arr, current_size, aux);
            for (int i = 0; i < current_size - 1; i++) arr[i] = arr[i + 1];
            current_size--;
            snprintf(aux, sizeof(aux), "{\"front\": 0, \"rear\": %d, \"dequeued\": %d}", current_size - 1, dequeued);
            trace_add_step(tr, "shift", "Shifted remaining elements forward", 17, NULL, 0, arr, current_size, aux);
        }
    }
    
    tr->execution_time_us = get_time_us() - t0;
    free(arr);
    return tr;
}

/* 7. Circular Queue Operations */
ExecutionTrace* run_circular_queue_op(const int *initial, int size, int capacity, const char *op, int value) {
    ExecutionTrace *tr = trace_create("Circular Queue", "Linear Data Structures");
    if (capacity <= 0) capacity = 8;
    int *arr = (int*)malloc(sizeof(int) * capacity);
    for (int i = 0; i < capacity; i++) arr[i] = (i < size) ? initial[i] : 0;
    
    int front = 0;
    int rear = (size > 0) ? (size - 1) % capacity : -1;
    
    double t0 = get_time_us();
    char aux[128];
    snprintf(aux, sizeof(aux), "{\"front\": %d, \"rear\": %d, \"capacity\": %d, \"size\": %d}", front, rear, capacity, size);
    trace_add_step(tr, "init", "Circular Queue: rear wraps around to 0 via modulo arithmetic", 1, NULL, 0, arr, capacity, aux);
    
    if (strcmp(op, "enqueue") == 0) {
        if (size >= capacity) {
            trace_add_step(tr, "overflow", "CIRCULAR QUEUE FULL: (rear + 1) % cap == front", 5, NULL, 0, arr, capacity, aux);
        } else {
            rear = (rear + 1) % capacity;
            arr[rear] = value;
            size++;
            char desc[128];
            snprintf(desc, sizeof(desc), "ENQUEUE(%d): rear = (%d + 1) %% %d = %d", value, (rear - 1 + capacity) % capacity, capacity, rear);
            snprintf(aux, sizeof(aux), "{\"front\": %d, \"rear\": %d, \"capacity\": %d, \"size\": %d}", front, rear, capacity, size);
            trace_add_step(tr, "enqueue", desc, 9, &rear, 1, arr, capacity, aux);
        }
    } else if (strcmp(op, "dequeue") == 0) {
        if (size <= 0) {
            trace_add_step(tr, "underflow", "CIRCULAR QUEUE EMPTY", 13, NULL, 0, arr, capacity, aux);
        } else {
            int val = arr[front];
            arr[front] = 0;
            char desc[128];
            snprintf(desc, sizeof(desc), "DEQUEUE(): Removed %d at front index %d", val, front);
            trace_add_step(tr, "dequeue", desc, 17, &front, 1, arr, capacity, aux);
            front = (front + 1) % capacity;
            size--;
            snprintf(aux, sizeof(aux), "{\"front\": %d, \"rear\": %d, \"capacity\": %d, \"size\": %d}", front, rear, capacity, size);
            trace_add_step(tr, "advance_front", "Front pointer advanced circularly", 21, &front, 1, arr, capacity, aux);
        }
    }
    
    tr->execution_time_us = get_time_us() - t0;
    free(arr);
    return tr;
}

/* 8. Deque (Double-Ended Queue) */
ExecutionTrace* run_deque_op(const int *initial, int size, const char *op, int value) {
    ExecutionTrace *tr = trace_create("Deque (Double-Ended Queue)", "Linear Data Structures");
    int *arr = (int*)malloc(sizeof(int) * (size + 10));
    for (int i = 0; i < size; i++) arr[i] = initial[i];
    int current_size = size;
    
    double t0 = get_time_us();
    char aux[128];
    snprintf(aux, sizeof(aux), "{\"front\": 0, \"rear\": %d, \"size\": %d}", (current_size > 0 ? current_size - 1 : 0), current_size);
    trace_add_step(tr, "init", "Deque initialized: Supports insertion & deletion at both ends", 1, NULL, 0, arr, current_size, aux);
    
    if (strcmp(op, "push_front") == 0) {
        for (int i = current_size; i > 0; i--) arr[i] = arr[i - 1];
        arr[0] = value;
        current_size++;
        int idx[1] = {0};
        trace_add_step(tr, "push_front", "Inserted element at FRONT of Deque", 6, idx, 1, arr, current_size, aux);
    } else if (strcmp(op, "push_back") == 0) {
        arr[current_size] = value;
        int idx[1] = {current_size};
        current_size++;
        trace_add_step(tr, "push_back", "Inserted element at REAR of Deque", 10, idx, 1, arr, current_size, aux);
    } else if (strcmp(op, "pop_front") == 0) {
        if (current_size > 0) {
            int idx[1] = {0};
            trace_add_step(tr, "pop_front", "Popped element from FRONT of Deque", 14, idx, 1, arr, current_size, aux);
            for (int i = 0; i < current_size - 1; i++) arr[i] = arr[i + 1];
            current_size--;
        }
    } else if (strcmp(op, "pop_back") == 0) {
        if (current_size > 0) {
            int idx[1] = {current_size - 1};
            trace_add_step(tr, "pop_back", "Popped element from REAR of Deque", 18, idx, 1, arr, current_size, aux);
            current_size--;
        }
    }
    
    tr->execution_time_us = get_time_us() - t0;
    free(arr);
    return tr;
}
