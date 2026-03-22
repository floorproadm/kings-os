'use client';
import type React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type GradientBackgroundProps = React.ComponentProps<'div'> & {
  gradients?: string[];
  animationDuration?: number;
  animationDelay?: number;
  overlay?: boolean;
  overlayOpacity?: number;
};

const Default_Gradients = [
  "linear-gradient(135deg, hsl(var(--background)) 0%, hsla(43, 58%, 54%, 0.15) 100%)",
  "linear-gradient(135deg, hsla(43, 58%, 54%, 0.1) 0%, hsl(var(--background)) 100%)",
  "linear-gradient(135deg, hsl(var(--background)) 0%, hsla(43, 58%, 34%, 0.12) 100%)",
  "linear-gradient(135deg, hsla(43, 58%, 44%, 0.08) 0%, hsl(var(--background)) 100%)",
  "linear-gradient(135deg, hsl(var(--background)) 0%, hsla(43, 58%, 54%, 0.15) 100%)",
];

export function GradientBackground({
  children,
  className = '',
  gradients = Default_Gradients,
  animationDuration = 8,
  animationDelay = 0.5,
  overlay = false,
  overlayOpacity = 0.3,
}: GradientBackgroundProps) {
  return (
    <div className={cn('relative w-full overflow-hidden', className)}>
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: gradients,
        }}
        transition={{
          duration: animationDuration,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
          delay: animationDelay,
        }}
      />

      {/* Optional overlay */}
      {overlay && (
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundColor: `hsla(var(--background) / ${overlayOpacity})`,
          }}
        />
      )}

      {/* Content wrapper */}
      {children && (
        <div className="relative z-0">
          {children}
        </div>
      )}
    </div>
  );
}
