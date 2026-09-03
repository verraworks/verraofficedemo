import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'cyan' | 'slate';
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onClick?: () => void;
  id?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  trend,
  onClick,
  id
}) => {
  const colorSchemes = {
    blue: {
      bg: 'bg-blue-50/70',
      iconBg: 'bg-blue-600 text-white',
      border: 'hover:border-blue-300',
      accent: 'text-blue-600'
    },
    emerald: {
      bg: 'bg-emerald-50/70',
      iconBg: 'bg-emerald-600 text-white',
      border: 'hover:border-emerald-300',
      accent: 'text-emerald-600'
    },
    amber: {
      bg: 'bg-amber-50/70',
      iconBg: 'bg-amber-600 text-white',
      border: 'hover:border-amber-300',
      accent: 'text-amber-600'
    },
    purple: {
      bg: 'bg-purple-50/70',
      iconBg: 'bg-purple-600 text-white',
      border: 'hover:border-purple-300',
      accent: 'text-purple-600'
    },
    rose: {
      bg: 'bg-rose-50/70',
      iconBg: 'bg-rose-600 text-white',
      border: 'hover:border-rose-300',
      accent: 'text-rose-600'
    },
    cyan: {
      bg: 'bg-cyan-50/70',
      iconBg: 'bg-cyan-600 text-white',
      border: 'hover:border-cyan-300',
      accent: 'text-cyan-600'
    },
    slate: {
      bg: 'bg-slate-50',
      iconBg: 'bg-slate-700 text-white',
      border: 'hover:border-slate-300',
      accent: 'text-slate-700'
    }
  };

  const scheme = colorSchemes[color];

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md ' + scheme.border : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl shadow-xs ${scheme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span
            className={`font-semibold flex items-center gap-1 ${
              trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-slate-400">vs periode lalu</span>
        </div>
      )}
    </div>
  );
};
