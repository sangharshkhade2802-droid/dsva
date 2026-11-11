import { LearningTopic } from './types';

export const LEARNING_TOPICS: LearningTopic[] = [
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'Sorting Algorithms',
    difficulty: 'Intermediate',
    tagline: 'High-performance in-place divide-and-conquer sorting algorithm',
    introduction: 'Quick Sort was developed by British computer scientist Tony Hoare in 1959. It operates by selecting a "pivot" element from the array and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively.',
    realWorldApplications: [
      'Standard library sorting functions: C qsort(), C++ std::sort (Introsort), Java Arrays.sort() for primitives (Dual-Pivot Quicksort).',
      'Operating systems kernel process scheduling and file system indexing.',
      'Numerical computation and graphics rendering pipelines for polygon z-ordering.'
    ],
    workingPrinciple: 'Quick Sort relies on partitioning around a chosen pivot. In Lomuto partitioning, a pivot is selected (often the rightmost element). A pointer keeps track of the boundary of smaller elements. Each element smaller than the pivot is swapped into this lower region. Finally, the pivot is swapped into its exact sorted position.',
    stepByStepExplanation: [
      'Choose a pivot element from the array.',
      'Initialize boundary index i = low - 1.',
      'Iterate through the array from low to high - 1: if array[j] < pivot, increment i and swap array[i] with array[j].',
      'Swap array[i + 1] with array[high] to place the pivot at its permanent sorted position.',
      'Recursively apply Quick Sort to subarray before index i + 1 and subarray after index i + 1.'
    ],
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(log n) auxiliary stack space',
    advantages: [
      'Very fast in practice with low constant factors and excellent cache locality.',
      'Sorts in-place without requiring extra arrays (unlike Merge Sort).',
      'Tail-call optimizable and parallelizable.'
    ],
    disadvantages: [
      'Worst-case time complexity is O(n²) when the pivot chosen is consistently the extreme element (mitigated by 3-way partitioning or randomized pivot).',
      'Not a stable sort by default.'
    ],
    interviewQuestions: [
      {
        question: 'How can you guarantee worst-case O(n log n) runtime for Quick Sort?',
        difficulty: 'Medium',
        company: 'Google / Meta',
        hint: 'Consider hybrid approaches like Introsort or Median-of-Medians.',
        solutionExplanation: 'Introsort begins with Quick Sort and switches to Heap Sort when the recursion depth exceeds 2 * log(n), preventing O(n²) degradation while maintaining O(1) extra space.'
      },
      {
        question: 'Explain Dutch National Flag 3-way partitioning in Quick Sort.',
        difficulty: 'Hard',
        company: 'Amazon / Microsoft',
        hint: 'Partition elements into three zones: < pivot, == pivot, and > pivot.',
        solutionExplanation: 'When duplicates are common, Lomuto partition performs poorly. 3-way partitioning handles duplicate keys in linear time O(n) by grouping all equal keys together.'
      }
    ],
    cSourceCode: `// See C_SOURCE_REGISTRY['quick-sort']`
  },

  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'Sorting Algorithms',
    difficulty: 'Intermediate',
    tagline: 'Guaranteed O(n log n) stable divide-and-conquer sorting',
    introduction: 'Invented by John von Neumann in 1945, Merge Sort recursively divides the unsorted list into n sublists until each sublist contains 1 element, then repeatedly merges sublists to produce new sorted sublists until there is only 1 sublist remaining.',
    realWorldApplications: [
      'Sorting linked lists where random access is impossible and O(1) pointer updates allow in-place merging.',
      'External sorting for databases and massive datasets that do not fit in physical RAM (Tape / Disk sort).',
      'E-commerce order books requiring stable multi-column sorting.'
    ],
    workingPrinciple: 'Merge Sort divides the array into two halves at mid = low + (high - low) / 2, sorts each half recursively, and combines the two sorted halves into a single sorted array by comparing front elements.',
    stepByStepExplanation: [
      'Find the middle index mid of the array.',
      'Divide the array into left subarray [low..mid] and right subarray [mid+1..high].',
      'Recursively sort left and right subarrays until base case (length <= 1) is reached.',
      'Merge the sorted subarrays by maintaining two pointers and copying the smaller element into the target array.'
    ],
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(n) auxiliary memory',
    advantages: [
      'Guaranteed O(n log n) performance regardless of initial array ordering.',
      'Stable sorting algorithm (preserves relative order of duplicate items).',
      'Ideal for sequential access storage media and linked data structures.'
    ],
    disadvantages: [
      'Requires O(n) additional memory buffer for merging array elements.',
      'Slower than Quick Sort on small arrays due to memory allocations.'
    ],
    interviewQuestions: [
      {
        question: 'Why is Merge Sort preferred for sorting Singly Linked Lists over Quick Sort?',
        difficulty: 'Medium',
        company: 'Apple / Bloomberg',
        hint: 'Consider the cost of random access in linked lists and pointer updates.',
        solutionExplanation: 'In linked lists, nodes can be spliced and merged by rewiring next pointers without allocating extra memory, yielding O(1) auxiliary space! Quick Sort suffers on linked lists because finding the median or partitioning requires linear scans.'
      }
    ],
    cSourceCode: `// See C_SOURCE_REGISTRY['merge-sort']`
  },

  {
    id: 'avl-tree',
    name: 'AVL Tree',
    category: 'Non-Linear Data Structures',
    difficulty: 'Advanced',
    tagline: 'Strictly height-balanced binary search tree with logarithmic guarantees',
    introduction: 'Named after inventors Adelson-Velsky and Landis (1962), the AVL tree was the first self-balancing binary search tree. In an AVL tree, the heights of the two child subtrees of any node differ by at most one; if at any time they differ by more than one, rebalancing is done to restore this property.',
    realWorldApplications: [
      'In-memory databases and file indexes where lookup frequency vastly exceeds insertion/deletion frequency.',
      'Virtual memory manager pagination and page-table address translations.',
      'Network routing tables requiring deterministic microsecond IP prefix match.'
    ],
    workingPrinciple: 'Every node maintains a Balance Factor = height(left) - height(right). When an insertion or deletion results in a balance factor of -2 or +2, rotations are applied: Left-Left (Right Rotate), Right-Right (Left Rotate), Left-Right (Rotate Left on child, then Right on root), or Right-Left (Rotate Right on child, then Left on root).',
    stepByStepExplanation: [
      'Perform standard BST insertion of key.',
      'Update the height of the current ancestor node.',
      'Calculate Balance Factor: height(left) - height(right).',
      'If balance > 1 and key < left->key: Perform Right Rotation (LL).',
      'If balance < -1 and key > right->key: Perform Left Rotation (RR).',
      'If balance > 1 and key > left->key: Perform Left Rotation on left child, then Right Rotation on node (LR).',
      'If balance < -1 and key < right->key: Perform Right Rotation on right child, then Left Rotation on node (RL).'
    ],
    timeComplexity: {
      best: 'O(log n)',
      average: 'O(log n)',
      worst: 'O(log n)'
    },
    spaceComplexity: 'O(n) node storage + O(log n) stack depth',
    advantages: [
      'Guaranteed strictly balanced tree: maximum height is ~1.44 * log2(n).',
      'Faster lookups than Red-Black trees because it is more strictly balanced.'
    ],
    disadvantages: [
      'More frequent rotations during insertions and deletions compared to Red-Black trees.',
      'Each node must store height or balance factor (extra metadata).'
    ],
    interviewQuestions: [
      {
        question: 'Compare AVL Tree and Red-Black Tree. When should each be chosen?',
        difficulty: 'Medium',
        company: 'Google / Microsoft',
        hint: 'Think about the ratio of lookups vs insertions/deletions.',
        solutionExplanation: 'AVL trees are more strictly balanced, making search operations faster. Use AVL trees when lookups are predominant (e.g. dictionaries). Red-Black trees require fewer rotations on writes, making them preferable when insertion and deletion frequencies are high (e.g. C++ std::map, Java TreeMap).'
      }
    ],
    cSourceCode: `// See C_SOURCE_REGISTRY['avl-tree']`
  },

  {
    id: 'dijkstra',
    name: 'Dijkstra\'s Algorithm',
    category: 'Graph Algorithms',
    difficulty: 'Intermediate',
    tagline: 'Greedy single-source shortest path algorithm for non-negative weighted graphs',
    introduction: 'Conceived by computer scientist Edsger W. Dijkstra in 1956, this algorithm finds the shortest paths between nodes in a weighted graph with non-negative edge weights.',
    realWorldApplications: [
      'GPS and navigation software (Google Maps, Waze, OpenStreetMap) for turn-by-turn route calculation.',
      'IP routing protocols like OSPF (Open Shortest Path First) and IS-IS.',
      'Robotics motion planning and telecommunications bandwidth reservation.'
    ],
    workingPrinciple: 'Maintains a set of visited vertices and a distance array. At each iteration, it greedily selects the unvisited vertex with the minimum tentative distance, marks it visited, and relaxes all outgoing edges to adjacent unvisited vertices.',
    stepByStepExplanation: [
      'Initialize dist[v] = INF for all vertices, dist[source] = 0.',
      'Insert all vertices into a Priority Queue keyed by dist[v].',
      'While the priority queue is not empty, extract vertex u with smallest dist[u].',
      'For each neighbor v of u with edge weight w: if dist[u] + w < dist[v], update dist[v] = dist[u] + w and update parent pointer.',
      'Repeat until all vertices have been processed or destination is reached.'
    ],
    timeComplexity: {
      best: 'O(E + V log V) with Fibonacci Heap, O((V + E) log V) with Binary Heap',
      average: 'O((V + E) log V)',
      worst: 'O(V²)'
    },
    spaceComplexity: 'O(V) for distance table and priority queue',
    advantages: [
      'Optimal shortest path solution for graphs with non-negative edge weights.',
      'Greedy choice property ensures correctness without revisiting nodes.'
    ],
    disadvantages: [
      'Cannot handle negative edge weights (requires Bellman-Ford algorithm).',
      'Can explore unnecessary branches without spatial heuristics (unlike A* Search).'
    ],
    interviewQuestions: [
      {
        question: 'Why does Dijkstra fail with negative edge weights?',
        difficulty: 'Medium',
        company: 'Amazon / Uber',
        hint: 'Think about greedy finality once a node is marked visited.',
        solutionExplanation: 'Dijkstra assumes that once a node is extracted from the priority queue, its shortest path is permanently finalized. A negative edge encountered later could lower the distance to an already-visited vertex, invalidating this assumption.'
      }
    ],
    cSourceCode: `// See C_SOURCE_REGISTRY['dijkstra']`
  },

  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'Searching Algorithms',
    difficulty: 'Beginner',
    tagline: 'Logarithmic search on monotonic sorted collections',
    introduction: 'Binary search is an efficient search algorithm that finds the position of a target value within a sorted array. It compares the target value to the middle element of the array; if they are not equal, the half in which the target cannot lie is eliminated and the search continues on the remaining half.',
    realWorldApplications: [
      'Database B-Tree indexing leaf page lookups.',
      'Git bisect tool for identifying the commit that introduced a bug via automated binary search on git history.',
      'Floating-point root finding and binary search over monotonic answer spaces.'
    ],
    workingPrinciple: 'Monotonicity invariant: all elements to the left of index i are <= array[i]. By probing the midpoint, half of the candidate space is eliminated with a single comparison.',
    stepByStepExplanation: [
      'Set low = 0 and high = size - 1.',
      'Compute mid = low + (high - low) / 2.',
      'If array[mid] == target, return mid.',
      'If array[mid] < target, set low = mid + 1.',
      'If array[mid] > target, set high = mid - 1.',
      'Repeat while low <= high. If low > high, target is not in array.'
    ],
    timeComplexity: {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)'
    },
    spaceComplexity: 'O(1) iterative, O(log n) recursive',
    advantages: [
      'Exponentially faster than linear search for large datasets (e.g. 1 billion items requires at most 30 comparisons!).',
      'Simple, elegant, and cache-friendly.'
    ],
    disadvantages: [
      'Requires pre-sorted collection.',
      'Not efficient for dynamic collections requiring frequent insertions/deletions.'
    ],
    interviewQuestions: [
      {
        question: 'Why write mid = low + (high - low) / 2 instead of (low + high) / 2?',
        difficulty: 'Easy',
        company: 'Google / Meta',
        hint: 'Consider 32-bit signed integer limits.',
        solutionExplanation: 'In languages with fixed-width integers like C/C++/Java, (low + high) can exceed 2^31 - 1, causing signed integer overflow and returning a negative index. low + (high - low) / 2 guarantees no overflow.'
      }
    ],
    cSourceCode: `// See C_SOURCE_REGISTRY['binary-search']`
  }
];
