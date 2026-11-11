CC = gcc
CFLAGS = -Wall -Wextra -std=c11 -O2 -Iinclude
LDFLAGS = 

ifeq ($(OS),Windows_NT)
    LIBS = -lws2_32
    EXT = .exe
else
    LIBS = -lm
    EXT =
endif

CORE_SRCS = src/common.c \
            src/algorithms/sorting.c \
            src/algorithms/searching.c \
            src/data_structures/linear_ds.c \
            src/data_structures/hash_table.c \
            src/trees/tree_ds.c \
            src/graph/graph.c \
            src/analyzer/analyzer.c

SERVER_SRCS = $(CORE_SRCS) src/server/router.c src/server/main.c
TEST_SRCS = $(CORE_SRCS) tests/test_runner.c

all: dsva_server$(EXT) dsva_tests$(EXT)

dsva_server$(EXT): $(SERVER_SRCS)
	$(CC) $(CFLAGS) -o $@ $^ $(LIBS)

dsva_tests$(EXT): $(TEST_SRCS)
	$(CC) $(CFLAGS) -o $@ $^ $(LIBS)

test: dsva_tests$(EXT)
	./dsva_tests$(EXT)

clean:
	rm -f dsva_server$(EXT) dsva_tests$(EXT) *.o
