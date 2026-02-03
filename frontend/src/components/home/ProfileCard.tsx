'use client'

import { useEffect, useRef, useState } from 'react'
import { FileText, Eye, Users, Activity, Globe } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

interface Stat {
  label: string
  value: number
  icon: React.ElementType
  progress?: number
  color?: string
}

export default function ProfileCard() {
  const stats: Stat[] = [
    { label: '文章', value: 105, icon: FileText, progress: 85, color: 'from-tech-cyan to-tech-sky' },
    { label: '访问量', value: 251383, icon: Eye, progress: 92, color: 'from-purple-500 to-pink-500' },
    { label: '友站', value: 12, icon: Users, progress: 60, color: 'from-green-500 to-emerald-500' }
  ]

  const [isVisible, setIsVisible] = useState(false)
  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: number }>({})
  const cardRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const startTime = performance.now()
    const duration = 2000

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)

      setAnimatedValues(prev => {
        const newValues: { [key: string]: number } = {}
        stats.forEach(stat => {
          newValues[stat.label] = Math.floor(stat.value * easeOutQuart)
        })
        return newValues
      })

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isVisible, stats])

  const [onlineUsers, setOnlineUsers] = useState(42)
  const [realTimeVisitors, setRealTimeVisitors] = useState(18)

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers((prev) => Math.max(30, Math.min(60, prev + Math.floor(Math.random() * 5) - 2)))
      setRealTimeVisitors((prev) => Math.max(10, Math.min(30, prev + Math.floor(Math.random() * 3) - 1)))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <GlassCard
      ref={cardRef}
      className="rounded-2xl p-6 sm:p-8 transition-all duration-300"
      aria-label="个人信息卡片"
    >
      <div className="flex justify-center mb-4 sm:mb-6">
        <div className="relative group">
          <div
            className={cn(
              'w-28 h-28 sm:w-32 sm:h-32 rounded-full',
              'bg-gradient-to-br from-tech-cyan to-tech-lightcyan',
              'flex items-center justify-center shadow-lg',
              'transition-all duration-500 ease-out',
              'cursor-pointer',
              'transform-gpu',
              'group-hover:rotate-y-12 group-hover:scale-110'
            )}
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
            role="button"
            tabIndex={0}
            aria-label="查看头像"
          >
            <Users className="w-14 h-14 sm:w-16 sm:h-16 text-white transform-gpu" />
          </div>

          <div
            className="absolute bottom-1 right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"
            aria-label="在线状态"
          />

          <div className="absolute -top-2 -right-2 bg-tech-cyan text-white text-xs px-2 py-1 rounded-full animate-bounce">
            {realTimeVisitors} 人在线
          </div>
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-center mb-2 text-foreground">
        POETIZE
      </h3>
      <p className="text-center text-muted-foreground mb-6 sm:mb-8 text-sm">
        分享技术与生活，记录成长点滴
      </p>

      <div className="mb-6 p-4 rounded-lg bg-glass/20 border border-glass-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-tech-cyan" />
            <span className="text-sm text-gray-400">实时访客</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-green-400">{onlineUsers}</span>
            </div>
            <Globe className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4" role="list" aria-label="统计数据">
        {stats.map((stat) => {
          const circumference = 2 * Math.PI * 18
          const offset = stat.progress ? circumference - (stat.progress / 100) * circumference : circumference

          return (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg hover:bg-tech-cyan/10 transition-colors group"
              role="listitem"
            >
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={cn(
                      'transition-all duration-1000 ease-out',
                      isVisible && 'stroke-dashoffset-0'
                    )}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-tech-cyan" />
                </div>
              </div>

              <span className="text-tech-cyan font-bold text-lg sm:text-xl mb-1">
                {animatedValues[stat.label]?.toLocaleString() || '0'}
              </span>
              <span className="text-foreground font-medium text-xs sm:text-sm">
                {stat.label}
              </span>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
