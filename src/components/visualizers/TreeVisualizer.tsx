import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  GitFork, 
  RotateCw, 
  Plus, 
  Trash2, 
  Search, 
  Compass, 
  CheckCircle2,
  RefreshCw,
  GitBranch
} from 'lucide-react';
import { executeAlgorithmApi } from '../../engine/api';
import { ExecutionTrace } from '../../engine/types';
import { useAnimationPlayer } from '../../hooks/useAnimationPlayer';
import { ControlPanel } from '../common/ControlPanel';
import { CodeViewer } from '../code/CodeViewer';
import { C_SOURCE_REGISTRY } from '../../engine/cSourceRegistry';

const TREE_SUITE = [
  { id: 'bst', name: 'Binary Search Tree (BST)' },
  { id: 'avl', name: 'AVL Tree (Self-Balancing)' },
  { id: 'red-black', name: 'Red-Black Tree' },
  { id: 'heap', name: 'Binary Max Heap' },
  { id: 'traversal-inorder', name: 'Inorder Traversal' },
  { id: 'traversal-preorder', name: 'Preorder Traversal' },
  { id: 'traversal-postorder', name: 'Postorder Traversal' },
  { id: 'traversal-levelorder', name: 'Level Order (BFS)' },
  { id: 'lca', name: 'Lowest Common Ancestor' },
];

interface TreeNode {
  id: number;
  key: number;
  parent: number;
  edge: string;
  height?: number;
  bf?: number;
}

export const TreeVisualizer: React.FC = () => {
  const [selectedTree, setSelectedTree] = useState('avl');
  const [keys, setKeys] = useState<number[]>([50, 30, 70, 20, 40, 60, 80]);
  const [inputValue, setInputValue] = useState('25');
  const [trace, setTrace] = useState<ExecutionTrace | null>(null);

  const player = useAnimationPlayer(trace, { initialSpeed: 1 });

  const runTreeOp = async (treeType = selectedTree, op = 'insert', val = parseInt(inputValue, 10)) => {
    player.reset();
    try {
      let endpoint = `/tree/bst`;
      let payload: any = { keys, op, value: isNaN(val) ? 25 : val };

      if (treeType === 'avl') {
        endpoint = `/tree/avl`;
      } else if (treeType === 'red-black') {
        endpoint = `/tree/red-black`;
      } else if (treeType === 'heap') {
        endpoint = `/tree/heap`;
      } else if (treeType.startsWith('traversal-')) {
        endpoint = `/tree/traversal`;
        const tname = treeType.replace('traversal-', '');
        payload.type = tname === 'inorder' ? 'Inorder Traversal' :
                       tname === 'preorder' ? 'Preorder Traversal' :
                       tname === 'postorder' ? 'Postorder Traversal' : 'Level Order Traversal';
      } else if (treeType === 'lca') {
        endpoint = `/tree/lca`;
        payload.n1 = 20;
        payload.n2 = 40;
      }

      const data = await executeAlgorithmApi(endpoint, payload);
      setTrace(data);

      if (op === 'insert' && !keys.includes(val) && !isNaN(val)) {
        setKeys([...keys, val]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    runTreeOp(selectedTree, 'insert', parseInt(inputValue, 10));
  }, [selectedTree]);

  // Hierarchical node positioning for clean SVG layout
  const aux = player.currentStep?.aux || {};
  const currentFocus = aux.focus;

  // Build tree hierarchy representation
  function layoutTree(nodes: number[]) {
    // Basic balanced tree layout coordinates
    return nodes.map((k, i) => {
      const level = Math.floor(Math.log2(i + 1));
      const posInLevel = i - (Math.pow(2, level) - 1);
      const totalInLevel = Math.pow(2, level);
      const x = 380 + (posInLevel - (totalInLevel - 1) / 2) * (360 / Math.pow(1.6, level));
      const y = 50 + level * 70;
      return { key: k, x, y, level, parentIdx: i > 0 ? Math.floor((i - 1) / 2) : -1 };
    });
  }

  const treeLayout = layoutTree(keys);
  const codeMeta = C_SOURCE_REGISTRY['avl-tree'];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              Tree Data Structures
            </span>
            <span className="text-xs text-slate-400 font-mono">Self-Balancing & Rotations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tree Visualizer & Rotations Engine
          </h1>
        </div>

        {/* Tree suite tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl glass-panel">
          {TREE_SUITE.map((tree) => (
            <button
              key={tree.id}
              onClick={() => setSelectedTree(tree.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedTree === tree.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tree.name}
            </button>
          ))}
        </div>
      </div>

      {/* Operation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl glass-panel text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono">Key Value:</span>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-20 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-400 text-center"
            />
          </div>

          <button
            onClick={() => runTreeOp(selectedTree, 'insert', parseInt(inputValue, 10))}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-md"
          >
            <Plus className="w-3.5 h-3.5" /> Insert Key
          </button>

          <button
            onClick={() => runTreeOp(selectedTree, 'search', parseInt(inputValue, 10))}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
          >
            <Search className="w-3.5 h-3.5" /> Search
          </button>
        </div>

        <button
          onClick={() => {
            setKeys([50, 30, 70, 20, 40, 60, 80]);
            runTreeOp(selectedTree, 'insert', 25);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <RotateCw className="w-3.5 h-3.5" /> Reset Tree
        </button>
      </div>

      {/* Tree SVG Stage */}
      <div className="flex flex-col gap-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl glass-panel shadow-2xl relative min-h-[400px]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/70 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-emerald-400" />
            <span>Active Tree Type: <span className="text-emerald-400 font-bold">{selectedTree.toUpperCase()}</span></span>
          </div>
          <div>Total Nodes: <span className="text-white font-bold">{keys.length}</span></div>
        </div>

        {/* SVG Drawing Area */}
        <div className="w-full h-80 relative overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 760 320">
            {/* Draw connecting branches */}
            {treeLayout.map((node, i) => {
              if (node.parentIdx >= 0 && treeLayout[node.parentIdx]) {
                const parent = treeLayout[node.parentIdx];
                return (
                  <line
                    key={`line-${i}`}
                    x1={parent.x}
                    y1={parent.y}
                    x2={node.x}
                    y2={node.y}
                    stroke="#334155"
                    strokeWidth="2.5"
                    strokeDasharray={selectedTree === 'avl' ? '4 2' : undefined}
                  />
                );
              }
              return null;
            })}

            {/* Draw nodes */}
            {treeLayout.map((node, i) => {
              const isFocused = currentFocus === node.key || (player.currentStep?.indices && player.currentStep.indices.includes(node.key));
              const isRotated = player.currentStep?.action?.includes('rotate');

              let fillColor = '#1e293b';
              let strokeColor = '#475569';
              let textColor = '#e2e8f0';

              if (isFocused) {
                fillColor = '#10b981';
                strokeColor = '#34d399';
                textColor = '#0f172a';
              } else if (selectedTree === 'red-black') {
                fillColor = i % 2 === 0 ? '#0f172a' : '#e11d48';
                strokeColor = i % 2 === 0 ? '#475569' : '#f43f5e';
              }

              return (
                <g key={`node-${node.key}-${i}`} className="cursor-pointer transition-all">
                  {/* Outer glow ring when focused */}
                  {isFocused && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="26"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}
                  {/* Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    className="transition-colors shadow-lg"
                  />
                  {/* Key Label */}
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {node.key}
                  </text>

                  {/* Balance Factor badge for AVL */}
                  {selectedTree === 'avl' && (
                    <text
                      x={node.x + 22}
                      y={node.y - 8}
                      fill="#38bdf8"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      BF:0
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-600"></span>
            <span>Standard Node</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-400"></span>
            <span>Active / Target Node</span>
          </div>
          {selectedTree === 'red-black' && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-600 border border-rose-500"></span>
              <span>Red Node</span>
            </div>
          )}
          {selectedTree === 'avl' && (
            <div className="flex items-center gap-1.5">
              <span className="text-sky-400 font-bold">BF</span>
              <span>Balance Factor (left - right)</span>
            </div>
          )}
        </div>
      </div>

      {/* Control Panel */}
      <ControlPanel
        isPlaying={player.isPlaying}
        currentStepIndex={player.currentStepIndex}
        totalSteps={player.totalSteps}
        currentStep={player.currentStep}
        speed={player.speed}
        progress={player.progress}
        onPlay={player.play}
        onPause={player.pause}
        onTogglePlay={player.togglePlay}
        onStepForward={player.stepForward}
        onStepBackward={player.stepBackward}
        onReset={player.reset}
        onSeek={player.seek}
        onSpeedChange={player.setSpeed}
      />

      {/* C Code */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
          C11 Tree Implementation
        </h3>
        <CodeViewer
          codeMetadata={codeMeta}
          activeLine={player.currentStep?.line}
          height="350px"
        />
      </div>
    </div>
  );
};
