'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = Math.min((scrollTop / docHeight) * 100, 100)

      setProgress(scrollProgress)

      if (scrollTop > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const circumference = 2 * Math.PI * 22
  const offset = circumference - (progress / 100) * circumference

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-6 right-6 z-50 flex items-center justify-center',
        'transition-all duration-300 ease-out',
        'hover:scale-110 active:scale-95',
        !isVisible && 'opacity-0 translate-y-4 pointer-events-none',
        isVisible && 'opacity-100 translate-y-0'
      )}
      aria-label="回到顶部"
    >
      <div className="relative">
        <svg
          width={60}
          height={60}
          className="transform -rotate-90"
          viewBox="0 0 60 60"
        >
          <circle
            cx="30"
            cy="30"
            r="22"
            stroke="rgba(15, 23, 42, 0.1)"
            strokeWidth="3"
            fill="none"
          />
          <circle
            cx="30"
            cy="30"
            r="22"
            stroke="url(#gradient)"
            strokeWidth="3"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-150 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-glass/30 backdrop-blur-xl rounded-full w-12 h-12 flex items-center justify-center border border-glass-border shadow-lg">
            <ArrowUp className="w-5 h-5 text-tech-cyan" />
          </div>
        </div>
      </div>
    </button>
  )
}
