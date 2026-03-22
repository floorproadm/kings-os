import React from "react";

interface GradientBlobCardProps {
  children?: React.ReactNode;
  className?: string;
}

const GradientBlobCard: React.FC<GradientBlobCardProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative rounded-xl p-[1.5px] overflow-hidden ${className}`}>
      {/* Animated border gradient */}
      <div
        className="absolute -inset-[100%] animate-border-spin"
        style={{
          background:
            "conic-gradient(from 0deg, hsl(var(--gold-dark)), hsl(var(--gold-light)), hsl(var(--gold)), hsl(var(--gold-dark)))",
        }}
      />

      {/* Inner card background */}
      <div className="relative z-10 rounded-[10px] bg-dark-elevated">
        {children}
      </div>

      <style>{`
        @keyframes border-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-border-spin {
          animation: border-spin 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default GradientBlobCard;
