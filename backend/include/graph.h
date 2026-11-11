#ifndef DSVA_GRAPH_H
#define DSVA_GRAPH_H

#include "common.h"

#define MAX_VERTICES 32

typedef struct {
    int u, v, weight;
} GraphEdge;

typedef struct {
    int num_vertices;
    int num_edges;
    int adj_matrix[MAX_VERTICES][MAX_VERTICES];
    GraphEdge edges[MAX_VERTICES * MAX_VERTICES];
    bool is_directed;
} Graph;

Graph* graph_create(int num_vertices, bool is_directed);
void graph_add_edge(Graph *g, int u, int v, int weight);
void graph_free(Graph *g);

/* Graph Algorithms */
ExecutionTrace* run_bfs(Graph *g, int start_vertex);
ExecutionTrace* run_dfs(Graph *g, int start_vertex);
ExecutionTrace* run_dijkstra(Graph *g, int start_vertex, int dest_vertex);
ExecutionTrace* run_bellman_ford(Graph *g, int start_vertex);
ExecutionTrace* run_floyd_warshall(Graph *g);
ExecutionTrace* run_kruskal(Graph *g);
ExecutionTrace* run_prim(Graph *g, int start_vertex);
ExecutionTrace* run_topological_sort(Graph *g);

#endif /* DSVA_GRAPH_H */
