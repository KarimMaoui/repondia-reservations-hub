import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface OnboardingSlideProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  description: string;
  index: number;
}

export function OnboardingSlide({ icon, title, subtitle, description, index }: OnboardingSlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center px-8 text-center h-full"
    >
      {/* Icon container with gradient background */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl scale-150" />
        <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/10">
          {icon}
        </div>
      </motion.div>

      {/* Subtitle - Purple accent */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary"
      >
        {subtitle}
      </motion.p>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-4 text-2xl font-bold text-foreground"
      >
        {title}
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-xs text-muted-foreground leading-relaxed"
      >
        {description}
      </motion.p>
    </motion.div>
  );
}
