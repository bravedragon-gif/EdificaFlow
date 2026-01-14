
import React from 'react';
import { 
  Zap, 
  Droplets, 
  ShieldAlert, 
  ArrowUpCircle, 
  Wind, 
  Waves, 
  Trash2, 
  Camera, 
  Flame, 
  Building2,
  Tag
} from 'lucide-react';
import { Category, Frequency, Priority } from './types';

export const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  [Category.ELECTRICAL]: <Zap className="w-5 h-5 text-yellow-500" />,
  [Category.PLUMBING]: <Droplets className="w-5 h-5 text-blue-500" />,
  [Category.STRUCTURAL]: <Building2 className="w-5 h-5 text-slate-500" />,
  [Category.FIRE_SAFETY]: <Flame className="w-5 h-5 text-red-500" />,
  [Category.ELEVATORS]: <ArrowUpCircle className="w-5 h-5 text-indigo-500" />,
  [Category.HVAC]: <Wind className="w-5 h-5 text-cyan-500" />,
  [Category.LEISURE]: <Waves className="w-5 h-5 text-teal-500" />,
  [Category.CLEANING]: <Trash2 className="w-5 h-5 text-emerald-500" />,
  [Category.SECURITY]: <Camera className="w-5 h-5 text-purple-500" />,
  [Category.GAS]: <ShieldAlert className="w-5 h-5 text-orange-500" />,
  [Category.GENERAL]: <Tag className="w-5 h-5 text-slate-400" />,
};

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  [Frequency.DAILY]: 'Diária',
  [Frequency.WEEKLY]: 'Semanal',
  [Frequency.MONTHLY]: 'Mensal',
  [Frequency.QUARTERLY]: 'Trimestral',
  [Frequency.ANNUAL]: 'Anual',
  [Frequency.QUINQUENNIAL]: 'Quinquenal (5 anos)',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.LOW]: 'bg-slate-100 text-slate-700',
  [Priority.MEDIUM]: 'bg-blue-100 text-blue-700',
  [Priority.HIGH]: 'bg-orange-100 text-orange-700',
  [Priority.CRITICAL]: 'bg-red-100 text-red-700',
};
