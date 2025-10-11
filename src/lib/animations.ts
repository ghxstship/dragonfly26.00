import { Variants } from "framer-motion"

/**
 * Premium microanimation variants for consistent, luxurious interactions
 * Using spring physics and elegant easing for high-end feel
 */

// Elegant spring configuration
export const elegantSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
  mass: 0.8,
}

// Smooth easing
export const smoothEase = {
  type: "tween" as const,
  ease: [0.4, 0, 0.2, 1],
  duration: 0.3,
}

// Quick response for interactive elements
export const quickSpring = {
  type: "spring" as const,
  stiffness: 500,
  damping: 35,
}

// Subtle float effect
export const floatAnimation = {
  y: [0, -4, 0],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
}

// Scale and fade variants
export const scaleVariants: Variants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: elegantSpring,
  },
  exit: { 
    scale: 0.95, 
    opacity: 0,
    transition: { duration: 0.15 },
  },
}

// Slide variants
export const slideVariants = {
  fromLeft: {
    initial: { x: -20, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: smoothEase,
    },
    exit: { x: -20, opacity: 0 },
  },
  fromRight: {
    initial: { x: 20, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: smoothEase,
    },
    exit: { x: 20, opacity: 0 },
  },
  fromTop: {
    initial: { y: -20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: smoothEase,
    },
    exit: { y: -20, opacity: 0 },
  },
  fromBottom: {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: smoothEase,
    },
    exit: { y: 20, opacity: 0 },
  },
}

// Button interaction variants
export const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: quickSpring,
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 },
  },
}

// Card hover variants
export const cardVariants: Variants = {
  initial: { 
    scale: 1,
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  },
  hover: { 
    scale: 1.01,
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

// List item stagger
export const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

export const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: smoothEase,
  },
}

// Modal/Dialog variants
export const modalVariants: Variants = {
  initial: { 
    scale: 0.95, 
    opacity: 0,
    y: 10,
  },
  animate: { 
    scale: 1, 
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 40,
    },
  },
  exit: { 
    scale: 0.95, 
    opacity: 0,
    y: 10,
    transition: { duration: 0.2 },
  },
}

// Overlay variants
export const overlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

// Dropdown menu variants
export const dropdownVariants: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.95,
    y: -5,
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: -5,
    transition: { duration: 0.1 },
  },
}

// Toast notification variants
export const toastVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: -20,
    scale: 0.95,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 35,
    },
  },
  exit: { 
    opacity: 0, 
    x: 100,
    transition: { duration: 0.2 },
  },
}

// Input focus variants
export const inputVariants = {
  initial: { scale: 1 },
  focus: { 
    scale: 1.01,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

// Page transition variants
export const pageVariants: Variants = {
  initial: { 
    opacity: 0,
    y: 10,
  },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: { 
    opacity: 0,
    y: -10,
    transition: { duration: 0.3 },
  },
}

// Skeleton loading shimmer
export const shimmerVariants: Variants = {
  initial: { backgroundPosition: "-200% 0" },
  animate: {
    backgroundPosition: "200% 0",
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
}

// Icon rotation on hover
export const iconRotateVariants: Variants = {
  initial: { rotate: 0 },
  hover: { 
    rotate: 15,
    transition: { duration: 0.2 },
  },
}

// Badge pulse
export const badgePulseVariants: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

/**
 * Utility function to create stagger animation for children
 */
export const createStaggerContainer = (staggerDelay = 0.05, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
})

/**
 * Utility function for smooth height animations
 */
export const heightVariants = {
  collapsed: { 
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.2 },
    },
  },
  expanded: { 
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.2, delay: 0.1 },
    },
  },
}
