/**
 * Success animation component for celebrating user actions.
 *
 * This component provides delightful success animations that enhance
 * user feedback when actions are completed successfully.
 */
"use client"

import { useState, useEffect } from "react"
import { Check, Award, Sparkles, Heart } from "lucide-react"

interface SuccessAnimationProps {
  show: boolean
  onComplete?: () => void
  variant?: "check" | "award" | "sparkles" | "heart"
  message?: string
  duration?: number
}

/**
 * Animated checkmark success indicator.
 */
function CheckAnimation() {
  return (
    <div className="relative">
      <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center animate-bounce-in">
        <Check className="h-8 w-8 text-primary-foreground animate-fade-in-scale" />
      </div>
      <div className="absolute inset-0 h-16 w-16 bg-primary/30 rounded-full animate-ping" />
    </div>
  )
}

/**
 * Animated award success indicator.
 */
function AwardAnimation() {
  return (
    <div className="relative">
      <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center animate-bounce-in">
        <Award className="h-8 w-8 text-secondary-foreground animate-heartbeat" />
      </div>
      <div className="absolute inset-0 h-16 w-16 bg-secondary/30 rounded-full animate-pulse-glow" />
    </div>
  )
}

/**
 * Animated sparkles success indicator.
 */
function SparklesAnimation() {
  return (
    <div className="relative">
      <div className="h-16 w-16 bg-accent rounded-full flex items-center justify-center animate-bounce-in">
        <Sparkles className="h-8 w-8 text-accent-foreground animate-wiggle" />
      </div>
      {/* Floating sparkle effects */}
      <div className="absolute -top-2 -right-2 h-4 w-4 bg-accent/60 rounded-full animate-float" />
      <div className="absolute -bottom-2 -left-2 h-3 w-3 bg-accent/40 rounded-full animate-float-delayed" />
      <div className="absolute top-0 left-0 h-2 w-2 bg-accent/80 rounded-full animate-float-slow" />
    </div>
  )
}

/**
 * Animated heart success indicator.
 */
function HeartAnimation() {
  return (
    <div className="relative">
      <div className="h-16 w-16 bg-red-500 rounded-full flex items-center justify-center animate-bounce-in">
        <Heart className="h-8 w-8 text-white fill-current animate-heartbeat" />
      </div>
      <div className="absolute inset-0 h-16 w-16 bg-red-500/30 rounded-full animate-pulse" />
    </div>
  )
}

/**
 * Main success animation component with glassmorphism overlay.
 */
export function SuccessAnimation({
  show,
  onComplete,
  variant = "check",
  message = "Success!",
  duration = 2000,
}: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [show, duration, onComplete])

  if (!isVisible) return null

  const renderAnimation = () => {
    switch (variant) {
      case "award":
        return <AwardAnimation />
      case "sparkles":
        return <SparklesAnimation />
      case "heart":
        return <HeartAnimation />
      default:
        return <CheckAnimation />
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm animate-fade-in-scale">
      <div className="backdrop-blur-md bg-card/80 border border-border/20 shadow-xl rounded-2xl p-8 text-center animate-bounce-in">
        <div className="mb-4 flex justify-center">{renderAnimation()}</div>
        <h3 className="text-xl font-semibold text-foreground mb-2 animate-slide-in-up">{message}</h3>
        <p className="text-muted-foreground animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
          Great job on your sustainability action!
        </p>
      </div>
    </div>
  )
}

/**
 * Inline success indicator for smaller celebrations.
 */
export function InlineSuccessIndicator({ show, message }: { show: boolean; message?: string }) {
  if (!show) return null

  return (
    <div className="flex items-center gap-2 text-primary animate-slide-in-right">
      <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center animate-bounce-in">
        <Check className="h-3 w-3 text-primary-foreground" />
      </div>
      {message && <span className="text-sm font-medium">{message}</span>}
    </div>
  )
}
