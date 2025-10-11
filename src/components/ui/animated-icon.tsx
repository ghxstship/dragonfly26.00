"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnimatedIconProps {
  icon: LucideIcon
  size?: number
  animate?: "spin" | "bounce" | "pulse" | "rotate" | "scale" | "none"
  className?: string
}

/**
 * Animated icon wrapper for Lucide icons with premium microanimations
 */
export function AnimatedIcon({ 
  icon: Icon, 
  size = 16, 
  animate = "none",
  className,
}: AnimatedIconProps) {
  const animations = {
    spin: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      },
    },
    bounce: {
      y: [0, -4, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    rotate: {
      rotate: [0, 15, -15, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    scale: {
      scale: 1.1,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    none: {},
  }

  return (
    <motion.div
      className={cn("inline-flex items-center justify-center", className)}
      animate={animations[animate]}
      whileHover={animate === "none" ? { scale: 1.1 } : undefined}
    >
      <Icon size={size} />
    </motion.div>
  )
}

type InteractiveIconProps = Omit<HTMLMotionProps<"button">, "children"> & {
  icon: LucideIcon
  size?: number
}

/**
 * Interactive icon button with hover and tap animations
 */
export function InteractiveIcon({ 
  icon: Icon, 
  size = 16,
  className,
  ...props 
}: InteractiveIconProps) {
  return (
    <motion.button
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
      {...props}
    >
      <Icon size={size} />
    </motion.button>
  )
}

interface HoverRotateIconProps {
  icon: LucideIcon
  size?: number
  className?: string
  degrees?: number
}

/**
 * Icon that rotates on hover
 */
export function HoverRotateIcon({ 
  icon: Icon, 
  size = 16,
  className,
  degrees = 15,
}: HoverRotateIconProps) {
  return (
    <motion.div
      className={cn("inline-flex items-center justify-center", className)}
      whileHover={{ rotate: degrees }}
      transition={{ duration: 0.2 }}
    >
      <Icon size={size} />
    </motion.div>
  )
}
