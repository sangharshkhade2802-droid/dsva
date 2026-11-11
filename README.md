# Data Structure Visualizer & Analyzer (DSVA)

[![Standard](https://img.shields.io/badge/C-C11%20Standard-blue.svg)](https://en.wikipedia.org/wiki/C11_(C_standard_revision))
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript-61dafb.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/UI-Tailwind%20CSS-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Data Structure Visualizer & Analyzer (DSVA)** is a production-grade, developer-oriented computer science learning platform that transforms abstract algorithms and data structures into interactive visual experiences.

All actual data structures, algorithms, sorting routines, searching procedures, graph traversals, and computational analyses are **implemented strictly in C (C11 standard)**. JavaScript/TypeScript serves solely as the presentation, animation, and interaction layer.

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 React 18 + TypeScript UI                    │
│    Monaco Editor • Framer Motion • Recharts • Canvas/SVG    │
└──────────────────────────────▲──────────────────────────────┘
                               │
               JSON Execution Event Protocol
              (REST API / Cli / Event Trace)
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    C11 Backend Engine                       │
│   • Sockets HTTP Server (Winsock2 / POSIX)                  │
│   • Microsecond Benchmarking (QueryPerformanceCounter)      │
│   • Dynamic Heap Pointer Tracker & Event Generator          │
│   • 25 Unit-Tested Modules (Sorting, Trees, Graphs, DSU)    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Modules & Capabilities

### 1. Linear Data Structures
- **Array**: Dynamic resizing, element insertion, deletion, and index shifting.
- **Singly Linked List**: Dynamic heap memory allocation (`malloc`), pointer assignment (`next`), deletion (`free`).
- **Doubly Linked List**: Bidirectional pointer updates (`prev` & `next`).
- **Circular Linked List**: Closed-loop traversal and tail reconnection.
- **Stack (LIFO)**: Push, Pop, Peek, and Overflow/Underflow boundary checks.
- **Queue (FIFO)**: Enqueue, Dequeue, and FIFO front/rear flow.
- **Circular Queue**: Modulo arithmetic buffer indexing `(rear + 1) % capacity`.
- **Deque**: Double-ended queue operations (push_front, push_back, pop_front, pop_back).

### 2. Non-Linear Data Structures & Trees
- **Binary Search Tree (BST)**: Insert, Search, and 0/1/2-child deletion with inorder successor.
- **AVL Tree**: Strict height-balancing with **Left Rotation (RR)**, **Right Rotation (LL)**, **LR**, and **RL** rotations with real-time Balance Factor display.
- **Red-Black Tree**: Double-red violation detection, parent-uncle recoloring, and rotation checks.
- **Binary Heap**: Max-Heap & Min-Heap building, Heapify-up, and Heapify-down extraction.
- **Trie (Prefix Tree)**: Dictionary node creation, word insertion, and character branch search.
- **B-Tree / B+ Tree**: Multi-key nodes and median promotion splitting.

### 3. Hash-Based Structures
- **Hash Table**: Direct slot indexing via $h(k) = k \pmod{\text{size}}$.
- **Linear Probing**: Sequential slot offset on collision.
- **Quadratic Probing**: Secondary parabolic offset $h(k) + i^2$.
- **Separate Chaining**: Dynamic linked list chaining at each bucket slot.

### 4. Sorting Algorithms (All 10 Implemented in C)
1. **Bubble Sort** — $O(n^2)$
2. **Selection Sort** — $O(n^2)$
3. **Insertion Sort** — $O(n^2)$
4. **Merge Sort** — $O(n \log n)$ stable divide-and-conquer
5. **Quick Sort** — $O(n \log n)$ in-place Lomuto partition
6. **Heap Sort** — $O(n \log n)$ in-place binary heap
7. **Counting Sort** — $O(n + k)$ non-comparison
8. **Radix Sort** — $O(d(n+b))$ LSD pass-by-pass
9. **Shell Sort** — $O(n \log^2 n)$ gap reduction
10. **Bucket Sort** — $O(n + k)$ bucket distribution

### 5. Searching Algorithms (All 5 Implemented in C)
1. **Linear Search** — $O(n)$
2. **Binary Search** — $O(\log n)$
3. **Jump Search** — $O(\sqrt{n})$
4. **Interpolation Search** — $O(\log \log n)$
5. **Exponential Search** — $O(\log n)$

### 6. Graph Algorithms (All 8 Implemented in C)
1. **Breadth First Search (BFS)** — Queue traversal
2. **Depth First Search (DFS)** — Stack recursion & backtracking
3. **Dijkstra's Algorithm** — Greedy single-source shortest path
4. **Bellman-Ford Algorithm** — Handles negative weights & detects negative cycles
5. **Floyd-Warshall Algorithm** — All-pairs shortest path matrix
6. **Kruskal's Algorithm** — Minimum Spanning Tree via Disjoint Set Union (DSU)
7. **Prim's Algorithm** — Greedy MST cut expansion
8. **Topological Sorting** — Kahn's in-degree DAG ordering

### 7. Complexity Analyzer & Multi-Algorithm Benchmark
- Real-time side-by-side comparison on identical datasets.
- Recharts visualizations: Measured C Execution Time ($\mu$s), Comparisons count, Swaps count.
- Asymptotic Big-O growth curves: $O(1)$, $O(\log n)$, $O(n)$, $O(n \log n)$, $O(n^2)$, $O(n^3)$, $O(2^n)$, $O(n!)$.

### 8. Monaco Code Playground
- Full Monaco code editor with C syntax highlighting.
- Line highlighting synchronized to execution steps.
- Downloadable source code and template presets.
- Sandboxed execution simulation with stdout/stderr console.

### 9. Learning Syllabus & Technical Interview Preparation
- Real-world engineering applications (Linux kernel, Google Maps, Git, Databases).
- Working principles & step-by-step walkthroughs.
- Technical interview questions from top tech companies (Google, Meta, Amazon, Apple).

---

## 🛠️ Building & Running

### Option 1: Native C Backend + Vite Dev Server

1. **Compile the C Backend & Unit Tests**:
   ```bash
   cd backend
   gcc -O2 -std=c99 -Iinclude -o dsva_server.exe \
       src/common.c \
       src/algorithms/sorting.c \
       src/algorithms/searching.c \
       src/data_structures/linear_ds.c \
       src/data_structures/hash_table.c \
       src/trees/tree_ds.c \
       src/graph/graph.c \
       src/analyzer/analyzer.c \
       src/server/router.c \
       src/server/main.c -lws2_32
   ```

2. **Run the C Unit Test Suite**:
   ```bash
   gcc -O2 -std=c99 -Iinclude -o dsva_tests.exe \
       src/common.c \
       src/algorithms/sorting.c \
       src/algorithms/searching.c \
       src/data_structures/linear_ds.c \
       src/data_structures/hash_table.c \
       src/trees/tree_ds.c \
       src/graph/graph.c \
       src/analyzer/analyzer.c \
       tests/test_runner.c
   ./dsva_tests.exe
   ```

3. **Start the C HTTP Server**:
   ```bash
   ./dsva_server.exe 8080
   ```

4. **Launch the Frontend**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🧪 Automated Testing

The backend includes 25 unit tests covering edge cases:
- Empty input arrays (length 0)
- Single-element arrays
- Duplicate values
- Reverse-sorted inputs
- Target present vs target absent
- Tree balancing and rotations
- Negative edge cycles in graphs

---

## 📜 License
MIT License. Built for computer science students, educators, and software engineers.
