import React from 'react';
import { motion } from 'framer-motion';
import { LucideProps } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<LucideProps>;
  variant?: 'gradient' | 'flat';
  color?: string; // e.g., 'from-sky-400 to-blue-500' for gradient
  change?: string;
  onClick?: () => void;
  active?: boolean; // for flat variant filtering
  className?: string;
  itemVariants?: any; // For framer-motion variants
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon: Icon,
  variant = 'flat',
  color,
  change,
  onClick,
  active = false,
  className = '',
  itemVariants,
}) => {
  if (variant === 'gradient') {
    return (
      <motion.div
        {...(itemVariants ? { variants: itemVariants } : {})}
        className={`relative overflow-hidden rounded-2xl text-white p-6 shadow-lg flex flex-col justify-between h-52 bg-gradient-to-br ${color} ${className}`}
      >
        <div className="absolute -right-4 -top-4 text-white/10">
          <Icon size={120} strokeWidth={1.5} />
        </div>
        <div className="relative z-10">
          <p className="font-semibold text-white/90 text-xl">{title}</p>
        </div>
        <div className="relative z-10">
           <p className="text-6xl font-bold">{value}</p>
           {change && (
            <span className="text-base mt-2 inline-block bg-white/20 px-3 py-1 rounded-full font-semibold">{change}</span>
          )}
        </div>
      </motion.div>
    );
  }

  // Flat variant
  return (
    <motion.div
      {...{ whileHover: onClick ? { y: -3, scale: 1.02 } : {}, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
      onClick={onClick}
      className={`p-5 rounded-xl border transition-all duration-200 ${onClick ? 'cursor-pointer' : ''} ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 border-indigo-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'} ${className}`}
    >
        <div className="flex items-center justify-between">
            <p className={`font-semibold text-lg ${active ? 'text-white/90' : 'text-slate-600 dark:text-slate-300'}`}>{title}</p>
            <Icon size={24} className={active ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'} />
        </div>
        <p className={`text-4xl font-bold mt-2 ${active ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>{value}</p>
        {change && (
            <p className={`text-sm mt-1 ${active ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>{change}</p>
        )}
    </motion.div>
  );
};

export default KpiCard;