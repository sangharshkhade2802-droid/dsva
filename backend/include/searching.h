#ifndef DSVA_SEARCHING_H
#define DSVA_SEARCHING_H

#include "common.h"

ExecutionTrace* run_linear_search(const int *input, int size, int target);
ExecutionTrace* run_binary_search(const int *input, int size, int target);
ExecutionTrace* run_jump_search(const int *input, int size, int target);
ExecutionTrace* run_interpolation_search(const int *input, int size, int target);
ExecutionTrace* run_exponential_search(const int *input, int size, int target);

#endif /* DSVA_SEARCHING_H */
