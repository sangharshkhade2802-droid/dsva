import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatBadgeProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  color?: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose';
}

const colorStyles = {
  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  blue: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

export const StatBadge: React.FC<StatBadgeProps> = ({
  icon: Icon,
  label,
  value,
  unit,
  color = 'emerald',
}) => {
  return (
    <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${colorStyles[color]}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-slate-400 leading-none mb-0.5">{label}</span>
        <span className="font-mono font-semibold text-slate-100 text-xs">
          {value} {unit && <span className="text-[10px] text-slate-400 font-normal">{unit}</span>}
        </span>
      </div>
    </div>
  );
};
