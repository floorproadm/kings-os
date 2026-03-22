"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface StackedCardProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function StackedCard({ className, style, children, onMouseEnter, onMouseLeave }: StackedCardProps) {
  return (
    <div
      className={cn(
        "transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] cursor-pointer [grid-area:stack]",
        className
      )}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}

interface StackedCardsProps {
  children: React.ReactNode[];
  className?: string;
}

export function StackedCards({ children, className }: StackedCardsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = children.length;

  return (
    <div className={cn("grid place-items-start", className)}>
      {children.map((child, index) => {
        const isHovered = hoveredIndex === index;
        const isBehindHovered = hoveredIndex !== null && hoveredIndex < index;
        const offsetX = index * 14;
        const baseY = index * 28;

        let y = baseY;
        if (isHovered) y = baseY - 10;
        if (isBehindHovered) y = baseY + (index - hoveredIndex!) * 18;

        const isTop = index === total - 1;
        const showOverlay = !isTop && !isHovered;

        return (
          <StackedCard
            key={index}
            style={{
              transform: `translateX(${offsetX}px) translateY(${y}px)`,
              zIndex: index,
            }}
            className={cn(
              isHovered && "grayscale-0",
              !isTop && !isHovered && "grayscale-[60%]"
            )}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative">
              {child}
              {showOverlay && (
                <div className="absolute inset-0 bg-background/40 rounded-xl transition-opacity duration-500 pointer-events-none" />
              )}
            </div>
          </StackedCard>
        );
      })}
    </div>
  );
}
