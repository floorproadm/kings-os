"use client";

import React from "react";

interface GradientBlobCardProps {
  children?: React.ReactNode;
  className?: string;
}

const GradientBlobCard: React.FC<GradientBlobCardProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* Glassy Background */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Animated Gradient Blob (brand gold colors) */}
      <div
        className="absolute -inset-[100%] animate-blob opacity-30"
        style={{
          background:
            "conic-gradient(from 0deg, hsl(var(--gold-light)), hsl(var(--gold)), hsl(var(--gold-dark)), hsl(var(--gold-light)))",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(-100%, -100%) rotate(0deg); }
          25% { transform: translate(0%, -100%) rotate(90deg); }
          50% { transform: translate(0%, 0%) rotate(180deg); }
          75% { transform: translate(-100%, 0%) rotate(270deg); }
          100% { transform: translate(-100%, -100%) rotate(360deg); }
        }
        .animate-blob {
          animation: blob 5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default GradientBlobCard;
