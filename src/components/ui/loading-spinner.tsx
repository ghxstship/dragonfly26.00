"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

/**
 * Elegant loading spinner with smooth rotation animation
 */
export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
  }

  return (
    <motion.div
      className={cn("inline-flex items-center justify-center", className)}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <Loader2 size={sizes[size]} className="text-primary" />
    </motion.div>
  )
}

interface PulseLoaderProps {
  className?: string
}

/**
 * Three-dot pulse loader animation
 */
export function PulseLoader({ className }: PulseLoaderProps) {
  const dotVariants = {
    initial: { scale: 0.8, opacity: 0.5 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  }

  return (
    <div className={cn("flex gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-primary"
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: i * 0.2 }}
        />
      ))}
    </div>
  )
}

interface SkeletonProps {
  className?: string
}

/**
 * Skeleton loader with shimmer effect
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]",
        className
      )}
    />
  )
}

interface ProgressBarProps {
  className?: string
  indeterminate?: boolean
}

/**
 * Animated progress bar
 */
export function ProgressBar({ className, indeterminate = true }: ProgressBarProps) {
  if (indeterminate) {
    return (
      <div className={cn("relative h-1 w-full overflow-hidden rounded-full bg-muted", className)}>
        <motion.div
          className="absolute h-full w-1/3 bg-primary"
          animate={{
            x: ["-100%", "300%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    )
  }

  return null
}
