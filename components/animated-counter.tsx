/**
 * Animated counter component for displaying numbers with smooth transitions.
 *
 * This component provides smooth counting animations for statistics and metrics,
 * enhancing the visual appeal of numerical data presentation.
 */
"use client"

import { useState, useEffect, useRef } from "react"

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
}

/**
 * Custom hook for animating number values with easing.
 */
function useAnimatedCounter(targetValue: number, duration = 1000) {
  const [currentValue, setCurrentValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>()
  const startValueRef = useRef<number>(0)

  useEffect(() => {
    if (targetValue === currentValue) return

    setIsAnimating(true)
    startValueRef.current = currentValue
    startTimeRef.current = Date.now()

    const animate = () => {
      const now = Date.now()
      const elapsed = now - (startTimeRef.current || 0)
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
      const easedProgress = easeOutCubic(progress)

      const newValue = startValueRef.current + (targetValue - startValueRef.current) * easedProgress
      setCurrentValue(newValue)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setCurrentValue(targetValue)
        setIsAnimating(false)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [targetValue, duration, currentValue])

  return { currentValue, isAnimating }
}

/**
 * Animated counter component with glassmorphism styling.
 */
export function AnimatedCounter({
  value,
  duration = 1000,
  className = "",
  prefix = "",
  suffix = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const { currentValue, isAnimating } = useAnimatedCounter(value, duration)

  const formatValue = (num: number) => {
    return num.toFixed(decimals)
  }

  return (
    <span className={`${className} ${isAnimating ? "animate-count-up" : ""}`}>
      {prefix}
      {formatValue(currentValue)}
      {suffix}
    </span>
  )
}
