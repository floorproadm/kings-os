import { useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

interface RevealCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  overlay: React.ReactNode;
}

export function RevealCard({ children, overlay, className, ...rest }: RevealCardProps) {
  const holderRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const startClip = "circle(0% at 50% 50%)";
  const expandClip = "circle(150% at 50% 50%)";

  useGSAP(() => {
    gsap.set(overlayRef.current, { clipPath: startClip });
  }, { scope: holderRef });

  const reveal = () => {
    gsap.to(overlayRef.current, {
      clipPath: expandClip,
      duration: 0.8,
      ease: "expo.inOut",
    });
  };

  const conceal = () => {
    gsap.to(overlayRef.current, {
      clipPath: startClip,
      duration: 1,
      ease: "expo.out(1, 1)",
    });
  };

  return (
    <div
      ref={holderRef}
      onMouseEnter={reveal}
      onMouseLeave={conceal}
      className={cn("relative overflow-hidden", className)}
      {...rest}
    >
      <div className="relative z-0">{children}</div>
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10"
      >
        {overlay}
      </div>
    </div>
  );
}
