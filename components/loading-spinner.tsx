/**
 * Custom loading spinner component with glassmorphism design.
 *
 * This component provides various loading states with beautiful animations
 * that match the overall glassmorphism aesthetic of the application.
 */
"use client"

import { Leaf } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "dots" | "pulse" | "leaf"
  className?: string
}

/**
 * Default spinning loader with glassmorphism styling.
 */
function DefaultSpinner({ size = "md", className = "" }: { size: string; className: string }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  }

  return (
    <div
      className={`animate-spin rounded-full border-primary border-t-transparent ${sizeClasses[size as keyof typeof sizeClasses]} ${className}`}
    />
  )
}

/**
 * Animated dots loader with glassmorphism effect.
 */
function DotsSpinner({ size = "md", className = "" }: { size: string; className: string }) {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  }

  const dotClass = `${sizeClasses[size as keyof typeof sizeClasses]} bg-primary rounded-full`

  return (
    <div className={`flex space-x-1 ${className}`}>
      <div className={`${dotClass} animate-bounce`} style={{ animationDelay: "0ms" }} />
      <div className={`${dotClass} animate-bounce`} style={{ animationDelay: "150ms" }} />
      <div className={`${dotClass} animate-bounce`} style={{ animationDelay: "300ms" }} />
    </div>
  )
}

/**
 * Pulsing loader with glassmorphism glow effect.
 */
function PulseSpinner({ size = "md", className = "" }: { size: string; className: string }) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  }

  return (
    <div
      className={`${sizeClasses[size as keyof typeof sizeClasses]} backdrop-blur-md bg-card/60 border border-border/20 shadow-lg rounded-full animate-pulse-glow ${className}`}
    />
  )
}

/**
 * Leaf-themed spinner for sustainability context.
 */
function LeafSpinner({ size = "md", className = "" }: { size: string; className: string }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div className={`${className}`}>
      <Leaf className={`${sizeClasses[size as keyof typeof sizeClasses]} text-primary animate-wiggle`} />
    </div>
  )
}

/**
 * Main loading spinner component with multiple variants.
 */
export function LoadingSpinner({ size = "md", variant = "default", className = "" }: LoadingSpinnerProps) {
  switch (variant) {
    case "dots":
      return <DotsSpinner size={size} className={className} />
    case "pulse":
      return <PulseSpinner size={size} className={className} />
    case "leaf":
      return <LeafSpinner size={size} className={className} />
    default:
      return <DefaultSpinner size={size} className={className} />
  }
}

/**
 * Full-screen loading overlay with glassmorphism backdrop.
 */
export function LoadingOverlay({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="backdrop-blur-md bg-card/80 border border-border/20 shadow-xl rounded-2xl p-8 text-center animate-fade-in-scale">
        <LoadingSpinner size="lg" variant="leaf" className="mx-auto mb-4" />
        <p className="text-foreground font-medium">{message}</p>
      </div>
    </div>
  )
}
