"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { pageVariants } from "@/lib/animations"

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

/**
 * Page transition wrapper component for smooth page changes
 * Applies elegant fade and slide animations to page content
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

/**
 * Container that staggers the animation of its children
 * Perfect for lists or grids that need sequential animations
 */
export function StaggerContainer({ 
  children, 
  className,
  staggerDelay = 0.05 
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
}

/**
 * Item to be used within StaggerContainer
 * Automatically animates when container becomes visible
 */
export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

/**
 * Simple fade-in animation wrapper
 */
export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.3,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface ScaleInProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

/**
 * Scale-in animation wrapper with fade
 */
export function ScaleIn({ children, className, delay = 0 }: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        duration: 0.2,
        delay,
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface SlideInProps {
  children: React.ReactNode
  className?: string
  direction?: "left" | "right" | "top" | "bottom"
  delay?: number
}

/**
 * Slide-in animation from specified direction
 */
export function SlideIn({ 
  children, 
  className, 
  direction = "bottom",
  delay = 0 
}: SlideInProps) {
  const directions = {
    left: { x: -20, y: 0 },
    right: { x: 20, y: 0 },
    top: { y: -20, x: 0 },
    bottom: { y: 20, x: 0 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, ...directions[direction] }}
      transition={{ 
        duration: 0.3,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * AnimatePresence wrapper for exit animations
 */
export { AnimatePresence }
