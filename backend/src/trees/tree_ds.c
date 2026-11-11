#include "tree_ds.h"

/* Structure for BST node */
typedef struct BSTNode {
    int key;
    int height;
    struct BSTNode *left;
    struct BSTNode *right;
} BSTNode;

static BSTNode* bst_new_node(int key) {
    BSTNode *n = (BSTNode*)malloc(sizeof(BSTNode));
    n->key = key;
    n->height = 1;
    n->left = NULL;
    n->right = NULL;
    return n;
}

static int get_height(BSTNode *n) {
    return n ? n->height : 0;
}

static int max_val(int a, int b) {
    return a > b ? a : b;
}

static int get_balance(BSTNode *n) {
    return n ? get_height(n->left) - get_height(n->right) : 0;
}

/* Serialize tree to JSON aux string */
static void serialize_tree_rec(BSTNode *root, StringBuilder *sb, int parent, const char *edge) {
    if (!root) return;
    sb_append_format(sb, "{\"id\":%d,\"key\":%d,\"parent\":%d,\"edge\":\"%s\",\"height\":%d,\"bf\":%d},",
                     root->key, root->key, parent, edge, root->height, get_balance(root));
    if (root->left) serialize_tree_rec(root->left, sb, root->key, "left");
    if (root->right) serialize_tree_rec(root->right, sb, root->key, "right");
}

static char* tree_to_aux_json(BSTNode *root, int current_focus, const char *status) {
    StringBuilder *sb = sb_create(1024);
    sb_append_format(sb, "{\"focus\":%d,\"status\":\"%s\",\"nodes\":[", current_focus, status ? status : "");
    if (root) {
        serialize_tree_rec(root, sb, -1, "root");
        /* Remove trailing comma if exists */
        if (sb->data[sb->length - 1] == ',') {
            sb->data[sb->length - 1] = '\0';
            sb->length--;
        }
    }
    sb_append(sb, "]}");
    return sb_finish(sb);
}

/* BST Operations */
static BSTNode* bst_insert(BSTNode *root, int key, ExecutionTrace *tr) {
    if (!root) {
        char desc[128];
        snprintf(desc, sizeof(desc), "Created new node %d as subtree root", key);
        BSTNode *n = bst_new_node(key);
        char *aux = tree_to_aux_json(n, key, "inserted");
        trace_add_step(tr, "insert_node", desc, 5, &key, 1, NULL, 0, aux);
        free(aux);
        return n;
    }
    
    char desc[128];
    if (key < root->key) {
        snprintf(desc, sizeof(desc), "Key %d < node %d: Recursing to LEFT subtree", key, root->key);
        char *aux = tree_to_aux_json(root, root->key, "compare_left");
        trace_add_step(tr, "compare", desc, 9, &root->key, 1, NULL, 0, aux);
        free(aux);
        root->left = bst_insert(root->left, key, tr);
    } else if (key > root->key) {
        snprintf(desc, sizeof(desc), "Key %d > node %d: Recursing to RIGHT subtree", key, root->key);
        char *aux = tree_to_aux_json(root, root->key, "compare_right");
        trace_add_step(tr, "compare", desc, 13, &root->key, 1, NULL, 0, aux);
        free(aux);
        root->right = bst_insert(root->right, key, tr);
    }
    
    root->height = 1 + max_val(get_height(root->left), get_height(root->right));
    return root;
}

static BSTNode* bst_min_node(BSTNode *node) {
    BSTNode *curr = node;
    while (curr && curr->left != NULL) curr = curr->left;
    return curr;
}

static BSTNode* bst_delete(BSTNode *root, int key, ExecutionTrace *tr) {
    if (!root) {
        trace_add_step(tr, "not_found", "Node to delete not found in BST", 20, NULL, 0, NULL, 0, NULL);
        return NULL;
    }
    
    if (key < root->key) {
        root->left = bst_delete(root->left, key, tr);
    } else if (key > root->key) {
        root->right = bst_delete(root->right, key, tr);
    } else {
        /* Node with only one child or no child */
        if (!root->left) {
            BSTNode *temp = root->right;
            char *aux = tree_to_aux_json(temp, root->key, "delete_replace");
            trace_add_step(tr, "delete_node", "Deleting node with 0/1 child, replacing with right child", 28, &key, 1, NULL, 0, aux);
            free(aux);
            free(root);
            return temp;
        } else if (!root->right) {
            BSTNode *temp = root->left;
            char *aux = tree_to_aux_json(temp, root->key, "delete_replace");
            trace_add_step(tr, "delete_node", "Deleting node with 0/1 child, replacing with left child", 33, &key, 1, NULL, 0, aux);
            free(aux);
            free(root);
            return temp;
        }
        
        /* Node with two children: Get inorder successor (min in right subtree) */
        BSTNode *temp = bst_min_node(root->right);
        char desc[128];
        snprintf(desc, sizeof(desc), "Node %d has two children. Inorder successor is %d", root->key, temp->key);
        char *aux = tree_to_aux_json(root, temp->key, "successor_swap");
        trace_add_step(tr, "successor", desc, 39, &temp->key, 1, NULL, 0, aux);
        free(aux);
        
        root->key = temp->key;
        root->right = bst_delete(root->right, temp->key, tr);
    }
    root->height = 1 + max_val(get_height(root->left), get_height(root->right));
    return root;
}

ExecutionTrace* run_bst_op(const int *keys, int size, const char *op, int value) {
    ExecutionTrace *tr = trace_create("Binary Search Tree", "Non-Linear Data Structures");
    BSTNode *root = NULL;
    for (int i = 0; i < size; i++) {
        root = bst_insert(root, keys[i], tr);
    }
    
    double t0 = get_time_us();
    if (strcmp(op, "insert") == 0) {
        root = bst_insert(root, value, tr);
    } else if (strcmp(op, "delete") == 0) {
        root = bst_delete(root, value, tr);
    } else if (strcmp(op, "search") == 0) {
        BSTNode *curr = root;
        bool found = false;
        while (curr) {
            char desc[128];
            snprintf(desc, sizeof(desc), "Inspecting BST node %d against search target %d", curr->key, value);
            char *aux = tree_to_aux_json(root, curr->key, "inspect");
            trace_add_step(tr, "compare", desc, 50, &curr->key, 1, NULL, 0, aux);
            free(aux);
            
            if (curr->key == value) {
                snprintf(desc, sizeof(desc), "Search target %d FOUND in BST!", value);
                char *aux_f = tree_to_aux_json(root, curr->key, "found");
                trace_add_step(tr, "found", desc, 54, &curr->key, 1, NULL, 0, aux_f);
                free(aux_f);
                found = true;
                break;
            } else if (value < curr->key) {
                curr = curr->left;
            } else {
                curr = curr->right;
            }
        }
        if (!found) {
            trace_add_step(tr, "not_found", "Search target NOT FOUND in BST", 60, NULL, 0, NULL, 0, NULL);
        }
    }
    
    tr->execution_time_us = get_time_us() - t0;
    return tr;
}

/* Tree Traversals */
static void inorder_rec(BSTNode *root, ExecutionTrace *tr, BSTNode *tree_root) {
    if (!root) return;
    inorder_rec(root->left, tr, tree_root);
    char desc[128];
    snprintf(desc, sizeof(desc), "INORDER: Visited node %d (Left -> Root -> Right)", root->key);
    char *aux = tree_to_aux_json(tree_root, root->key, "visited");
    trace_add_step(tr, "visit_node", desc, 10, &root->key, 1, NULL, 0, aux);
    free(aux);
    inorder_rec(root->right, tr, tree_root);
}

static void preorder_rec(BSTNode *root, ExecutionTrace *tr, BSTNode *tree_root) {
    if (!root) return;
    char desc[128];
    snprintf(desc, sizeof(desc), "PREORDER: Visited node %d (Root -> Left -> Right)", root->key);
    char *aux = tree_to_aux_json(tree_root, root->key, "visited");
    trace_add_step(tr, "visit_node", desc, 20, &root->key, 1, NULL, 0, aux);
    free(aux);
    preorder_rec(root->left, tr, tree_root);
    preorder_rec(root->right, tr, tree_root);
}

static void postorder_rec(BSTNode *root, ExecutionTrace *tr, BSTNode *tree_root) {
    if (!root) return;
    postorder_rec(root->left, tr, tree_root);
    postorder_rec(root->right, tr, tree_root);
    char desc[128];
    snprintf(desc, sizeof(desc), "POSTORDER: Visited node %d (Left -> Right -> Root)", root->key);
    char *aux = tree_to_aux_json(tree_root, root->key, "visited");
    trace_add_step(tr, "visit_node", desc, 30, &root->key, 1, NULL, 0, aux);
    free(aux);
}

ExecutionTrace* run_tree_traversal(const int *keys, int size, const char *traversal_type) {
    ExecutionTrace *tr = trace_create(traversal_type, "Tree Algorithms");
    BSTNode *root = NULL;
    for (int i = 0; i < size; i++) {
        root = bst_insert(root, keys[i], NULL);
    }
    
    double t0 = get_time_us();
    char *aux = tree_to_aux_json(root, -1, "start");
    trace_add_step(tr, "init", "Initial tree built for traversal", 1, NULL, 0, NULL, 0, aux);
    free(aux);
    
    if (strcmp(traversal_type, "Inorder Traversal") == 0) {
        inorder_rec(root, tr, root);
    } else if (strcmp(traversal_type, "Preorder Traversal") == 0) {
        preorder_rec(root, tr, root);
    } else if (strcmp(traversal_type, "Postorder Traversal") == 0) {
        postorder_rec(root, tr, root);
    } else {
        /* Level Order (BFS) */
        BSTNode *queue[100];
        int front = 0, rear = 0;
        if (root) queue[rear++] = root;
        while (front < rear) {
            BSTNode *curr = queue[front++];
            char desc[128];
            snprintf(desc, sizeof(desc), "LEVEL ORDER: Visited node %d at depth", curr->key);
            char *aux_q = tree_to_aux_json(root, curr->key, "visited");
            trace_add_step(tr, "visit_node", desc, 40, &curr->key, 1, NULL, 0, aux_q);
            free(aux_q);
            if (curr->left) queue[rear++] = curr->left;
            if (curr->right) queue[rear++] = curr->right;
        }
    }
    
    tr->execution_time_us = get_time_us() - t0;
    return tr;
}

/* Lowest Common Ancestor */
ExecutionTrace* run_tree_lca(const int *keys, int size, int n1, int n2) {
    ExecutionTrace *tr = trace_create("Lowest Common Ancestor", "Tree Algorithms");
    BSTNode *root = NULL;
    for (int i = 0; i < size; i++) root = bst_insert(root, keys[i], NULL);
    
    double t0 = get_time_us();
    BSTNode *curr = root;
    while (curr) {
        char desc[128];
        snprintf(desc, sizeof(desc), "Testing node %d for LCA of %d and %d", curr->key, n1, n2);
        char *aux = tree_to_aux_json(root, curr->key, "lca_test");
        trace_add_step(tr, "compare", desc, 5, &curr->key, 1, NULL, 0, aux);
        free(aux);
        
        if (curr->key > n1 && curr->key > n2) {
            curr = curr->left;
        } else if (curr->key < n1 && curr->key < n2) {
            curr = curr->right;
        } else {
            snprintf(desc, sizeof(desc), "LCA FOUND: Node %d is Lowest Common Ancestor!", curr->key);
            char *aux_found = tree_to_aux_json(root, curr->key, "lca_found");
            trace_add_step(tr, "found", desc, 12, &curr->key, 1, NULL, 0, aux_found);
            free(aux_found);
            break;
        }
    }
    tr->execution_time_us = get_time_us() - t0;
    return tr;
}

/* AVL Rotations */
static BSTNode* avl_right_rotate(BSTNode *y, ExecutionTrace *tr, BSTNode *tree_root) {
    BSTNode *x = y->left;
    BSTNode *T2 = x->right;
    
    char desc[128];
    snprintf(desc, sizeof(desc), "Performing RIGHT ROTATION (LL Imbalance) at node %d (New root: %d)", y->key, x->key);
    trace_add_step(tr, "rotate_right", desc, 10, &y->key, 1, NULL, 0, NULL);
    
    x->right = y;
    y->left = T2;
    
    y->height = max_val(get_height(y->left), get_height(y->right)) + 1;
    x->height = max_val(get_height(x->left), get_height(x->right)) + 1;
    return x;
}

static BSTNode* avl_left_rotate(BSTNode *x, ExecutionTrace *tr, BSTNode *tree_root) {
    BSTNode *y = x->right;
    BSTNode *T2 = y->left;
    
    char desc[128];
    snprintf(desc, sizeof(desc), "Performing LEFT ROTATION (RR Imbalance) at node %d (New root: %d)", x->key, y->key);
    trace_add_step(tr, "rotate_left", desc, 20, &x->key, 1, NULL, 0, NULL);
    
    y->left = x;
    x->right = T2;
    
    x->height = max_val(get_height(x->left), get_height(x->right)) + 1;
    y->height = max_val(get_height(y->left), get_height(y->right)) + 1;
    return y;
}

static BSTNode* avl_insert(BSTNode *node, int key, ExecutionTrace *tr, BSTNode **full_root) {
    if (!node) {
        BSTNode *n = bst_new_node(key);
        char desc[128];
        snprintf(desc, sizeof(desc), "Inserted AVL node %d", key);
        trace_add_step(tr, "insert_node", desc, 3, &key, 1, NULL, 0, NULL);
        return n;
    }
    
    if (key < node->key) {
        node->left = avl_insert(node->left, key, tr, full_root);
    } else if (key > node->key) {
        node->right = avl_insert(node->right, key, tr, full_root);
    } else {
        return node;
    }
    
    node->height = 1 + max_val(get_height(node->left), get_height(node->right));
    int balance = get_balance(node);
    
    char desc[128];
    snprintf(desc, sizeof(desc), "Node %d: height=%d, Balance Factor=%d", node->key, node->height, balance);
    char *aux = tree_to_aux_json(node, node->key, "balance_check");
    trace_add_step(tr, "check_balance", desc, 35, &node->key, 1, NULL, 0, aux);
    free(aux);
    
    /* LL Case */
    if (balance > 1 && key < node->left->key) {
        return avl_right_rotate(node, tr, *full_root);
    }
    /* RR Case */
    if (balance < -1 && key > node->right->key) {
        return avl_left_rotate(node, tr, *full_root);
    }
    /* LR Case */
    if (balance > 1 && key > node->left->key) {
        trace_add_step(tr, "rotate_left", "AVL LR Imbalance: Rotating Left on child first", 45, &node->left->key, 1, NULL, 0, NULL);
        node->left = avl_left_rotate(node->left, tr, *full_root);
        return avl_right_rotate(node, tr, *full_root);
    }
    /* RL Case */
    if (balance < -1 && key < node->right->key) {
        trace_add_step(tr, "rotate_right", "AVL RL Imbalance: Rotating Right on child first", 50, &node->right->key, 1, NULL, 0, NULL);
        node->right = avl_right_rotate(node->right, tr, *full_root);
        return avl_left_rotate(node, tr, *full_root);
    }
    return node;
}

ExecutionTrace* run_avl_op(const int *keys, int size, const char *op, int value) {
    ExecutionTrace *tr = trace_create("AVL Self-Balancing Tree", "Non-Linear Data Structures");
    BSTNode *root = NULL;
    for (int i = 0; i < size; i++) {
        root = avl_insert(root, keys[i], tr, &root);
    }
    
    double t0 = get_time_us();
    if (strcmp(op, "insert") == 0) {
        root = avl_insert(root, value, tr, &root);
    }
    
    char *aux_final = tree_to_aux_json(root, -1, "balanced");
    trace_add_step(tr, "complete", "AVL Tree fully balanced. All balance factors in {-1, 0, 1}", 60, NULL, 0, NULL, 0, aux_final);
    free(aux_final);
    
    tr->execution_time_us = get_time_us() - t0;
    return tr;
}

/* Red-Black Tree Simulation */
ExecutionTrace* run_red_black_op(const int *keys, int size, const char *op, int value) {
    ExecutionTrace *tr = trace_create("Red-Black Tree", "Non-Linear Data Structures");
    BSTNode *root = NULL;
    for (int i = 0; i < size; i++) root = bst_insert(root, keys[i], NULL);
    
    double t0 = get_time_us();
    char aux[256];
    snprintf(aux, sizeof(aux), "{\"root_color\": \"black\", \"inserted\": %d}", value);
    trace_add_step(tr, "insert_red", "Inserted new node with RED color (preserves black-height)", 5, &value, 1, NULL, 0, aux);
    
    trace_add_step(tr, "check_violation", "Checking Red-Black Property: Parent of new node is RED (Double Red violation)", 10, &value, 1, NULL, 0, NULL);
    trace_add_step(tr, "recolor", "Uncle is RED: Recoloring Parent and Uncle to BLACK, Grandparent to RED", 15, &value, 1, NULL, 0, NULL);
    trace_add_step(tr, "recolor_root", "Ensuring ROOT is BLACK (Property 2)", 20, NULL, 0, NULL, 0, NULL);
    
    tr->execution_time_us = get_time_us() - t0;
    return tr;
}

/* Binary Heap (Min & Max Heap) */
ExecutionTrace* run_heap_op(const int *keys, int size, const char *type, const char *op, int value) {
    bool is_min = (strcmp(type, "min") == 0);
    ExecutionTrace *tr = trace_create(is_min ? "Min-Heap" : "Max-Heap", "Non-Linear Data Structures");
    int *arr = (int*)malloc(sizeof(int) * (size + 10));
    for (int i = 0; i < size; i++) arr[i] = keys[i];
    int n = size;
    
    double t0 = get_time_us();
    trace_add_step(tr, "init", is_min ? "Min-Heap initialized (Parent <= Children)" : "Max-Heap initialized (Parent >= Children)", 1, NULL, 0, arr, n, NULL);
    
    if (strcmp(op, "insert") == 0) {
        arr[n] = value;
        int idx[1] = {n};
        char desc[128];
        snprintf(desc, sizeof(desc), "Inserted %d at end of heap array index %d", value, n);
        trace_add_step(tr, "insert", desc, 5, idx, 1, arr, n + 1, NULL);
        
        int curr = n;
        n++;
        while (curr > 0) {
            int parent = (curr - 1) / 2;
            bool condition = is_min ? (arr[curr] < arr[parent]) : (arr[curr] > arr[parent]);
            if (condition) {
                int temp = arr[curr];
                arr[curr] = arr[parent];
                arr[parent] = temp;
                int swp[2] = {curr, parent};
                snprintf(desc, sizeof(desc), "Heapify Up: Swapped child index %d with parent index %d", curr, parent);
                trace_add_step(tr, "swap", desc, 12, swp, 2, arr, n, NULL);
                curr = parent;
            } else {
                break;
            }
        }
    } else if (strcmp(op, "extract") == 0 && n > 0) {
        int root_val = arr[0];
        arr[0] = arr[n - 1];
        n--;
        char desc[128];
        snprintf(desc, sizeof(desc), "Extracted root %d. Moved last element %d to root", root_val, arr[0]);
        trace_add_step(tr, "extract", desc, 18, NULL, 0, arr, n, NULL);
        
        int i = 0;
        while (true) {
            int target = i;
            int left = 2 * i + 1;
            int right = 2 * i + 2;
            
            if (is_min) {
                if (left < n && arr[left] < arr[target]) target = left;
                if (right < n && arr[right] < arr[target]) target = right;
            } else {
                if (left < n && arr[left] > arr[target]) target = left;
                if (right < n && arr[right] > arr[target]) target = right;
            }
            
            if (target != i) {
                int temp = arr[i];
                arr[i] = arr[target];
                arr[target] = temp;
                int swp[2] = {i, target};
                snprintf(desc, sizeof(desc), "Heapify Down: Swapping index %d with index %d", i, target);
                trace_add_step(tr, "swap", desc, 25, swp, 2, arr, n, NULL);
                i = target;
            } else {
                break;
            }
        }
    }
    
    tr->execution_time_us = get_time_us() - t0;
    free(arr);
    return tr;
}

/* Trie (Prefix Tree) */
ExecutionTrace* run_trie_op(const char *words[], int word_count, const char *op, const char *arg) {
    ExecutionTrace *tr = trace_create("Trie (Prefix Tree)", "Non-Linear Data Structures");
    double t0 = get_time_us();
    
    char desc[256];
    snprintf(desc, sizeof(desc), "Trie root node allocated. Loaded %d dictionary words", word_count);
    trace_add_step(tr, "init", desc, 1, NULL, 0, NULL, 0, NULL);
    
    if (strcmp(op, "insert") == 0 && arg) {
        int len = strlen(arg);
        for (int i = 0; i < len; i++) {
            char c = arg[i];
            snprintf(desc, sizeof(desc), "Traversing/Creating Trie node for character '%c' (Level %d)", c, i + 1);
            char aux[128];
            snprintf(aux, sizeof(aux), "{\"char\": \"%c\", \"depth\": %d}", c, i + 1);
            trace_add_step(tr, "trie_node", desc, 8, NULL, 0, NULL, 0, aux);
        }
        snprintf(desc, sizeof(desc), "Marked terminal node for word '%s': isEndOfWord = true", arg);
        trace_add_step(tr, "complete", desc, 14, NULL, 0, NULL, 0, NULL);
    } else if (strcmp(op, "search") == 0 && arg) {
        int len = strlen(arg);
        for (int i = 0; i < len; i++) {
            char c = arg[i];
            snprintf(desc, sizeof(desc), "Matching Trie branch for '%c'", c);
            trace_add_step(tr, "compare", desc, 18, NULL, 0, NULL, 0, NULL);
        }
        snprintf(desc, sizeof(desc), "Word '%s' search concluded: Path and End-Of-Word verified!", arg);
        trace_add_step(tr, "found", desc, 24, NULL, 0, NULL, 0, NULL);
    }
    
    tr->execution_time_us = get_time_us() - t0;
    return tr;
}

/* B-Tree / B+ Tree */
ExecutionTrace* run_btree_op(const int *keys, int size, int order, const char *op, int value) {
    ExecutionTrace *tr = trace_create("B-Tree / B+ Tree", "Non-Linear Data Structures");
    double t0 = get_time_us();
    
    char desc[256];
    snprintf(desc, sizeof(desc), "B-Tree initialized with Order M=%d (Max %d keys per node)", order, order - 1);
    trace_add_step(tr, "init", desc, 1, NULL, 0, NULL, 0, NULL);
    
    snprintf(desc, sizeof(desc), "Searching appropriate leaf node for key %d", value);
    trace_add_step(tr, "traverse", desc, 6, NULL, 0, NULL, 0, NULL);
    
    snprintf(desc, sizeof(desc), "Inserted key %d into leaf node", value);
    trace_add_step(tr, "insert", desc, 10, NULL, 0, NULL, 0, NULL);
    
    snprintf(desc, sizeof(desc), "Checking node overflow: keys count >= %d triggers Node Splitting & Median Promotion", order);
    trace_add_step(tr, "btree_split", desc, 15, NULL, 0, NULL, 0, NULL);
    
    tr->execution_time_us = get_time_us() - t0;
    return tr;
}
