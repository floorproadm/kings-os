"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  className?: string;
  number?: string;
  title?: string;
  content?: string;
  onHover?: () => void;
  onLeave?: () => void;
  isActive?: boolean;
  onTap?: () => void;
}

function TestimonialCard({
  className,
  number = "01",
  title = "Step Title",
  content = "Step description goes here.",
  onHover,
  onLeave,
  isActive,
  onTap,
}: TestimonialCardProps) {
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice && !isActive) {
      e.preventDefault();
      onTap?.();
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border/30 bg-card p-6 transition-all duration-500 cursor-pointer shadow-lg",
        className
      )}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={handleClick}
      onTouchEnd={handleClick}
    >
      <div className="flex gap-6 items-start">
        <div className="text-3xl font-display font-bold text-gold/30">{number}</div>
        <div>
          <h3 className="font-display font-bold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{content}</p>
        </div>
      </div>
    </div>
  );
}

interface StackedCardsProps {
  cards?: { number: string; title: string; content: string }[];
}

export default function StackedCards({ cards }: StackedCardsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const focusedIndex = hoveredIndex ?? activeIndex;

  const getCardClassName = (index: number, baseClassName: string) => {
    if (focusedIndex === 0 && index === 1) {
      return baseClassName + " !translate-y-16 sm:!translate-y-24 !translate-x-10 sm:!translate-x-16";
    }
    if (focusedIndex === 0 && index === 2) {
      return baseClassName + " !translate-y-24 sm:!translate-y-36 !translate-x-16 sm:!translate-x-28";
    }
    if (focusedIndex === 1 && index === 2) {
      return baseClassName + " !translate-y-20 sm:!translate-y-32 !translate-x-16 sm:!translate-x-28";
    }
    return baseClassName;
  };

  const handleTap = (index: number) => {
    if (activeIndex === index) return;
    setActiveIndex(index);
  };

  const defaultClassNames = [
    "[grid-area:stack] hover:-translate-y-6 before:absolute before:w-full before:rounded-2xl before:outline-1 before:outline-border before:h-full before:content-[''] before:bg-blend-overlay before:bg-background/60 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0",
    "[grid-area:stack] translate-x-6 sm:translate-x-10 translate-y-4 sm:translate-y-7 hover:-translate-y-1 before:absolute before:w-full before:rounded-2xl before:outline-1 before:outline-border before:h-full before:content-[''] before:bg-blend-overlay before:bg-background/60 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0",
    "[grid-area:stack] translate-x-12 sm:translate-x-20 translate-y-8 sm:translate-y-14 hover:translate-y-4 sm:hover:translate-y-8",
  ];

  const displayCards = cards || [];

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center">
      {displayCards.map((card, index) => (
        <TestimonialCard
          key={index}
          className={getCardClassName(index, defaultClassNames[index] || defaultClassNames[2])}
          number={card.number}
          title={card.title}
          content={card.content}
          onHover={() => setHoveredIndex(index)}
          onLeave={() => setHoveredIndex(null)}
          isActive={activeIndex === index}
          onTap={() => handleTap(index)}
        />
      ))}
    </div>
  );
}

export { TestimonialCard, StackedCards };
export type { TestimonialCardProps, StackedCardsProps };
