#include "graph.h"

#define INF 999999

Graph* graph_create(int num_vertices, bool is_directed) {
    if (num_vertices > MAX_VERTICES) num_vertices = MAX_VERTICES;
    Graph *g = (Graph*)malloc(sizeof(Graph));
    g->num_vertices = num_vertices;
    g->num_edges = 0;
    g->is_directed = is_directed;
    for (int i = 0; i < MAX_VERTICES; i++) {
        for (int j = 0; j < MAX_VERTICES; j++) {
            g->adj_matrix[i][j] = (i == j) ? 0 : INF;
        }
    }
    return g;
}

void graph_add_edge(Graph *g, int u, int v, int weight) {
    if (!g || u >= g->num_vertices || v >= g->num_vertices || u < 0 || v < 0) return;
    g->adj_matrix[u][v] = weight;
    g->edges[g->num_edges++] = (GraphEdge){u, v, weight};
    if (!g->is_directed) {
        g->adj_matrix[v][u] = weight;
        g->edges[g->num_edges++] = (GraphEdge){v, u, weight};
    }
}

void graph_free(Graph *g) {
    if (g) free(g);
}

/* 1. BFS */
ExecutionTrace* run_bfs(Graph *g, int start) {
    ExecutionTrace *tr = trace_create("Breadth First Search (BFS)", "Graph Algorithms");
    if (!g || g->num_vertices == 0) return tr;
    if (start < 0 || start >= g->num_vertices) start = 0;
    
    double t0 = get_time_us();
    bool visited[MAX_VERTICES] = {false};
    int queue[MAX_VERTICES];
    int front = 0, rear = 0;
    
    visited[start] = true;
    queue[rear++] = start;
    
    char aux[256];
    snprintf(aux, sizeof(aux), "{\"start\": %d, \"directed\": %s}", start, g->is_directed ? "true" : "false");
    trace_add_step(tr, "init", "BFS initialized with FIFO queue", 1, &start, 1, NULL, 0, aux);
    
    while (front < rear) {
        int u = queue[front++];
        char desc[128];
        snprintf(desc, sizeof(desc), "Dequeued vertex %d: Visiting and examining neighbors", u);
        snprintf(aux, sizeof(aux), "{\"vertex\": %d, \"queue_size\": %d}", u, rear - front);
        trace_add_step(tr, "visit_vertex", desc, 8, &u, 1, NULL, 0, aux);
        
        for (int v = 0; v < g->num_vertices; v++) {
            if (g->adj_matrix[u][v] != INF && g->adj_matrix[u][v] != 0) {
                int edge_pair[2] = {u, v};
                if (!visited[v]) {
                    visited[v] = true;
                    queue[rear++] = v;
                    snprintf(desc, sizeof(desc), "Discovered unvisited neighbor %d via edge (%d, %d). Enqueued.", v, u, v);
                    snprintf(aux, sizeof(aux), "{\"edge\": [%d, %d], \"enqueued\": %d}", u, v, v);
                    trace_add_step(tr, "enqueue_neighbor", desc, 14, edge_pair, 2, NULL, 0, aux);
                } else {
                    snprintf(desc, sizeof(desc), "Neighbor %d already visited. Skipping.", v);
                    trace_add_step(tr, "skip_neighbor", desc, 18, edge_pair, 2, NULL, 0, NULL);
                }
            }
        }
    }
    
    tr->execution_time_us = get_time_us() - t0;
    trace_add_step(tr, "complete", "BFS traversal completed", 25, NULL, 0, NULL, 0, NULL);
    return tr;
}

/* 2. DFS */
static void dfs_rec(Graph *g, int u, bool *visited, ExecutionTrace *tr) {
    visited[u] = true;
    char desc[128];
    snprintf(desc, sizeof(desc), "Visited vertex %d via DFS recursion stack", u);
    trace_add_step(tr, "visit_vertex", desc, 6, &u, 1, NULL, 0, NULL);
    
    for (int v = 0; v < g->num_vertices; v++) {
        if (g->adj_matrix[u][v] != INF && g->adj_matrix[u][v] != 0) {
            int edge_pair[2] = {u, v};
            if (!visited[v]) {
                snprintf(desc, sizeof(desc), "Exploring edge (%d -> %d)", u, v);
                trace_add_step(tr, "explore_edge", desc, 11, edge_pair, 2, NULL, 0, NULL);
                dfs_rec(g, v, visited, tr);
                snprintf(desc, sizeof(desc), "Backtracking from %d to %d", v, u);
                trace_add_step(tr, "backtrack", desc, 14, edge_pair, 2, NULL, 0, NULL);
            }
        }
    }
}

ExecutionTrace* run_dfs(Graph *g, int start) {
    ExecutionTrace *tr = trace_create("Depth First Search (DFS)", "Graph Algorithms");
    if (!g || g->num_vertices == 0) return tr;
    if (start < 0 || start >= g->num_vertices) start = 0;
    
    double t0 = get_time_us();
    bool visited[MAX_VERTICES] = {false};
    trace_add_step(tr, "init", "Starting DFS depth exploration", 1, &start, 1, NULL, 0, NULL);
    dfs_rec(g, start, visited, tr);
    tr->execution_time_us = get_time_us() - t0;
    trace_add_step(tr, "complete", "DFS traversal completed", 22, NULL, 0, NULL, 0, NULL);
    return tr;
}

/* 3. Dijkstra's Algorithm */
ExecutionTrace* run_dijkstra(Graph *g, int start, int dest) {
    ExecutionTrace *tr = trace_create("Dijkstra's Algorithm", "Graph Algorithms");
    if (!g || g->num_vertices == 0) return tr;
    if (start < 0 || start >= g->num_vertices) start = 0;
    
    double t0 = get_time_us();
    int dist[MAX_VERTICES];
    bool sptSet[MAX_VERTICES] = {false};
    int parent[MAX_VERTICES];
    
    for (int i = 0; i < g->num_vertices; i++) {
        dist[i] = INF;
        parent[i] = -1;
    }
    dist[start] = 0;
    
    char aux[256];
    snprintf(aux, sizeof(aux), "{\"start\": %d, \"dest\": %d}", start, dest);
    trace_add_step(tr, "init", "Initialized distances to INF, start vertex dist = 0", 1, &start, 1, dist, g->num_vertices, aux);
    
    for (int count = 0; count < g->num_vertices - 1; count++) {
        /* Find min distance vertex */
        int min_val = INF, u = -1;
        for (int v = 0; v < g->num_vertices; v++) {
            if (!sptSet[v] && dist[v] <= min_val) {
                min_val = dist[v];
                u = v;
            }
        }
        
        if (u == -1 || min_val == INF) break;
        sptSet[u] = true;
        
        char desc[128];
        snprintf(desc, sizeof(desc), "Selected vertex %d with minimum tentative distance %d", u, dist[u]);
        trace_add_step(tr, "select_min_dist", desc, 12, &u, 1, dist, g->num_vertices, NULL);
        
        /* Relax edges */
        for (int v = 0; v < g->num_vertices; v++) {
            int weight = g->adj_matrix[u][v];
            if (!sptSet[v] && weight != INF && dist[u] != INF && dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                parent[v] = u;
                int edge_pair[2] = {u, v};
                snprintf(desc, sizeof(desc), "RELAXATION: Updated dist[%d] = dist[%d] + %d = %d", v, u, weight, dist[v]);
                snprintf(aux, sizeof(aux), "{\"relaxed_vertex\": %d, \"new_dist\": %d}", v, dist[v]);
                trace_add_step(tr, "relax_edge", desc, 18, edge_pair, 2, dist, g->num_vertices, aux);
            }
        }
    }
    
    tr->execution_time_us = get_time_us() - t0;
    snprintf(aux, sizeof(aux), "{\"final_distance\": %d}", dist[dest >= 0 && dest < g->num_vertices ? dest : start]);
    trace_add_step(tr, "complete", "Dijkstra completed. Shortest path tree established", 25, NULL, 0, dist, g->num_vertices, aux);
    return tr;
}

/* 4. Bellman-Ford Algorithm */
ExecutionTrace* run_bellman_ford(Graph *g, int start) {
    ExecutionTrace *tr = trace_create("Bellman-Ford Algorithm", "Graph Algorithms");
    if (!g || g->num_vertices == 0) return tr;
    if (start < 0 || start >= g->num_vertices) start = 0;
    
    double t0 = get_time_us();
    int dist[MAX_VERTICES];
    for (int i = 0; i < g->num_vertices; i++) dist[i] = INF;
    dist[start] = 0;
    
    trace_add_step(tr, "init", "Bellman-Ford: Relaxing all |V|-1 passes to handle negative weights", 1, &start, 1, dist, g->num_vertices, NULL);
    
    for (int p = 1; p <= g->num_vertices - 1; p++) {
        char pass_desc[128];
        snprintf(pass_desc, sizeof(pass_desc), "--- Relaxation Pass %d of %d ---", p, g->num_vertices - 1);
        trace_add_step(tr, "pass_start", pass_desc, 6, NULL, 0, dist, g->num_vertices, NULL);
        
        bool any_relaxed = false;
        for (int i = 0; i < g->num_edges; i++) {
            int u = g->edges[i].u;
            int v = g->edges[i].v;
            int w = g->edges[i].weight;
            
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                any_relaxed = true;
                int edge_pair[2] = {u, v};
                char desc[128];
                snprintf(desc, sizeof(desc), "Relaxed edge (%d -> %d): dist[%d] updated to %d", u, v, v, dist[v]);
                trace_add_step(tr, "relax_edge", desc, 12, edge_pair, 2, dist, g->num_vertices, NULL);
            }
        }
        if (!any_relaxed) break;
    }
    
    /* Check for negative-weight cycles */
    bool has_cycle = false;
    for (int i = 0; i < g->num_edges; i++) {
        int u = g->edges[i].u;
        int v = g->edges[i].v;
        int w = g->edges[i].weight;
        if (dist[u] != INF && dist[u] + w < dist[v]) {
            has_cycle = true;
            trace_add_step(tr, "negative_cycle", "NEGATIVE CYCLE DETECTED! Graph contains negative weight cycle", 22, NULL, 0, dist, g->num_vertices, NULL);
            break;
        }
    }
    if (!has_cycle) {
        trace_add_step(tr, "complete", "No negative cycles detected. Bellman-Ford shortest paths verified", 26, NULL, 0, dist, g->num_vertices, NULL);
    }
    
    tr->execution_time_us = get_time_us() - t0;
    return tr;
}

/* 5. Floyd-Warshall Algorithm */
ExecutionTrace* run_floyd_warshall(Graph *g) {
    ExecutionTrace *tr = trace_create("Floyd-Warshall Algorithm", "Graph Algorithms");
    if (!g) return tr;
    
    double t0 = get_time_us();
    int dist[MAX_VERTICES][MAX_VERTICES];
    int V = g->num_vertices;
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) dist[i][j] = g->adj_matrix[i][j];
    }
    
    trace_add_step(tr, "init", "All-Pairs Shortest Path: Initialized distance matrix", 1, NULL, 0, NULL, 0, NULL);
    
    for (int k = 0; k < V; k++) {
        char k_desc[128];
        snprintf(k_desc, sizeof(k_desc), "Considering vertex %d as intermediate pivot", k);
        trace_add_step(tr, "pivot", k_desc, 6, &k, 1, NULL, 0, NULL);
        
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] != INF && dist[k][j] != INF && dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    char desc[128];
                    snprintf(desc, sizeof(desc), "Path (%d->%d) improved via %d: New dist = %d", i, j, k, dist[i][j]);
                    int pair[2] = {i, j};
                    trace_add_step(tr, "matrix_update", desc, 14, pair, 2, NULL, 0, NULL);
                }
            }
        }
    }
    
    tr->execution_time_us = get_time_us() - t0;
    trace_add_step(tr, "complete", "All-pairs shortest paths computed for all vertex pairs", 22, NULL, 0, NULL, 0, NULL);
    return tr;
}

/* 6. Kruskal's Algorithm (DSU) */
static int find_set(int *parent, int i) {
    if (parent[i] == i) return i;
    return parent[i] = find_set(parent, parent[i]);
}

static void union_set(int *parent, int *rank, int x, int y) {
    int rootX = find_set(parent, x);
    int rootY = find_set(parent, y);
    if (rank[rootX] < rank[rootY]) parent[rootX] = rootY;
    else if (rank[rootX] > rank[rootY]) parent[rootY] = rootX;
    else {
        parent[rootY] = rootX;
        rank[rootX]++;
    }
}

ExecutionTrace* run_kruskal(Graph *g) {
    ExecutionTrace *tr = trace_create("Kruskal's Minimum Spanning Tree", "Graph Algorithms");
    if (!g) return tr;
    
    double t0 = get_time_us();
    int V = g->num_vertices;
    int parent[MAX_VERTICES], rank[MAX_VERTICES] = {0};
    for (int i = 0; i < V; i++) parent[i] = i;
    
    trace_add_step(tr, "init", "Kruskal: Sorting edges by weight ascending", 1, NULL, 0, NULL, 0, NULL);
    
    /* Simple bubble sort on edges */
    GraphEdge edges_sorted[MAX_VERTICES * MAX_VERTICES];
    int E = g->num_edges;
    for (int i = 0; i < E; i++) edges_sorted[i] = g->edges[i];
    for (int i = 0; i < E - 1; i++) {
        for (int j = 0; j < E - i - 1; j++) {
            if (edges_sorted[j].weight > edges_sorted[j + 1].weight) {
                GraphEdge temp = edges_sorted[j];
                edges_sorted[j] = edges_sorted[j + 1];
                edges_sorted[j + 1] = temp;
            }
        }
    }
    
    int mst_edges = 0, total_weight = 0;
    for (int i = 0; i < E && mst_edges < V - 1; i++) {
        int u = edges_sorted[i].u;
        int v = edges_sorted[i].v;
        int w = edges_sorted[i].weight;
        int set_u = find_set(parent, u);
        int set_v = find_set(parent, v);
        
        int pair[2] = {u, v};
        char desc[128];
        snprintf(desc, sizeof(desc), "Examining edge (%d, %d) with weight %d", u, v, w);
        trace_add_step(tr, "examine_edge", desc, 12, pair, 2, NULL, 0, NULL);
        
        if (set_u != set_v) {
            union_set(parent, rank, set_u, set_v);
            mst_edges++;
            total_weight += w;
            snprintf(desc, sizeof(desc), "Edge (%d, %d) connects disjoint sets. ADDED to MST (Cost: %d)", u, v, w);
            trace_add_step(tr, "add_mst_edge", desc, 16, pair, 2, NULL, 0, NULL);
        } else {
            snprintf(desc, sizeof(desc), "Edge (%d, %d) forms a cycle! REJECTED from MST", u, v);
            trace_add_step(tr, "reject_cycle", desc, 20, pair, 2, NULL, 0, NULL);
        }
    }
    
    tr->execution_time_us = get_time_us() - t0;
    char aux[128];
    snprintf(aux, sizeof(aux), "{\"total_weight\": %d, \"mst_edges\": %d}", total_weight, mst_edges);
    trace_add_step(tr, "complete", "Kruskal's MST algorithm completed", 25, NULL, 0, NULL, 0, aux);
    return tr;
}

/* 7. Prim's Algorithm */
ExecutionTrace* run_prim(Graph *g, int start) {
    ExecutionTrace *tr = trace_create("Prim's Minimum Spanning Tree", "Graph Algorithms");
    if (!g || g->num_vertices == 0) return tr;
    if (start < 0 || start >= g->num_vertices) start = 0;
    
    double t0 = get_time_us();
    int V = g->num_vertices;
    int key[MAX_VERTICES], parent[MAX_VERTICES];
    bool inMST[MAX_VERTICES] = {false};
    
    for (int i = 0; i < V; i++) {
        key[i] = INF;
        parent[i] = -1;
    }
    key[start] = 0;
    
    trace_add_step(tr, "init", "Prim's: Growing MST starting from root vertex", 1, &start, 1, key, V, NULL);
    
    for (int count = 0; count < V - 1; count++) {
        int min_key = INF, u = -1;
        for (int v = 0; v < V; v++) {
            if (!inMST[v] && key[v] < min_key) {
                min_key = key[v];
                u = v;
            }
        }
        
        if (u == -1) break;
        inMST[u] = true;
        
        char desc[128];
        snprintf(desc, sizeof(desc), "Added vertex %d to MST with min cut weight %d", u, key[u]);
        trace_add_step(tr, "add_vertex_mst", desc, 12, &u, 1, key, V, NULL);
        
        for (int v = 0; v < V; v++) {
            int w = g->adj_matrix[u][v];
            if (w != INF && !inMST[v] && w < key[v]) {
                parent[v] = u;
                key[v] = w;
                int pair[2] = {u, v};
                snprintf(desc, sizeof(desc), "Updated crossing edge for %d: connected via %d (Weight: %d)", v, u, w);
                trace_add_step(tr, "update_cut", desc, 18, pair, 2, key, V, NULL);
            }
        }
    }
    
    tr->execution_time_us = get_time_us() - t0;
    trace_add_step(tr, "complete", "Prim's MST successfully grown", 24, NULL, 0, key, V, NULL);
    return tr;
}

/* 8. Topological Sort (Kahn's Algorithm) */
ExecutionTrace* run_topological_sort(Graph *g) {
    ExecutionTrace *tr = trace_create("Topological Sorting (Kahn's)", "Graph Algorithms");
    if (!g) return tr;
    
    double t0 = get_time_us();
    int V = g->num_vertices;
    int in_degree[MAX_VERTICES] = {0};
    
    for (int u = 0; u < V; u++) {
        for (int v = 0; v < V; v++) {
            if (g->adj_matrix[u][v] != INF && g->adj_matrix[u][v] != 0) {
                in_degree[v]++;
            }
        }
    }
    
    trace_add_step(tr, "init", "Topological Sort: Calculated in-degrees for all vertices", 1, NULL, 0, in_degree, V, NULL);
    
    int queue[MAX_VERTICES];
    int front = 0, rear = 0;
    for (int i = 0; i < V; i++) {
        if (in_degree[i] == 0) {
            queue[rear++] = i;
            int idx[1] = {i};
            char desc[128];
            snprintf(desc, sizeof(desc), "Vertex %d has in-degree 0: Enqueued to Kahn's queue", i);
            trace_add_step(tr, "enqueue_zero_indegree", desc, 8, idx, 1, in_degree, V, NULL);
        }
    }
    
    int topo_order[MAX_VERTICES];
    int visited_count = 0;
    while (front < rear) {
        int u = queue[front++];
        topo_order[visited_count++] = u;
        
        char desc[128];
        snprintf(desc, sizeof(desc), "Processed vertex %d: Added to topological order output", u);
        trace_add_step(tr, "topo_output", desc, 14, &u, 1, in_degree, V, NULL);
        
        for (int v = 0; v < V; v++) {
            if (g->adj_matrix[u][v] != INF && g->adj_matrix[u][v] != 0) {
                in_degree[v]--;
                if (in_degree[v] == 0) {
                    queue[rear++] = v;
                    int idx[1] = {v};
                    snprintf(desc, sizeof(desc), "In-degree of %d reached 0: Enqueued", v);
                    trace_add_step(tr, "enqueue_zero_indegree", desc, 20, idx, 1, in_degree, V, NULL);
                }
            }
        }
    }
    
    tr->execution_time_us = get_time_us() - t0;
    if (visited_count != V) {
        trace_add_step(tr, "cycle_error", "CYCLE DETECTED: Graph is not a DAG! Topological sort impossible", 26, NULL, 0, NULL, 0, NULL);
    } else {
        trace_add_step(tr, "complete", "Topological sort successfully completed", 30, NULL, 0, topo_order, visited_count, NULL);
    }
    return tr;
}
