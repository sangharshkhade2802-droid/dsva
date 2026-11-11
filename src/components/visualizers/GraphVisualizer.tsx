import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Network, 
  Play, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Clock, 
  Activity, 
  MapPin, 
  CheckCircle2,
  Route,
  Zap
} from 'lucide-react';
import { executeAlgorithmApi } from '../../engine/api';
import { ExecutionTrace, GraphNode, GraphEdgeModel } from '../../engine/types';
import { useAnimationPlayer } from '../../hooks/useAnimationPlayer';
import { ControlPanel } from '../common/ControlPanel';
import { StatBadge } from '../common/StatBadge';
import { CodeViewer } from '../code/CodeViewer';
import { C_SOURCE_REGISTRY } from '../../engine/cSourceRegistry';

const GRAPH_ALGORITHMS = [
  { id: 'bfs', name: 'BFS (Breadth First)' },
  { id: 'dfs', name: 'DFS (Depth First)' },
  { id: 'dijkstra', name: "Dijkstra's Shortest Path" },
  { id: 'bellman-ford', name: 'Bellman-Ford' },
  { id: 'floyd-warshall', name: 'Floyd-Warshall' },
  { id: 'kruskal', name: "Kruskal's MST" },
  { id: 'prim', name: "Prim's MST" },
  { id: 'topological-sort', name: 'Topological Sort' },
];

export const GraphVisualizer: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState('dijkstra');
  const [startVertex, setStartVertex] = useState(0);
  const [destVertex, setDestVertex] = useState(5);

  // Graph state: default 6 nodes
  const [nodes, setNodes] = useState<GraphNode[]>([
    { id: 0, label: '0', x: 120, y: 160 },
    { id: 1, label: '1', x: 260, y: 70 },
    { id: 2, label: '2', x: 260, y: 250 },
    { id: 3, label: '3', x: 440, y: 70 },
    { id: 4, label: '4', x: 440, y: 250 },
    { id: 5, label: '5', x: 580, y: 160 },
  ]);

  const [edges, setEdges] = useState<GraphEdgeModel[]>([
    { u: 0, v: 1, weight: 4 },
    { u: 0, v: 2, weight: 2 },
    { u: 1, v: 2, weight: 1 },
    { u: 1, v: 3, weight: 5 },
    { u: 2, v: 3, weight: 8 },
    { u: 2, v: 4, weight: 10 },
    { u: 3, v: 4, weight: 2 },
    { u: 3, v: 5, weight: 6 },
    { u: 4, v: 5, weight: 3 },
  ]);

  const [trace, setTrace] = useState<ExecutionTrace | null>(null);
  const player = useAnimationPlayer(trace, { initialSpeed: 1 });

  const runGraphAlgo = async (algoId = selectedAlgo, s = startVertex, d = destVertex) => {
    player.reset();
    try {
      const data = await executeAlgorithmApi(`/graph/${algoId}`, {
        vertices: nodes.length,
        edges,
        start: s,
        dest: d,
        directed: algoId === 'topological-sort',
      });
      setTrace(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    runGraphAlgo(selectedAlgo, startVertex, destVertex);
  }, [selectedAlgo, startVertex, destVertex]);

  // Highlight status from execution step
  const activeIndices = player.currentStep?.indices || [];
  const activeAction = player.currentStep?.action || '';
  const currentAux = player.currentStep?.aux || {};
  const currentDistances = player.currentStep?.array || [];

  const codeMeta = C_SOURCE_REGISTRY['dijkstra'];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              Graph Suite
            </span>
            <span className="text-xs text-slate-400 font-mono">Weighted Matrix & Adjacency</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Interactive Graph Visualizer
          </h1>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl glass-panel">
          {GRAPH_ALGORITHMS.map((algo) => (
            <button
              key={algo.id}
              onClick={() => setSelectedAlgo(algo.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedAlgo === algo.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {algo.name}
            </button>
          ))}
        </div>
      </div>

      {/* Graph Control Bar: Source, Destination, Presets */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl glass-panel text-xs">
        <div className="flex flex-wrap items-center gap-4">
          {/* Source node */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">Source Vertex:</span>
            <select
              value={startVertex}
              onChange={(e) => setStartVertex(parseInt(e.target.value, 10))}
              className="bg-slate-950 border border-slate-800 text-emerald-400 px-3 py-1.5 rounded-xl font-mono focus:outline-none"
            >
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>Vertex {n.label}</option>
              ))}
            </select>
          </div>

          {/* Destination node for Dijkstra */}
          {selectedAlgo === 'dijkstra' && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono">Destination:</span>
              <select
                value={destVertex}
                onChange={(e) => setDestVertex(parseInt(e.target.value, 10))}
                className="bg-slate-950 border border-slate-800 text-sky-400 px-3 py-1.5 rounded-xl font-mono focus:outline-none"
              >
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>Vertex {n.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Presets */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setStartVertex(0);
              setDestVertex(5);
              runGraphAlgo(selectedAlgo, 0, 5);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Graph
          </button>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="flex flex-col gap-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl glass-panel shadow-2xl relative min-h-[420px]">
        {/* Metric Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/70">
          <div className="flex flex-wrap items-center gap-2">
            <StatBadge
              icon={Activity}
              label="Operations"
              value={trace ? trace.operations : 0}
              color="blue"
            />
            <StatBadge
              icon={Clock}
              label="C Exec Time"
              value={trace ? trace.execution_time_us.toFixed(2) : '0.00'}
              unit="μs"
              color="emerald"
            />
            {selectedAlgo === 'dijkstra' && currentDistances[destVertex] !== undefined && currentDistances[destVertex] < 900 && (
              <StatBadge
                icon={Route}
                label="Shortest Distance"
                value={currentDistances[destVertex]}
                color="purple"
              />
            )}
          </div>

          <div className="text-xs font-mono text-slate-400">
            Vertices: <span className="text-white font-bold">{nodes.length}</span> | Edges: <span className="text-white font-bold">{edges.length}</span>
          </div>
        </div>

        {/* SVG Graph View */}
        <div className="w-full h-80 relative flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 700 320">
            {/* Draw Edges */}
            {edges.map((e, idx) => {
              const uNode = nodes.find(n => n.id === e.u);
              const vNode = nodes.find(n => n.id === e.v);
              if (!uNode || !vNode) return null;

              const isEdgeActive = activeIndices.length >= 2 && 
                ((activeIndices[0] === e.u && activeIndices[1] === e.v) ||
                 (activeIndices[0] === e.v && activeIndices[1] === e.u));

              const strokeColor = isEdgeActive ? '#10b981' : '#334155';
              const strokeW = isEdgeActive ? 4 : 2;

              // Midpoint for weight label
              const midX = (uNode.x + vNode.x) / 2;
              const midY = (uNode.y + vNode.y) / 2;

              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={uNode.x}
                    y1={uNode.y}
                    x2={vNode.x}
                    y2={vNode.y}
                    stroke={strokeColor}
                    strokeWidth={strokeW}
                    className="transition-all"
                  />
                  {/* Weight Badge */}
                  <rect
                    x={midX - 12}
                    y={midY - 10}
                    width="24"
                    height="20"
                    rx="6"
                    fill="#0f172a"
                    stroke={isEdgeActive ? '#10b981' : '#475569'}
                    strokeWidth="1.5"
                  />
                  <text
                    x={midX}
                    y={midY + 4}
                    textAnchor="middle"
                    fill={isEdgeActive ? '#34d399' : '#94a3b8'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {e.weight}
                  </text>
                </g>
              );
            })}

            {/* Draw Vertices */}
            {nodes.map((node) => {
              const isStart = node.id === startVertex;
              const isDest = node.id === destVertex && selectedAlgo === 'dijkstra';
              const isVisiting = activeIndices.includes(node.id);
              const distance = currentDistances[node.id];

              let nodeFill = '#1e293b';
              let nodeStroke = '#475569';
              let textColor = '#e2e8f0';

              if (isVisiting) {
                nodeFill = '#10b981';
                nodeStroke = '#34d399';
                textColor = '#0f172a';
              } else if (isStart) {
                nodeFill = '#0284c7';
                nodeStroke = '#38bdf8';
              } else if (isDest) {
                nodeFill = '#9333ea';
                nodeStroke = '#c084fc';
              }

              return (
                <g key={`node-${node.id}`} className="cursor-pointer">
                  {/* Pulse on active */}
                  {isVisiting && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="28"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}
                  {/* Vertex circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="22"
                    fill={nodeFill}
                    stroke={nodeStroke}
                    strokeWidth="2.5"
                    className="shadow-xl transition-all"
                  />
                  {/* Vertex Label */}
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {node.label}
                  </text>

                  {/* Distance pill (if computed) */}
                  {distance !== undefined && distance < 900 && (
                    <g>
                      <rect
                        x={node.x - 16}
                        y={node.y + 26}
                        width="32"
                        height="16"
                        rx="4"
                        fill="#020617"
                        stroke="#38bdf8"
                        strokeWidth="1"
                      />
                      <text
                        x={node.x}
                        y={node.y + 38}
                        textAnchor="middle"
                        fill="#38bdf8"
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        d:{distance}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-600"></span>
            <span>Source Vertex</span>
          </div>
          {selectedAlgo === 'dijkstra' && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-600"></span>
              <span>Destination Vertex</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Visiting / Relaxed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-0.5 bg-emerald-500"></span>
            <span>Active Edge</span>
          </div>
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
          C11 Graph Engine Implementation
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
