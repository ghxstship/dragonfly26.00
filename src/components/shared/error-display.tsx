'use client'

import { AlertTriangle, Home, RefreshCw, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface ErrorDisplayProps {
  title: string
  description: string
  errorCode?: string | number
  actions?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost'
    icon?: React.ReactNode
  }[]
  showIcon?: boolean
  technicalDetails?: string
}

export function ErrorDisplay({
  title,
  description,
  errorCode,
  actions = [],
  showIcon = true,
  technicalDetails,
}: ErrorDisplayProps) {
  return (
    <div className="min-h-screen flex flex-wrap items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl px-4 sm:px-6 lg:px-8 w-full max-w-full"
      >
        <div className="text-center space-y-3 md:space-y-4 lg:space-y-6">
          {/* Error Icon */}
          {showIcon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute sm:relative sm:inset-auto inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse sm:relative sm:inset-auto" />
                <div className="relative bg-primary/10 p-4 sm:p-6 rounded-full">
                  <AlertTriangle aria-hidden="true" className="w-16 h-16 text-primary" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Code */}
          {errorCode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm font-mono text-muted-foreground"
            >
              Error {errorCode}
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl lg:text-3xl md:text-2xl md:text-3xl lg:text-4xl lg:text-4xl font-bold tracking-tight"
          >
            {title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-muted-foreground max-w-md mx-auto"
          >
            {description}
          </motion.p>

          {/* Actions */}
          {actions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3 justify-center pt-4"
            >
              {actions.map((action: any, index: number) => (
                <Button
                  key={index}
                  onClick={action.onClick}
                  variant={action.variant || 'default'}
                  size="lg"
                  className="gap-2"
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </motion.div>
          )}

          {/* Technical Details */}
          {technicalDetails && (
            <motion.details
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-4 md:mt-6 lg:mt-8 text-left"
            >
              <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                Technical Details
              </summary>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap break-words font-mono">
                  {technicalDetails}
                </pre>
              </div>
            </motion.details>
          )}
        </div>
      </motion.div>
    </div>
  )
}
