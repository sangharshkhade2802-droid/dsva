# Build stage for C backend
FROM gcc:12 AS builder
WORKDIR /app
COPY . .
RUN gcc -Wall -Wextra -std=c11 -O2 -Iinclude -o dsva_server \
    src/common.c \
    src/algorithms/sorting.c \
    src/algorithms/searching.c \
    src/data_structures/linear_ds.c \
    src/data_structures/hash_table.c \
    src/trees/tree_ds.c \
    src/graph/graph.c \
    src/analyzer/analyzer.c \
    src/server/router.c \
    src/server/main.c -lm

# Runtime container
FROM debian:bullseye-slim
WORKDIR /app
COPY --from=builder /app/dsva_server /app/dsva_server
EXPOSE 8080
CMD ["/app/dsva_server", "8080"]
