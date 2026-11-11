import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, Binary, ArrowUpDown, Network, Layers } from 'lucide-react';
import { NavSection } from '../../engine/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (section: NavSection, queryId?: string) => void;
}

interface SearchEntry {
  title: string;
  category: string;
  section: NavSection;
  id: string;
  keywords: string[];
}

const SEARCH_DATABASE: SearchEntry[] = [
  // Sorting
  { title: 'Bubble Sort', category: 'Sorting Algorithms', section: 'sorting', id: 'bubble-sort', keywords: ['sort', 'bubble', 'n^2'] },
  { title: 'Selection Sort', category: 'Sorting Algorithms', section: 'sorting', id: 'selection-sort', keywords: ['sort', 'selection', 'min'] },
  { title: 'Insertion Sort', category: 'Sorting Algorithms', section: 'sorting', id: 'insertion-sort', keywords: ['sort', 'insertion', 'shift'] },
  { title: 'Merge Sort', category: 'Sorting Algorithms', section: 'sorting', id: 'merge-sort', keywords: ['sort', 'merge', 'divide', 'n log n'] },
  { title: 'Quick Sort', category: 'Sorting Algorithms', section: 'sorting', id: 'quick-sort', keywords: ['sort', 'quick', 'pivot', 'partition'] },
  { title: 'Heap Sort', category: 'Sorting Algorithms', section: 'sorting', id: 'heap-sort', keywords: ['sort', 'heap', 'heapify'] },
  { title: 'Counting Sort', category: 'Sorting Algorithms', section: 'sorting', id: 'counting-sort', keywords: ['sort', 'counting', 'non-comparison'] },
  { title: 'Radix Sort', category: 'Sorting Algorithms', section: 'sorting', id: 'radix-sort', keywords: ['sort', 'radix', 'digits', 'lsd'] },
  { title: 'Shell Sort', category: 'Sorting Algorithms', section: 'sorting', id: 'shell-sort', keywords: ['sort', 'shell', 'gap'] },
  { title: 'Bucket Sort', category: 'Sorting Algorithms', section: 'sorting', id: 'bucket-sort', keywords: ['sort', 'bucket', 'distribution'] },

  // Searching
  { title: 'Linear Search', category: 'Searching Algorithms', section: 'searching', id: 'linear-search', keywords: ['search', 'linear', 'sequential'] },
  { title: 'Binary Search', category: 'Searching Algorithms', section: 'searching', id: 'binary-search', keywords: ['search', 'binary', 'log n', 'sorted'] },
  { title: 'Jump Search', category: 'Searching Algorithms', section: 'searching', id: 'jump-search', keywords: ['search', 'jump', 'sqrt n'] },
  { title: 'Interpolation Search', category: 'Searching Algorithms', section: 'searching', id: 'interpolation-search', keywords: ['search', 'interpolation', 'probe'] },
  { title: 'Exponential Search', category: 'Searching Algorithms', section: 'searching', id: 'exponential-search', keywords: ['search', 'exponential', 'unbounded'] },

  // Linear Data Structures
  { title: 'Array Operations', category: 'Linear Data Structures', section: 'data_structures', id: 'array', keywords: ['array', 'insert', 'delete', 'static'] },
  { title: 'Singly Linked List', category: 'Linear Data Structures', section: 'data_structures', id: 'singly-linked-list', keywords: ['linked list', 'singly', 'pointers', 'malloc'] },
  { title: 'Doubly Linked List', category: 'Linear Data Structures', section: 'data_structures', id: 'doubly-linked-list', keywords: ['linked list', 'doubly', 'prev', 'next'] },
  { title: 'Circular Linked List', category: 'Linear Data Structures', section: 'data_structures', id: 'circular-linked-list', keywords: ['circular', 'linked list', 'loop'] },
  { title: 'Stack (LIFO)', category: 'Linear Data Structures', section: 'data_structures', id: 'stack', keywords: ['stack', 'push', 'pop', 'lifo'] },
  { title: 'Queue (FIFO)', category: 'Linear Data Structures', section: 'data_structures', id: 'queue', keywords: ['queue', 'enqueue', 'dequeue', 'fifo'] },
  { title: 'Circular Queue', category: 'Linear Data Structures', section: 'data_structures', id: 'circular-queue', keywords: ['circular queue', 'ring buffer', 'modulo'] },
  { title: 'Deque', category: 'Linear Data Structures', section: 'data_structures', id: 'deque', keywords: ['deque', 'double ended queue'] },

  // Non-Linear & Trees
  { title: 'Binary Search Tree (BST)', category: 'Non-Linear Data Structures', section: 'data_structures', id: 'bst', keywords: ['tree', 'bst', 'binary search tree', 'inorder'] },
  { title: 'AVL Tree (Self-Balancing)', category: 'Non-Linear Data Structures', section: 'data_structures', id: 'avl-tree', keywords: ['avl', 'tree', 'rotations', 'balance factor'] },
  { title: 'Red-Black Tree', category: 'Non-Linear Data Structures', section: 'data_structures', id: 'red-black-tree', keywords: ['red black', 'tree', 'recolor'] },
  { title: 'Binary Heap (Min / Max)', category: 'Non-Linear Data Structures', section: 'data_structures', id: 'binary-heap', keywords: ['heap', 'min heap', 'max heap', 'priority queue'] },
  { title: 'Trie (Prefix Tree)', category: 'Non-Linear Data Structures', section: 'data_structures', id: 'trie', keywords: ['trie', 'prefix', 'dictionary', 'words'] },
  { title: 'B-Tree & B+ Tree', category: 'Non-Linear Data Structures', section: 'data_structures', id: 'btree', keywords: ['btree', 'b+ tree', 'database', 'indexing'] },

  // Graph Algorithms
  { title: 'Breadth First Search (BFS)', category: 'Graph Algorithms', section: 'graph', id: 'bfs', keywords: ['graph', 'bfs', 'queue', 'level order'] },
  { title: 'Depth First Search (DFS)', category: 'Graph Algorithms', section: 'graph', id: 'dfs', keywords: ['graph', 'dfs', 'stack', 'backtrack'] },
  { title: "Dijkstra's Shortest Path", category: 'Graph Algorithms', section: 'graph', id: 'dijkstra', keywords: ['graph', 'dijkstra', 'shortest path', 'greedy'] },
  { title: 'Bellman-Ford Algorithm', category: 'Graph Algorithms', section: 'graph', id: 'bellman-ford', keywords: ['graph', 'bellman ford', 'negative weights'] },
  { title: 'Floyd-Warshall (All-Pairs)', category: 'Graph Algorithms', section: 'graph', id: 'floyd-warshall', keywords: ['graph', 'floyd warshall', 'all pairs'] },
  { title: "Kruskal's MST", category: 'Graph Algorithms', section: 'graph', id: 'kruskal', keywords: ['graph', 'kruskal', 'mst', 'union find', 'dsu'] },
  { title: "Prim's MST", category: 'Graph Algorithms', section: 'graph', id: 'prim', keywords: ['graph', 'prim', 'mst', 'cut'] },
  { title: "Topological Sort", category: 'Graph Algorithms', section: 'graph', id: 'topo', keywords: ['graph', 'topological sort', 'dag', 'kahn'] },

  // Analysis & Playground
  { title: 'Complexity Analyzer', category: 'Analysis', section: 'complexity', id: 'complexity', keywords: ['big-o', 'time complexity', 'space complexity', 'benchmark'] },
  { title: 'C Monaco Code Playground', category: 'Playground', section: 'playground', id: 'playground', keywords: ['c', 'compiler', 'monaco', 'editor', 'code'] },
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filtered = SEARCH_DATABASE.filter((entry) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.category.toLowerCase().includes(q) ||
      entry.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filtered.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onSelect(filtered[selectedIndex].section, filtered[selectedIndex].id);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden glass-panel flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search algorithms, data structures, Big-O classes..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 divide-y divide-slate-800/40">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No matching algorithms or data structures found for "{query}".
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={`${item.id}-${idx}`}
                  onClick={() => {
                    onSelect(item.section, item.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
                    isSelected ? 'bg-emerald-500/15 border border-emerald-500/30' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                      {item.section === 'sorting' && <ArrowUpDown className="w-4 h-4" />}
                      {item.section === 'searching' && <Search className="w-4 h-4" />}
                      {item.section === 'graph' && <Network className="w-4 h-4" />}
                      {item.section === 'data_structures' && <Layers className="w-4 h-4" />}
                      {item.section !== 'sorting' && item.section !== 'searching' && item.section !== 'graph' && item.section !== 'data_structures' && <Binary className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className={`text-xs font-semibold ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400">{item.category}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-600'}`} />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">↵</kbd> Select</span>
          </div>
          <span>DSVA C11 Interactive Engine</span>
        </div>
      </div>
    </div>
  );
};
