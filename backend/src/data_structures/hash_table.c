#include "hash_table.h"

ExecutionTrace* run_hash_table_op(const int *keys, int size, int table_size, 
                                  const char *collision_mode, const char *op, int key, int val) {
    if (table_size <= 0) table_size = 10;
    ExecutionTrace *tr = trace_create("Hash Table & Collision Resolution", "Hash-Based Structures");
    
    int *table = (int*)malloc(sizeof(int) * table_size);
    for (int i = 0; i < table_size; i++) table[i] = -1; /* -1 represents empty slot */
    
    /* Populate initial keys with the selected collision resolution */
    for (int k = 0; k < size; k++) {
        int item = keys[k];
        int h = (item >= 0 ? item : -item) % table_size;
        if (strcmp(collision_mode, "linear") == 0) {
            for (int i = 0; i < table_size; i++) {
                int slot = (h + i) % table_size;
                if (table[slot] == -1) {
                    table[slot] = item;
                    break;
                }
            }
        } else if (strcmp(collision_mode, "quadratic") == 0) {
            for (int i = 0; i < table_size; i++) {
                int slot = (h + i * i) % table_size;
                if (table[slot] == -1) {
                    table[slot] = item;
                    break;
                }
            }
        } else {
            /* Separate chaining simulation in slot */
            if (table[h] == -1) table[h] = item;
        }
    }
    
    double t0 = get_time_us();
    char aux[256];
    snprintf(aux, sizeof(aux), "{\"mode\": \"%s\", \"table_size\": %d}", collision_mode, table_size);
    trace_add_step(tr, "init", "Hash Table initialized with slots [0..size-1]", 1, NULL, 0, table, table_size, aux);
    
    int primary_hash = (key >= 0 ? key : -key) % table_size;
    char desc[128];
    snprintf(desc, sizeof(desc), "Computing Hash: h(%d) = %d %% %d = %d", key, key, table_size, primary_hash);
    int p_idx[1] = {primary_hash};
    trace_add_step(tr, "hash_calc", desc, 5, p_idx, 1, table, table_size, aux);
    
    if (strcmp(op, "insert") == 0) {
        if (strcmp(collision_mode, "linear") == 0) {
            bool placed = false;
            for (int i = 0; i < table_size; i++) {
                int slot = (primary_hash + i) % table_size;
                int s_idx[1] = {slot};
                if (table[slot] == -1) {
                    table[slot] = key;
                    snprintf(desc, sizeof(desc), "Slot %d is EMPTY: Inserted key %d (Probed %d times)", slot, key, i);
                    trace_add_step(tr, "insert", desc, 12, s_idx, 1, table, table_size, aux);
                    placed = true;
                    break;
                } else {
                    snprintf(desc, sizeof(desc), "COLLISION at slot %d (Occupied by %d). Probing next slot...", slot, table[slot]);
                    trace_add_step(tr, "collision", desc, 16, s_idx, 1, table, table_size, aux);
                }
            }
            if (!placed) {
                trace_add_step(tr, "overflow", "HASH TABLE OVERFLOW: All slots occupied", 20, NULL, 0, table, table_size, aux);
            }
        } else if (strcmp(collision_mode, "quadratic") == 0) {
            bool placed = false;
            for (int i = 0; i < table_size; i++) {
                int slot = (primary_hash + i * i) % table_size;
                int s_idx[1] = {slot};
                if (table[slot] == -1) {
                    table[slot] = key;
                    snprintf(desc, sizeof(desc), "Quadratic Probing (i=%d, offset=%d): Placed key %d at slot %d", i, i * i, key, slot);
                    trace_add_step(tr, "insert", desc, 26, s_idx, 1, table, table_size, aux);
                    placed = true;
                    break;
                } else {
                    snprintf(desc, sizeof(desc), "COLLISION at slot %d. Offset: %d^2 = %d", slot, i, i * i);
                    trace_add_step(tr, "collision", desc, 30, s_idx, 1, table, table_size, aux);
                }
            }
            if (!placed) trace_add_step(tr, "overflow", "Quadratic probing failed to find free slot", 34, NULL, 0, table, table_size, aux);
        } else {
            /* Separate Chaining */
            snprintf(desc, sizeof(desc), "Separate Chaining: Appended node %d to linked list at bucket %d", key, primary_hash);
            snprintf(aux, sizeof(aux), "{\"mode\": \"chaining\", \"bucket\": %d, \"value\": %d}", primary_hash, key);
            table[primary_hash] = key;
            trace_add_step(tr, "chain_link", desc, 40, p_idx, 1, table, table_size, aux);
        }
    } else if (strcmp(op, "search") == 0) {
        bool found = false;
        for (int i = 0; i < table_size; i++) {
            int slot = (strcmp(collision_mode, "quadratic") == 0) ? (primary_hash + i * i) % table_size : (primary_hash + i) % table_size;
            int s_idx[1] = {slot};
            snprintf(desc, sizeof(desc), "Probing slot %d (Contains %s)", slot, table[slot] == -1 ? "EMPTY" : "Value");
            trace_add_step(tr, "probe", desc, 46, s_idx, 1, table, table_size, aux);
            
            if (table[slot] == key) {
                snprintf(desc, sizeof(desc), "Key %d FOUND at slot %d!", key, slot);
                trace_add_step(tr, "found", desc, 50, s_idx, 1, table, table_size, aux);
                found = true;
                break;
            } else if (table[slot] == -1) {
                break;
            }
        }
        if (!found) {
            trace_add_step(tr, "not_found", "Key NOT FOUND in hash table", 56, NULL, 0, table, table_size, aux);
        }
    }
    
    tr->execution_time_us = get_time_us() - t0;
    free(table);
    return tr;
}
