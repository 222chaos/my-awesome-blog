'use client'

import { useEffect, useRef, useState } from 'react'
import { FileText, Eye, Users, Activity, Globe, User } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'
import { getCurrentUserApi, getAdminUserApi } from '@/lib/api/auth'

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
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [userName, setUserName] = useState('POETIZE')
  const [userBio, setUserBio] = useState('分享技术与生活，记录成长点滴')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()

  // 获取当前用户信息，未登录时获取管理员信息作为默认
  useEffect(() => {
    const fetchUser = async () => {
      // 先尝试获取当前登录用户
      const user = await getCurrentUserApi()
      if (user) {
        setIsLoggedIn(true)
        setUserAvatar(user.avatar || null)
        setUserName(user.username || user.fullName || 'POETIZE')
        setUserBio(user.bio || '分享技术与生活，记录成长点滴')
      } else {
        // 未登录时获取管理员信息作为默认
        setIsLoggedIn(false)
        const admin = await getAdminUserApi()
        if (admin) {
          setUserAvatar(admin.avatar || null)
          setUserName(admin.username || admin.fullName || 'POETIZE')
          setUserBio(admin.bio || '分享技术与生活，记录成长点滴')
        } else {
          setUserAvatar(null)
          setUserName('POETIZE')
          setUserBio('分享技术与生活，记录成长点滴')
        }
      }
    }
    fetchUser()
  }, [])

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
      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <div className="relative group mb-4">
          <div
            className={cn(
              'w-24 h-24 sm:w-28 sm:h-28 rounded-full',
              userAvatar ? '' : 'bg-gradient-to-br from-tech-cyan to-tech-lightcyan',
              'flex items-center justify-center shadow-lg',
              'transition-all duration-500 ease-out',
              'cursor-pointer',
              'transform-gpu',
              'group-hover:scale-110',
              'overflow-hidden'
            )}
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
            role="button"
            tabIndex={0}
            aria-label="查看头像"
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt="用户头像"
                className="w-full h-full object-cover"
                onError={() => setUserAvatar(null)}
              />
            ) : (
              <User className="w-12 h-12 sm:w-14 sm:h-14 text-white transform-gpu" />
            )}
          </div>

          <div
            className={cn(
              'absolute bottom-1 right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white dark:border-gray-900 animate-pulse',
              isLoggedIn ? 'bg-green-500' : 'bg-gray-400'
            )}
            aria-label={isLoggedIn ? '在线状态' : '离线状态'}
          />

          <div className="absolute -top-1 -right-1 bg-tech-cyan text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full">
            {realTimeVisitors}
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-center mb-2 text-foreground">
          {userName}
        </h3>
        <p className="text-center text-muted-foreground text-sm max-w-[280px]">
          {userBio}
        </p>
      </div>

      <div className="mb-5 p-3 rounded-lg bg-glass/20 border border-glass-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-tech-cyan" />
            <span className="text-xs sm:text-sm text-gray-400">实时访客</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs sm:text-sm font-medium text-green-400">{onlineUsers}</span>
            </div>
            <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
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
              className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-lg hover:bg-tech-cyan/10 transition-colors group"
              role="listitem"
            >
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 mb-1.5 sm:mb-2">
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
                  <stat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-tech-cyan" />
                </div>
              </div>

              <span className="text-tech-cyan font-bold text-sm sm:text-lg mb-0.5">
                {animatedValues[stat.label]?.toLocaleString() || '0'}
              </span>
              <span className="text-foreground font-medium text-[10px] sm:text-xs">
                {stat.label}
              </span>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
