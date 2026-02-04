'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useThemedClasses } from '@/hooks/useThemedClasses'

type GlitchSize = 'sm' | 'md' | 'lg'

interface GlitchTextProps {
  text: string
  size?: GlitchSize
  className?: string
  glitchInterval?: number
}

const sizeClasses: Record<GlitchSize, string> = {
  sm: 'text-2xl md:text-3xl',
  md: 'text-4xl md:text-5xl',
  lg: 'text-5xl md:text-6xl lg:text-7xl'
}

export default function GlitchText({
  text,
  size = 'md',
  className,
  glitchInterval = 3000
}: GlitchTextProps) {
  const [glitching, setGlitching] = useState(false)
  const [glitchText, setGlitchText] = useState(text)
  const { getThemeClass } = useThemedClasses()

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true)
      
      setTimeout(() => {
        setGlitching(false)
      }, 200)
    }, glitchInterval)

    return () => clearInterval(interval)
  }, [glitchInterval])

  const generateGlitchChars = (str: string): string => {
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~'
    return str
      .split('')
      .map(char => {
        if (char === ' ') return ' '
        if (Math.random() > 0.5) return chars[Math.floor(Math.random() * chars.length)]
        return char
      })
      .join('')
  }

  useEffect(() => {
    if (glitching) {
      setGlitchText(generateGlitchChars(text))
      
      const glitchInterval = setInterval(() => {
        setGlitchText(generateGlitchChars(text))
      }, 50)

      setTimeout(() => {
        clearInterval(glitchInterval)
        setGlitchText(text)
      }, 200)

      return () => clearInterval(glitchInterval)
    }
  }, [glitching, text])

  return (
    <span
      className={cn(
        'relative inline-block font-display font-bold',
        sizeClasses[size],
        getThemeClass('text-white', 'text-gray-900'),
        className
      )}
      style={{
        textShadow: glitching
          ? `2px 0 var(--tech-cyan), -2px 0 var(--tech-pink)`
          : 'none'
      }}
    >
      {glitchText}
      
      {glitching && (
        <>
          <span
            className="absolute top-0 left-0 w-full h-full"
            style={{
              color: 'var(--tech-cyan)',
              transform: 'translate(2px, 0)',
              opacity: 0.8
            }}
            aria-hidden="true"
          >
            {glitchText}
          </span>
          <span
            className="absolute top-0 left-0 w-full h-full"
            style={{
              color: 'var(--tech-pink)',
              transform: 'translate(-2px, 0)',
              opacity: 0.8
            }}
            aria-hidden="true"
          >
            {glitchText}
          </span>
        </>
      )}
    </span>
  )
}
