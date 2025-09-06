/**
 * Interactive background component with animated elements.
 *
 * This component creates a dynamic background with floating elements
 * that respond to user interactions and provide visual interest.
 */
"use client"

import { useState, useEffect, useRef } from "react"
import { Leaf, Droplets, Sun, Wind } from "lucide-react"

interface FloatingElement {
  id: number
  x: number
  y: number
  size: number
  speed: number
  icon: "leaf" | "droplet" | "sun" | "wind"
  opacity: number
  rotation: number
}

/**
 * Interactive background with floating sustainability-themed elements.
 */
export function InteractiveBackground() {
  const [elements, setElements] = useState<FloatingElement[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  /**
   * Initialize floating elements with random properties.
   */
  useEffect(() => {
    const icons: Array<"leaf" | "droplet" | "sun" | "wind"> = ["leaf", "droplet", "sun", "wind"]
    const newElements: FloatingElement[] = []

    for (let i = 0; i < 12; i++) {
      newElements.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 15,
        speed: Math.random() * 0.5 + 0.2,
        icon: icons[Math.floor(Math.random() * icons.length)],
        opacity: Math.random() * 0.3 + 0.1,
        rotation: Math.random() * 360,
      })
    }

    setElements(newElements)
  }, [])

  /**
   * Track mouse position for interactive effects.
   */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  /**
   * Animate floating elements continuously.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setElements((prev) =>
        prev.map((element) => ({
          ...element,
          y: (element.y + element.speed) % 110,
          rotation: (element.rotation + 0.5) % 360,
        })),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  /**
   * Render icon based on element type.
   */
  const renderIcon = (element: FloatingElement) => {
    const iconProps = {
      size: element.size,
      style: {
        opacity: element.opacity,
        transform: `rotate(${element.rotation}deg)`,
        color: `hsl(${element.id * 30}, 50%, 60%)`,
      },
      className: "transition-all duration-300 ease-out",
    }

    switch (element.icon) {
      case "droplet":
        return <Droplets {...iconProps} />
      case "sun":
        return <Sun {...iconProps} />
      case "wind":
        return <Wind {...iconProps} />
      default:
        return <Leaf {...iconProps} />
    }
  }

  /**
   * Calculate distance-based effects from mouse position.
   */
  const getElementStyle = (element: FloatingElement) => {
    const distance = Math.sqrt(Math.pow(element.x - mousePosition.x, 2) + Math.pow(element.y - mousePosition.y, 2))
    const maxDistance = 50
    const influence = Math.max(0, 1 - distance / maxDistance)

    return {
      left: `${element.x}%`,
      top: `${element.y}%`,
      transform: `translate(-50%, -50%) scale(${1 + influence * 0.3})`,
      transition: "transform 0.3s ease-out",
    }
  }

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

      {/* Floating elements */}
      {elements.map((element) => (
        <div key={element.id} className="absolute" style={getElementStyle(element)}>
          {renderIcon(element)}
        </div>
      ))}

      {/* Interactive glow effect following mouse */}
      <div
        className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl transition-all duration-700 ease-out"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  )
}
