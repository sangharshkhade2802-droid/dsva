cmake_minimum_required(VERSION 3.10)
project(DSVA_Backend C)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

include_directories(include)

set(CORE_SOURCES
    src/common.c
    src/algorithms/sorting.c
    src/algorithms/searching.c
    src/data_structures/linear_ds.c
    src/data_structures/hash_table.c
    src/trees/tree_ds.c
    src/graph/graph.c
    src/analyzer/analyzer.c
)

# Standalone Engine / HTTP Server
add_executable(dsva_server
    ${CORE_SOURCES}
    src/server/router.c
    src/server/main.c
)

if (WIN32)
    target_link_libraries(dsva_server ws2_32)
endif()

# Unit Tests Runner
add_executable(dsva_tests
    ${CORE_SOURCES}
    tests/test_runner.c
)

enable_testing()
add_test(NAME CoreAlgorithmTests COMMAND dsva_tests)
