"use client"

import * as React from "react"
import { HTMLMotionProps, MotionConfig, motion } from "motion/react"
import { cn } from "@/lib/utils"

interface TextStaggerHoverProps {
  text: string
  index: number
}
interface HoverSliderImageProps {
  index: number
  imageUrl: string
}
interface HoverSliderProps {}
interface HoverSliderContextValue {
  activeSlide: number
  changeSlide: (index: number) => void
}
function splitText(text: string) {
  const words = text.split(" ").map((word) => word.concat(" "))
  const characters = words.map((word) => word.split("")).flat(1)

  return {
    words,
    characters,
  }
}

const HoverSliderContext = React.createContext<
  HoverSliderContextValue | undefined
>(undefined)
function useHoverSliderContext() {
  const context = React.useContext(HoverSliderContext)
  if (context === undefined) {
    throw new Error(
      "useHoverSliderContext must be used within a HoverSliderProvider"
    )
  }
  return context
}

export const HoverSlider = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & HoverSliderProps
>(({ children, className, ...props }, ref) => {
  const [activeSlide, setActiveSlide] = React.useState(0)
  const changeSlide = React.useCallback(
    (index: number) => setActiveSlide(index),
    [setActiveSlide]
  )
  return (
    <HoverSliderContext.Provider value={{ activeSlide, changeSlide }}>
      <MotionConfig transition={{ duration: 0.5, ease: "easeInOut" }}>
        <section ref={ref} className={cn("", className)} {...props}>
          {children}
        </section>
      </MotionConfig>
    </HoverSliderContext.Provider>
  )
})
HoverSlider.displayName = "HoverSlider"

const WordStaggerHover = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ children, className, ...props }, ref) => {
  return (
    <span ref={ref} className={cn("inline-flex", className)} {...props}>
      {children}
    </span>
  )
})
WordStaggerHover.displayName = "WordStaggerHover"

export const TextStaggerHover = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & TextStaggerHoverProps
>(({ text, index, children, className, ...props }, ref) => {
  const { activeSlide, changeSlide } = useHoverSliderContext()
  const { characters } = splitText(text)
  const isActive = activeSlide === index
  const handleMouse = () => changeSlide(index)
  return (
    <motion.p
      ref={ref}
      onMouseEnter={handleMouse}
      className={cn(
        "flex flex-wrap cursor-pointer transition-opacity duration-300",
        isActive ? "opacity-100" : "opacity-40",
        className
      )}
      {...props}
    >
      {characters.map((char, index) => (
        <WordStaggerHover key={index}>
          <span className="relative inline-flex overflow-hidden">
            <motion.span
              className="inline-flex"
              animate={isActive ? { y: "-100%" } : { y: "0%" }}
              transition={{ delay: index * 0.025 }}
            >
              {char}
              {char === " " && index < characters.length - 1 && <>&nbsp;</>}
            </motion.span>

            <motion.span
              className="absolute top-full inline-flex"
              animate={isActive ? { y: "-100%" } : { y: "0%" }}
              transition={{ delay: index * 0.025 }}
            >
              {char}
            </motion.span>
          </span>
        </WordStaggerHover>
      ))}
    </motion.p>
  )
})
TextStaggerHover.displayName = "TextStaggerHover"

export const clipPathVariants = {
  visible: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  },
  hidden: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0px)",
  },
}
export const HoverSliderImageWrap = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "grid [&>*]:col-start-1 [&>*]:col-end-1 [&>*]:row-start-1 [&>*]:row-end-1 [&>*]:size-full",
        className
      )}
      {...props}
    />
  )
})
HoverSliderImageWrap.displayName = "HoverSliderImageWrap"

export const HoverSliderImage = React.forwardRef<
  HTMLImageElement,
  HTMLMotionProps<"img"> & HoverSliderImageProps
>(({ index, imageUrl, children, className, ...props }, ref) => {
  const { activeSlide } = useHoverSliderContext()
  return (
    <motion.img
      ref={ref}
      src={imageUrl}
      variants={clipPathVariants}
      animate={activeSlide === index ? "visible" : "hidden"}
      className={cn("object-cover", className)}
      {...props}
    />
  )
})
HoverSliderImage.displayName = "HoverSliderImage"
