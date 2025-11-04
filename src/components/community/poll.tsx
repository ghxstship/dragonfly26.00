"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Check, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface PollProps {
  options: string[]
  votes?: Record<string, string[]> // { "option_0": ["user1", "user2"], "option_1": ["user3"] }
  onVote?: (optionIndex: number) => void
  expiresAt?: string | null
  allowMultiple?: boolean
  currentUserId?: string
  disabled?: boolean
  className?: string
}

export function Poll({
  options,
  votes = {},
  onVote,
  expiresAt,
  allowMultiple = false,
  currentUserId,
  disabled = false,
  className
}: PollProps) {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([])
  const [hasVoted, setHasVoted] = useState(false)

  // Check if poll has expired
  const isExpired = expiresAt ? new Date(expiresAt) < new Date() : false
  
  // Check if current user has already voted
  const userHasVoted = currentUserId 
    ? Object.values(votes).some(voters => voters.includes(currentUserId))
    : hasVoted

  // Calculate vote counts
  const voteCounts = options.map((_: any, index: number) => {
    const optionKey = `option_${index}`
    return votes[optionKey]?.length || 0
  })

  const totalVotes = voteCounts.reduce((sum: number, count) => sum + count, 0)

  // Calculate percentages
  const percentages = options.map((_: any, index: number) => {
    if (totalVotes === 0) return 0
    return Math.round((voteCounts[index] / totalVotes) * 100)
  })

  // Find winning option(s)
  const maxVotes = Math.max(...voteCounts)
  const winningIndices = voteCounts
    .map((count: any, index: number) => count === maxVotes ? index : -1)
    .filter(index => index !== -1)

  const handleVote = (optionIndex: number) => {
    if (disabled || isExpired || userHasVoted) return

    if (allowMultiple) {
      setSelectedOptions(prev => 
        prev.includes(optionIndex)
          ? prev.filter(i => i !== optionIndex)
          : [...prev, optionIndex]
      )
    } else {
      setSelectedOptions([optionIndex])
      // Auto-submit for single choice
      if (onVote) {
        onVote(optionIndex)
        setHasVoted(true)
      }
    }
  }

  const handleSubmit = async () => {
    if (selectedOptions.length > 0 && onVote && !userHasVoted) {
      selectedOptions.forEach(index => onVote(index))
      setHasVoted(true)
    }
  }

  const timeRemaining = () => {
    if (!expiresAt) return null
    
    const now = new Date()
    const expires = new Date(expiresAt)
    const diff = expires.getTime() - now.getTime()
    
    if (diff < 0) return "Ended"
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h left`
    if (hours > 0) return `${hours}h ${minutes}m left`
    return `${minutes}m left`
  }

  const showResults = userHasVoted || isExpired || totalVotes > 0

  return (
    <Card className={cn("p-4", className)}>
      {/* Header */}
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between mb-4">
        <Badge variant="secondary" className="text-xs">
          📊 Poll
        </Badge>
        {expiresAt && (
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {timeRemaining()}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2">
        {options.map((option: string, index: number) => {
          const isSelected = selectedOptions.includes(index)
          const isWinning = winningIndices.includes(index) && totalVotes > 0
          const userVotedThis = currentUserId 
            ? votes[`option_${index}`]?.includes(currentUserId)
            : false

          return (
            <div key={index} className="relative">
              {showResults ? (
                // Results view
                <div className="space-y-1">
                  <div className="relative">
                    <div 
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all",
                        isWinning && "border-primary bg-primary/5",
                        userVotedThis && "border-primary",
                        !isWinning && !userVotedThis && "border-border"
                      )}
                    >
                      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between relative z-10">
                        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 flex-1">
                          {userVotedThis && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                          <span className={cn(
                            "text-sm",
                            (isWinning || userVotedThis) && "font-semibold"
                          )}>
                            {option}
                          </span>
                        </div>
                        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                          <span className="text-sm font-semibold">
                            {percentages[index]}%
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({voteCounts[index]})
                          </span>
                        </div>
                      </div>
                      {/* Progress bar background */}
                      <div 
                        className={cn(
                          "absolute inset-0 rounded-lg transition-all",
                          isWinning ? "bg-primary/10" : "bg-muted/50"
                        )}
                        style={{ width: `${percentages[index]}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // Voting view
                <button
                  onClick={() => handleVote(index)}
                  disabled={disabled || isExpired}
                  className={cn(
                    "w-full p-3 rounded-lg border-2 text-left transition-all",
                    "hover:border-primary hover:bg-primary/5",
                    isSelected && "border-primary bg-primary/5",
                    !isSelected && "border-border",
                    (disabled || isExpired) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                      isSelected ? "border-primary" : "border-muted-foreground",
                      allowMultiple && "rounded-sm"
                    )}>
                      {isSelected && (
                        <div className={cn(
                          "w-2 h-2 bg-primary",
                          allowMultiple ? "rounded-sm" : "rounded-full"
                        )} />
                      )}
                    </div>
                    <span className="text-sm">{option}</span>
                  </div>
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Submit button for multiple choice */}
      {allowMultiple && !userHasVoted && !isExpired && (
        <Button 
          onClick={handleSubmit}
          disabled={selectedOptions.length === 0 || disabled}
          className="w-full mt-4 max-w-full"
          size="sm"
        >
          Submit Vote{selectedOptions.length > 0 ? ` (${selectedOptions.length})` : ''}
        </Button>
      )}

      {/* Footer */}
      <div className="mt-3 pt-3 border-t flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
        <span>
          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
        </span>
        {isExpired && (
          <Badge variant="destructive" className="text-xs">
            Poll Ended
          </Badge>
        )}
      </div>
    </Card>
  )
}
