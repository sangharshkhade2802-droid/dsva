import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  Cpu, 
  ArrowUpDown, 
  Search, 
  Network, 
  LineChart, 
  Code2, 
  GraduationCap, 
  Info,
  ChevronRight
} from 'lucide-react';
import { NavSection } from '../../engine/types';

interface SidebarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  isCollapsed?: boolean;
}

interface NavItem {
  id: NavSection;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'data_structures', label: 'Data Structures', icon: Layers, badge: '18+' },
  { id: 'algorithms', label: 'Algorithms', icon: Cpu, badge: '30+' },
  { id: 'sorting', label: 'Sorting Visualizer', icon: ArrowUpDown },
  { id: 'searching', label: 'Searching Visualizer', icon: Search },
  { id: 'graph', label: 'Graph Visualizer', icon: Network },
  { id: 'complexity', label: 'Complexity Analyzer', icon: LineChart },
  { id: 'playground', label: 'Code Playground', icon: Code2, badge: 'Monaco' },
  { id: 'learning', label: 'Learning Resources', icon: GraduationCap },
  { id: 'about', label: 'About Project', icon: Info },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onNavigate,
}) => {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/60 backdrop-blur-md flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Navigation Section Label */}
      <div className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
        Navigation
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
          <Cpu className="w-3.5 h-3.5" />
          <span>C Computational Engine</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          All algorithms and structural transformations run natively in C11 with microsecond benchmarking.
        </p>
      </div>
    </aside>
  );
};
