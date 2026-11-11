#ifndef DSVA_SERVER_H
#define DSVA_SERVER_H

#include "common.h"
#include "sorting.h"
#include "searching.h"
#include "linear_ds.h"
#include "tree_ds.h"
#include "hash_table.h"
#include "graph.h"
#include "analyzer.h"

int start_http_server(int port);
char* handle_api_request(const char *method, const char *path, const char *body);

#endif /* DSVA_SERVER_H */
