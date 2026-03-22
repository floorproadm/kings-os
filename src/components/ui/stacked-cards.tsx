"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface StackedCardProps {
  className?: string;
  children: React.ReactNode;
  onHover?: () => void;
  onLeave?: () => void;
  isActive?: boolean;
  onTap?: () => void;
}

function StackedCard({
  className,
  children,
  onHover,
  onLeave,
  isActive,
  onTap,
}: StackedCardProps) {
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice && !isActive) {
      e.preventDefault();
      onTap?.();
    }
  };

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] cursor-pointer",
        className
      )}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={handleClick}
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const getCardClassName = (index: number, total: number) => {
    const focusedIndex = hoveredIndex ?? activeIndex;
    const offsetX = index * 12;
    const offsetY = index * 24;

    let extra = "";

    // When a back card is focused, push cards in front further out
    if (focusedIndex !== null && focusedIndex < index) {
      const push = (index - focusedIndex) * 16;
      extra = ` !translate-y-[${offsetY + push}px]`;
    }

    const base = `[grid-area:stack]`;
    const isTop = index === total - 1;

    if (isTop) {
      return cn(
        base,
        `translate-x-[${offsetX}px] translate-y-[${offsetY}px]`,
        focusedIndex !== null && focusedIndex < index
          ? "!translate-y-[" + (offsetY + 20) + "px]"
          : "hover:translate-y-[" + (offsetY - 8) + "px]"
      );
    }

    return cn(
      base,
      "before:absolute before:w-full before:h-full before:content-[''] before:bg-background/50 before:rounded-xl before:left-0 before:top-0 before:transition-opacity before:duration-500",
      "grayscale-[80%] hover:before:opacity-0 hover:grayscale-0",
      `hover:-translate-y-2`
    );
  };

  return (
    <div className={cn("grid place-items-start", className)}>
      {children.map((child, index) => (
        <StackedCard
          key={index}
          className={getCardClassName(index, children.length)}
          onHover={() => setHoveredIndex(index)}
          onLeave={() => setHoveredIndex(null)}
          isActive={activeIndex === index}
          onTap={() => setActiveIndex(index)}
          style={{
            transform: `translateX(${index * 12}px) translateY(${
              hoveredIndex !== null && hoveredIndex < index
                ? index * 24 + 20
                : hoveredIndex === index
                ? index * 24 - 8
                : index * 24
            }px)`,
            zIndex: index,
          } as React.CSSProperties}
        >
          {child}
        </StackedCard>
      ))}
    </div>
  );
}

export { StackedCard };
