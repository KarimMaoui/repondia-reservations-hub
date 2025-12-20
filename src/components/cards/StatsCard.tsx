import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  onClick?: () => void;
}

const variantStyles = {
  default: 'bg-card border-border/50',
  primary: 'bg-primary/5 border-primary/20',
  success: 'bg-success/5 border-success/20',
  warning: 'bg-warning/5 border-warning/20',
};

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
};

export function StatsCard({
  icon,
  label,
  value,
  sublabel,
  variant = 'default',
  onClick,
}: StatsCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start p-4 rounded-2xl border transition-all duration-200 text-left w-full",
        variantStyles[variant],
        onClick && "hover:shadow-soft active:scale-[0.98]"
      )}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      <div className={cn("p-2.5 rounded-xl mb-3", iconStyles[variant])}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm font-medium text-secondary">{label}</p>
      {sublabel && (
        <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
      )}
    </motion.button>
  );
}
