import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Feature {
  step: string
  title?: string
  content: string
}

interface FeatureStepsProps {
  features: Feature[]
  className?: string
  autoPlayInterval?: number
}

export function FeatureSteps({
  features,
  className,
  autoPlayInterval = 3000,
}: FeatureStepsProps) {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoPlayInterval / 100))
      } else {
        setCurrentFeature((prev) => (prev + 1) % features.length)
        setProgress(0)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [progress, features.length, autoPlayInterval])

  return (
    <div className={cn("space-y-3", className)}>
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className={cn(
            "flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-colors duration-300 border",
            index === currentFeature
              ? "bg-gold/5 border-gold/20"
              : "bg-card/50 border-border/20 hover:bg-card/80"
          )}
          onClick={() => {
            setCurrentFeature(index)
            setProgress(0)
          }}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold transition-colors duration-300",
              index <= currentFeature
                ? "bg-gold/20 text-gold"
                : "bg-muted text-muted-foreground"
            )}
          >
            {index <= currentFeature ? (
              <span>✓</span>
            ) : (
              <span>{index + 1}</span>
            )}
          </div>

          <div className="flex-1">
            <h3
              className={cn(
                "font-display font-bold mb-1 transition-colors duration-300",
                index === currentFeature
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {feature.title || feature.step}
            </h3>

            <AnimatePresence mode="wait">
              {index === currentFeature && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-muted-foreground"
                >
                  {feature.content}
                </motion.p>
              )}
            </AnimatePresence>

            {index === currentFeature && (
              <div className="mt-2 h-0.5 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gold rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
