'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { FileText, Eye, Users, Activity, Globe, User } from 'lucide-react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { getCurrentUserApi, getAdminUserApi } from '@/lib/api/auth'

interface Stat {
  label: string
  value: number
  icon: React.ElementType
}

// 数字动画 hook
function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0)
  const countRef = useRef({ value: 0 })

  useEffect(() => {
    if (!start) return
    
    gsap.killTweensOf(countRef.current)
    countRef.current.value = 0
    
    gsap.to(countRef.current, {
      value: end,
      duration: duration / 1000,
      ease: 'power2.out',
      onUpdate: () => {
        setCount(Math.floor(countRef.current.value))
      }
    })
  }, [end, duration, start])

  return count
}

// 鼠标光点
interface TrailDot {
  id: number
  x: number
  y: number
  scale: number
  opacity: number
}

export default function ProfileCard() {
  const stats: Stat[] = [
    { label: '文章', value: 105, icon: FileText },
    { label: '访问量', value: 251383, icon: Eye },
    { label: '友站', value: 12, icon: Users }
  ]

  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [userName, setUserName] = useState('POETIZE')
  const [userBio, setUserBio] = useState('分享技术与生活，记录成长点滴')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState(42)
  
  const cardRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<TrailDot[]>([])
  const dotIdRef = useRef(0)
  const mousePosRef = useRef({ x: 0, y: 0 })
  const lastMousePosRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>()
  const isActiveRef = useRef(false)

  // 获取用户信息
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUserApi()
      if (user) {
        setIsLoggedIn(true)
        setUserAvatar(user.avatar || null)
        setUserName(user.username || user.fullName || 'POETIZE')
        setUserBio(user.bio || '分享技术与生活，记录成长点滴')
      } else {
        setIsLoggedIn(false)
        const admin = await getAdminUserApi()
        if (admin) {
          setUserAvatar(admin.avatar || null)
          setUserName(admin.username || admin.fullName || 'POETIZE')
          setUserBio(admin.bio || '分享技术与生活，记录成长点滴')
        }
      }
    }
    fetchUser()
  }, [])

  // 可见性检测
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

  // 实时访客更新
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers((prev) => Math.max(30, Math.min(60, prev + Math.floor(Math.random() * 5) - 2)))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // 鼠标轨迹光效
  const createTrailDot = useCallback((x: number, y: number) => {
    const id = dotIdRef.current++
    const dot: TrailDot = { id, x, y, scale: 1, opacity: 0.8 }
    dotsRef.current.push(dot)

    // 创建 DOM 元素
    const dotEl = document.createElement('div')
    dotEl.className = 'trail-dot absolute pointer-events-none rounded-full'
    dotEl.style.cssText = `
      width: 8px;
      height: 8px;
      background: radial-gradient(circle, rgba(6,182,212,0.9) 0%, rgba(139,92,246,0.4) 50%, transparent 70%);
      box-shadow: 0 0 20px rgba(6,182,212,0.6), 0 0 40px rgba(139,92,246,0.3);
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.8;
      will-change: transform, opacity;
    `
    
    if (containerRef.current) {
      containerRef.current.appendChild(dotEl)
    }

    // GSAP 动画
    gsap.to(dot, {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        dotEl.style.transform = `translate(-50%, -50%) scale(${dot.scale})`
        dotEl.style.opacity = String(dot.opacity)
      },
      onComplete: () => {
        dotEl.remove()
        dotsRef.current = dotsRef.current.filter(d => d.id !== id)
      }
    })
  }, [])

  // 渲染循环
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let lastTime = 0
    const threshold = 1000 / 30 // 限制到 30fps

    const render = (time: number) => {
      if (time - lastTime < threshold) {
        rafRef.current = requestAnimationFrame(render)
        return
      }
      lastTime = time

      if (isActiveRef.current) {
        const dx = mousePosRef.current.x - lastMousePosRef.current.x
        const dy = mousePosRef.current.y - lastMousePosRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > 15) {
          createTrailDot(mousePosRef.current.x, mousePosRef.current.y)
          lastMousePosRef.current = { ...mousePosRef.current }
        }
      }

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [createTrailDot])

  // 鼠标事件处理
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const handleMouseEnter = () => {
    isActiveRef.current = true
    lastMousePosRef.current = { ...mousePosRef.current }
    
    // 入场光效
    gsap.fromTo('.profile-glow',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
    )
  }

  const handleMouseLeave = () => {
    isActiveRef.current = false
  }

  // 数字统计
  const articleCount = useCountUp(stats[0].value, 2000, isVisible)
  const viewCount = useCountUp(stats[1].value, 2000, isVisible)
  const friendCount = useCountUp(stats[2].value, 2000, isVisible)
  const displayValues = [articleCount, viewCount, friendCount]

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 主卡片 */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#111118] to-[#0a0a0f] border border-white/[0.08] backdrop-blur-xl"
      >
        {/* 背景光晕 */}
        <div className="profile-glow absolute inset-0 opacity-0">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-cyan-500/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-[80px]" />
        </div>

        {/* 内容区域 */}
        <div className="relative z-10 p-6 sm:p-8">
          {/* 头像区域 */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4 group">
              {/* 外圈光晕 */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30 blur-xl group-hover:blur-2xl transition-all duration-500" />
              
              {/* 旋转光环 */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-[2px] rounded-full bg-[#111118]" />
              </div>
              
              {/* 头像 */}
              <div
                className={cn(
                  'relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden',
                  'flex items-center justify-center',
                  !userAvatar && 'bg-gradient-to-br from-cyan-500 to-purple-500'
                )}
              >
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt="用户头像"
                    className="w-full h-full object-cover"
                    onError={() => setUserAvatar(null)}
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>

              {/* 在线状态 */}
              <div
                className={cn(
                  'absolute bottom-1 right-1 w-5 h-5 rounded-full border-[3px] border-[#111118]',
                  isLoggedIn ? 'bg-green-500' : 'bg-gray-500'
                )}
              />
            </div>

            {/* 用户名 */}
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {userName}
            </h3>
            <p className="text-center text-slate-400 text-sm max-w-[280px]">
              {userBio}
            </p>
          </div>

          {/* 实时访客 */}
          <div className="mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-slate-400">实时访客</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-sm font-bold text-green-400 tabular-nums">
                  {onlineUsers}
                </span>
                <Globe className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>
          </div>

          {/* 统计数据 */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group relative flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* 悬浮光效 */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:to-purple-500/10 transition-all duration-300 rounded-xl" />
                
                {/* 图标 */}
                <stat.icon className="w-5 h-5 mb-2 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform duration-300" />
                
                {/* 数字 */}
                <span className="text-lg sm:text-xl font-bold text-white tabular-nums drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                  {displayValues[index]?.toLocaleString() || '0'}
                </span>
                
                {/* 标签 */}
                <span className="text-xs text-slate-400 mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 底部装饰线 */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      </div>
    </div>
  )
}
