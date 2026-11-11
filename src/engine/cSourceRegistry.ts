export interface CCodeMetadata {
  id: string;
  title: string;
  category: string;
  code: string;
  sampleInput: string;
  sampleOutput: string;
  keySectionExplanations: { lines: string; title: string; explanation: string }[];
}

export const C_SOURCE_REGISTRY: Record<string, CCodeMetadata> = {
  'quick-sort': {
    id: 'quick-sort',
    title: 'Quick Sort (Lomuto Partition)',
    category: 'Sorting Algorithms',
    sampleInput: 'Input Array: [29, 10, 14, 37, 13, 42, 18, 25]',
    sampleOutput: 'Sorted Array: [10, 13, 14, 18, 25, 29, 37, 42]',
    keySectionExplanations: [
      {
        lines: '13-26',
        title: 'Partitioning Logic',
        explanation: 'Chooses the last element as pivot, traverses the array, and maintains boundary i separating elements <= pivot from elements > pivot.'
      },
      {
        lines: '30-38',
        title: 'Recursive Divide-and-Conquer',
        explanation: 'Recursively sorts the left subarray (elements smaller than pivot) and right subarray (elements greater than pivot).'
      }
    ],
    code: `/*
 * Quick Sort Implementation in C11
 * Time Complexity: O(n log n) average, O(n^2) worst case
 * Space Complexity: O(log n) auxiliary stack space
 */
#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high]; // Lomuto pivot selection
    int i = (low - 1);

    for (int j = low; j < high; j++) {
        // Compare current element with pivot
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        // pi is partitioning index, arr[pi] is now in right place
        int pi = partition(arr, low, high);

        // Separately sort elements before and after partition
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    int arr[] = {29, 10, 14, 37, 13, 42, 18, 25};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("Original array: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");

    quickSort(arr, 0, n - 1);

    printf("Sorted array:   ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`
  },

  'merge-sort': {
    id: 'merge-sort',
    title: 'Merge Sort',
    category: 'Sorting Algorithms',
    sampleInput: 'Input Array: [38, 27, 43, 3, 9, 82, 10]',
    sampleOutput: 'Sorted Array: [3, 9, 10, 27, 38, 43, 82]',
    keySectionExplanations: [
      {
        lines: '11-39',
        title: 'Two-Way Merge Step',
        explanation: 'Merges two sorted subarrays into temporary buffers L and R, comparing elements and writing back in sorted order.'
      }
    ],
    code: `/*
 * Merge Sort Implementation in C11
 * Stable divide-and-conquer algorithm with guaranteed O(n log n) runtime
 */
#include <stdio.h>
#include <stdlib.h>

void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;

    int *L = (int*)malloc(n1 * sizeof(int));
    int *R = (int*)malloc(n2 * sizeof(int));

    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i++];
        } else {
            arr[k] = R[j++];
        }
        k++;
    }

    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];

    free(L);
    free(R);
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}

int main() {
    int arr[] = {38, 27, 43, 3, 9, 82, 10};
    int n = sizeof(arr) / sizeof(arr[0]);
    mergeSort(arr, 0, n - 1);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`
  },

  'binary-search': {
    id: 'binary-search',
    title: 'Binary Search',
    category: 'Searching Algorithms',
    sampleInput: 'Sorted Array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], Target: 23',
    sampleOutput: 'Target found at index 5',
    keySectionExplanations: [
      {
        lines: '9-19',
        title: 'Midpoint Calculation and Interval Halving',
        explanation: 'Avoids integer overflow with low + (high - low) / 2 and cuts the search space in half at each iteration.'
      }
    ],
    code: `/*
 * Binary Search in C11
 * Requires pre-sorted array. Time Complexity: O(log n)
 */
#include <stdio.h>

int binarySearch(const int arr[], int size, int target) {
    int low = 0;
    int high = size - 1;

    while (low <= high) {
        // Safe midpoint calculation avoiding integer overflow
        int mid = low + (high - low) / 2;

        if (arr[mid] == target) {
            return mid; // Match found!
        }
        if (arr[mid] < target) {
            low = mid + 1; // Discard left half
        } else {
            high = mid - 1; // Discard right half
        }
    }
    return -1; // Target not found
}

int main() {
    int arr[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int n = sizeof(arr) / sizeof(arr[0]);
    int target = 23;
    int result = binarySearch(arr, n, target);

    if (result != -1) {
        printf("Element %d found at index %d\\n", target, result);
    } else {
        printf("Element %d not found\\n", target);
    }
    return 0;
}`
  },

  'singly-linked-list': {
    id: 'singly-linked-list',
    title: 'Singly Linked List',
    category: 'Linear Data Structures',
    sampleInput: 'InsertAtHead(10), InsertAtTail(20), InsertAtHead(5)',
    sampleOutput: 'List: 5 -> 10 -> 20 -> NULL',
    keySectionExplanations: [
      {
        lines: '13-22',
        title: 'Dynamic Heap Allocation',
        explanation: 'Allocates memory on the heap with malloc(sizeof(Node)) and checks for NULL to prevent memory faults.'
      },
      {
        lines: '24-34',
        title: 'Pointer Rewiring',
        explanation: 'Links newNode->next to current head and reassigns head pointer to newNode in O(1) time.'
      }
    ],
    code: `/*
 * Singly Linked List Implementation in C11
 * Demonstrating explicit pointer management and dynamic allocation
 */
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

Node* createNode(int value) {
    Node *newNode = (Node*)malloc(sizeof(Node));
    if (!newNode) {
        fprintf(stderr, "Memory allocation error\\n");
        exit(EXIT_FAILURE);
    }
    newNode->data = value;
    newNode->next = NULL;
    return newNode;
}

void insertAtHead(Node **headRef, int value) {
    Node *newNode = createNode(value);
    newNode->next = *headRef;
    *headRef = newNode;
}

void printList(const Node *head) {
    const Node *current = head;
    while (current != NULL) {
        printf("%d -> ", current->data);
        current = current->next;
    }
    printf("NULL\\n");
}

void freeList(Node *head) {
    Node *temp;
    while (head != NULL) {
        temp = head;
        head = head->next;
        free(temp);
    }
}

int main() {
    Node *head = NULL;
    insertAtHead(&head, 20);
    insertAtHead(&head, 10);
    insertAtHead(&head, 5);
    printList(head);
    freeList(head);
    return 0;
}`
  },

  'avl-tree': {
    id: 'avl-tree',
    title: 'AVL Self-Balancing Binary Search Tree',
    category: 'Non-Linear Data Structures',
    sampleInput: 'Insert: 10, 20, 30, 40, 50, 25',
    sampleOutput: 'Balanced AVL Root: 30 with Balance Factors in {-1, 0, 1}',
    keySectionExplanations: [
      {
        lines: '27-46',
        title: 'Tree Rotations (Left and Right)',
        explanation: 'Re-parents nodes in O(1) time to restore height invariant: |height(left) - height(right)| <= 1.'
      }
    ],
    code: `/*
 * AVL Tree Implementation in C11
 * Guaranteed O(log n) search, insertion, and deletion via strict rebalancing
 */
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int key;
    struct Node *left;
    struct Node *right;
    int height;
} Node;

int max(int a, int b) { return (a > b) ? a : b; }
int height(Node *N) { return (N == NULL) ? 0 : N->height; }

Node* newNode(int key) {
    Node *node = (Node*)malloc(sizeof(Node));
    node->key = key;
    node->left = NULL;
    node->right = NULL;
    node->height = 1;
    return node;
}

Node* rightRotate(Node *y) {
    Node *x = y->left;
    Node *T2 = x->right;
    x->right = y;
    y->left = T2;
    y->height = max(height(y->left), height(y->right)) + 1;
    x->height = max(height(x->left), height(x->right)) + 1;
    return x;
}

Node* leftRotate(Node *x) {
    Node *y = x->right;
    Node *T2 = y->left;
    y->left = x;
    x->right = T2;
    x->height = max(height(x->left), height(x->right)) + 1;
    y->height = max(height(y->left), height(y->right)) + 1;
    return y;
}

int getBalance(Node *N) {
    return (N == NULL) ? 0 : height(N->left) - height(N->right);
}

Node* insert(Node *node, int key) {
    if (node == NULL) return newNode(key);
    if (key < node->key) node->left = insert(node->left, key);
    else if (key > node->key) node->right = insert(node->right, key);
    else return node;

    node->height = 1 + max(height(node->left), height(node->right));
    int balance = getBalance(node);

    // Left Left Case
    if (balance > 1 && key < node->left->key) return rightRotate(node);
    // Right Right Case
    if (balance < -1 && key > node->right->key) return leftRotate(node);
    // Left Right Case
    if (balance > 1 && key > node->left->key) {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }
    // Right Left Case
    if (balance < -1 && key < node->right->key) {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }
    return node;
}

int main() {
    Node *root = NULL;
    root = insert(root, 10);
    root = insert(root, 20);
    root = insert(root, 30);
    root = insert(root, 40);
    root = insert(root, 50);
    root = insert(root, 25);
    printf("AVL Root key after self-balancing: %d\\n", root->key);
    return 0;
}`
  },

  'dijkstra': {
    id: 'dijkstra',
    title: 'Dijkstra\'s Shortest Path Algorithm',
    category: 'Graph Algorithms',
    sampleInput: 'Weighted Graph with 6 vertices, Start: 0, Destination: 5',
    sampleOutput: 'Shortest Distance: 11',
    keySectionExplanations: [
      {
        lines: '29-37',
        title: 'Edge Relaxation Step',
        explanation: 'Tests if distance to vertex v can be improved by traveling through vertex u: dist[v] = min(dist[v], dist[u] + weight).'
      }
    ],
    code: `/*
 * Dijkstra's Single-Source Shortest Path in C11
 * Time Complexity: O(V^2) matrix or O(E log V) with Priority Queue
 */
#include <stdio.h>
#include <stdbool.h>

#define V 6
#define INF 999999

int minDistance(int dist[], bool sptSet[]) {
    int min = INF, min_index = -1;
    for (int v = 0; v < V; v++) {
        if (!sptSet[v] && dist[v] <= min) {
            min = dist[v];
            min_index = v;
        }
    }
    return min_index;
}

void dijkstra(int graph[V][V], int src) {
    int dist[V];
    bool sptSet[V];

    for (int i = 0; i < V; i++) {
        dist[i] = INF;
        sptSet[i] = false;
    }
    dist[src] = 0;

    for (int count = 0; count < V - 1; count++) {
        int u = minDistance(dist, sptSet);
        if (u == -1) break;
        sptSet[u] = true;

        for (int v = 0; v < V; v++) {
            // Relaxation Condition
            if (!sptSet[v] && graph[u][v] && dist[u] != INF 
                && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }

    printf("Vertex \\t Distance from Source %d\\n", src);
    for (int i = 0; i < V; i++) {
        printf("%d \\t %d\\n", i, dist[i]);
    }
}

int main() {
    int graph[V][V] = {
        {0, 4, 2, 0, 0, 0},
        {4, 0, 1, 5, 0, 0},
        {2, 1, 0, 8, 10, 0},
        {0, 5, 8, 0, 2, 6},
        {0, 0, 10, 2, 0, 3},
        {0, 0, 0, 6, 3, 0}
    };
    dijkstra(graph, 0);
    return 0;
}`
  }
};
