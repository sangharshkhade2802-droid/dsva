import React, { useState } from 'react';
import { 
  Cpu, 
  ArrowUpDown, 
  Search, 
  Network, 
  GitFork, 
  ArrowRight,
  Filter,
  Flame,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { NavSection } from '../engine/types';

interface AlgorithmsViewProps {
  onNavigate: (section: NavSection) => void;
}

interface AlgoCard {
  id: string;
  name: string;
  category: 'sorting' | 'searching' | 'graph' | 'tree';
  targetSection: NavSection;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  popular?: boolean;
}

const ALGORITHMS_CATALOG: AlgoCard[] = [
  // Sorting
  { id: 'quick-sort', name: 'Quick Sort', category: 'sorting', targetSection: 'sorting', timeComplexity: 'O(n log n)', spaceComplexity: 'O(log n)', description: 'Fast in-place divide-and-conquer sorting algorithm using Lomuto partitioning.', popular: true },
  { id: 'merge-sort', name: 'Merge Sort', category: 'sorting', targetSection: 'sorting', timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)', description: 'Guaranteed O(n log n) stable divide-and-conquer algorithm with two-way merging.', popular: true },
  { id: 'heap-sort', name: 'Heap Sort', category: 'sorting', targetSection: 'sorting', timeComplexity: 'O(n log n)', spaceComplexity: 'O(1)', description: 'In-place comparison sort that builds a max-heap and extracts root elements.' },
  { id: 'bubble-sort', name: 'Bubble Sort', category: 'sorting', targetSection: 'sorting', timeComplexity: 'O(n²)', spaceComplexity: 'O(1)', description: 'Elementary sorting algorithm that repeatedly swaps adjacent inverted elements.' },
  { id: 'insertion-sort', name: 'Insertion Sort', category: 'sorting', targetSection: 'sorting', timeComplexity: 'O(n²)', spaceComplexity: 'O(1)', description: 'Iteratively builds a sorted subarray by shifting greater elements right.' },
  { id: 'selection-sort', name: 'Selection Sort', category: 'sorting', targetSection: 'sorting', timeComplexity: 'O(n²)', spaceComplexity: 'O(1)', description: 'Finds the minimum element from the unsorted part and swaps it into place.' },
  { id: 'counting-sort', name: 'Counting Sort', category: 'sorting', targetSection: 'sorting', timeComplexity: 'O(n + k)', spaceComplexity: 'O(k)', description: 'Non-comparison integer sorting algorithm utilizing frequency tallies.' },
  { id: 'radix-sort', name: 'Radix Sort', category: 'sorting', targetSection: 'sorting', timeComplexity: 'O(d(n+b))', spaceComplexity: 'O(n+b)', description: 'Multi-pass sorting by individual digit positions from LSD to MSD.' },
  { id: 'shell-sort', name: 'Shell Sort', category: 'sorting', targetSection: 'sorting', timeComplexity: 'O(n log² n)', spaceComplexity: 'O(1)', description: 'Generalization of insertion sort that permits exchange of distant elements.' },
  { id: 'bucket-sort', name: 'Bucket Sort', category: 'sorting', targetSection: 'sorting', timeComplexity: 'O(n + k)', spaceComplexity: 'O(n)', description: 'Distributes elements into buckets then sorts buckets individually.' },

  // Searching
  { id: 'binary-search', name: 'Binary Search', category: 'searching', targetSection: 'searching', timeComplexity: 'O(log n)', spaceComplexity: 'O(1)', description: 'Halves the search interval on monotonic sorted arrays at each step.', popular: true },
  { id: 'linear-search', name: 'Linear Search', category: 'searching', targetSection: 'searching', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', description: 'Sequentially checks each element until a match is found or end is reached.' },
  { id: 'jump-search', name: 'Jump Search', category: 'searching', targetSection: 'searching', timeComplexity: 'O(√n)', spaceComplexity: 'O(1)', description: 'Jumps fixed blocks of size √n then performs linear search within block.' },
  { id: 'interpolation-search', name: 'Interpolation Search', category: 'searching', targetSection: 'searching', timeComplexity: 'O(log log n)', spaceComplexity: 'O(1)', description: 'Estimates target position using value distribution slope interpolation.' },
  { id: 'exponential-search', name: 'Exponential Search', category: 'searching', targetSection: 'searching', timeComplexity: 'O(log n)', spaceComplexity: 'O(1)', description: 'Finds search range by repeated index doubling then executes binary search.' },

  // Graph
  { id: 'dijkstra', name: "Dijkstra's Algorithm", category: 'graph', targetSection: 'graph', timeComplexity: 'O((V+E)log V)', spaceComplexity: 'O(V)', description: 'Greedy single-source shortest path algorithm for non-negative weighted graphs.', popular: true },
  { id: 'bfs', name: 'Breadth First Search (BFS)', category: 'graph', targetSection: 'graph', timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)', description: 'Explores neighbor vertices level-by-level using a FIFO queue.' },
  { id: 'dfs', name: 'Depth First Search (DFS)', category: 'graph', targetSection: 'graph', timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)', description: 'Explores graph depth along branches until backtrack via recursion.' },
  { id: 'bellman-ford', name: 'Bellman-Ford', category: 'graph', targetSection: 'graph', timeComplexity: 'O(V × E)', spaceComplexity: 'O(V)', description: 'Computes shortest paths and accurately detects negative-weight cycles.' },
  { id: 'kruskal', name: "Kruskal's MST", category: 'graph', targetSection: 'graph', timeComplexity: 'O(E log E)', spaceComplexity: 'O(V)', description: 'Finds minimum spanning tree using Disjoint Set Union (Union-Find).' },
  { id: 'prim', name: "Prim's MST", category: 'graph', targetSection: 'graph', timeComplexity: 'O(E log V)', spaceComplexity: 'O(V)', description: 'Grows minimum spanning tree greedily from an arbitrary starting vertex.' },
  { id: 'floyd-warshall', name: 'Floyd-Warshall', category: 'graph', targetSection: 'graph', timeComplexity: 'O(V³)', spaceComplexity: 'O(V²)', description: 'Dynamic programming all-pairs shortest path algorithm across all vertex pairs.' },
  { id: 'topological-sort', name: 'Topological Sort', category: 'graph', targetSection: 'graph', timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)', description: 'Linear ordering of DAG vertices using Kahn in-degree algorithm.' },

  // Trees
  { id: 'inorder', name: 'Inorder Traversal', category: 'tree', targetSection: 'data_structures', timeComplexity: 'O(n)', spaceComplexity: 'O(h)', description: 'Traverses Left Subtree -> Root -> Right Subtree; visits BST in sorted order.' },
  { id: 'preorder', name: 'Preorder Traversal', category: 'tree', targetSection: 'data_structures', timeComplexity: 'O(n)', spaceComplexity: 'O(h)', description: 'Traverses Root -> Left Subtree -> Right Subtree; used for tree serialization.' },
  { id: 'postorder', name: 'Postorder Traversal', category: 'tree', targetSection: 'data_structures', timeComplexity: 'O(n)', spaceComplexity: 'O(h)', description: 'Traverses Left Subtree -> Right Subtree -> Root; used for bottom-up cleanup.' },
  { id: 'avl-balancing', name: 'AVL Tree Rotations', category: 'tree', targetSection: 'data_structures', timeComplexity: 'O(log n)', spaceComplexity: 'O(log n)', description: 'Strict balance restoration via Left and Right single and double rotations.', popular: true },
];

export const AlgorithmsView: React.FC<AlgorithmsViewProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const filtered = ALGORITHMS_CATALOG.filter((item) => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchText = item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                      item.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchCat && matchText;
  });

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              Master Catalog
            </span>
            <span className="text-xs text-slate-400 font-mono">30+ Verified C11 Algorithms</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Algorithms Directory & Runner
          </h1>
        </div>

        {/* Search Filter Input */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Filter algorithms..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'All Algorithms' },
          { id: 'sorting', label: 'Sorting' },
          { id: 'searching', label: 'Searching' },
          { id: 'graph', label: 'Graph Algorithms' },
          { id: 'tree', label: 'Tree Algorithms' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Algorithms Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((algo) => (
          <div
            key={algo.id}
            onClick={() => onNavigate(algo.targetSection)}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:scale-[1.01] group glass-panel flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 uppercase">
                  {algo.category}
                </span>
                {algo.popular && (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    <Flame className="w-3 h-3" /> Popular
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                {algo.name}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {algo.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-400">
                <span>Time: <span className="text-emerald-400 font-bold">{algo.timeComplexity}</span></span>
                <span>•</span>
                <span>Space: <span className="text-sky-400 font-bold">{algo.spaceComplexity}</span></span>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
