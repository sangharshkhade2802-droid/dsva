#ifndef DSVA_HASH_TABLE_H
#define DSVA_HASH_TABLE_H

#include "common.h"

/* Hash Table with Collision Strategies */
ExecutionTrace* run_hash_table_op(const int *keys, int size, int table_size, 
                                  const char *collision_mode, const char *op, int key, int val);

#endif /* DSVA_HASH_TABLE_H */
