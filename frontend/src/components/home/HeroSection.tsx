'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { gsap } from 'gsap'
import { Github, Twitter, Linkedin, Mail, ArrowDown, ExternalLink } from 'lucide-react'
import TextType from './TextType'
import GlassCard from '../ui/GlassCard'
import { useTheme } from '../../context/theme-context'
import WaveStack from '../ui/WaveStack'
import { cn } from '@/lib/utils'

export default function HeroSection() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const backgroundVideo = mounted && resolvedTheme === 'dark'
    ? '/video/moonlit-clouds-field-HD-live.mp4'
    : '/video/fantasy-landscape-deer-HD-live.mp4'

  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !videoLoaded && !videoError && videoRef.current) {
      console.log('触发视频加载:', backgroundVideo)
      setVideoLoaded(false)
      setVideoError(false)
    }
  }, [mounted, backgroundVideo, retryCount])

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.hero-content', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
      })

      gsap.from('.social-icon', {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        delay: 0.6
      })

      gsap.to('.scroll-indicator', {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: 1
      })
    }, sectionRef)

    const handleScroll = () => {
      if (!contentRef.current) return
      const scrollY = window.scrollY
      const translateY = scrollY * 0.3
      gsap.to(contentRef.current, {
        y: translateY,
        duration: 0.5,
        ease: 'power2.out'
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      ctx.revert()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com', color: 'hover:text-white hover:bg-gray-800' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com', color: 'hover:text-white hover:bg-blue-500' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com', color: 'hover:text-white hover:bg-blue-600' },
    { name: 'Email', icon: Mail, href: 'mailto:contact@example.com', color: 'hover:text-white hover:bg-red-500' }
  ]

  const scrollToContent = () => {
    const nextSection = document.querySelector('#featured-highlights')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      ref={sectionRef}
      id="hero-section"
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label="英雄区域"
    >
      <div className="absolute inset-0 z-0">
        {mounted && !videoError && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            src={backgroundVideo}
            onCanPlayThrough={() => {
              console.log('视频已成功加载:', backgroundVideo)
              setVideoLoaded(true)
              setVideoError(false)
            }}
            onPlay={() => {
              console.log('视频开始播放:', backgroundVideo)
            }}
            onError={(e) => {
              console.error('视频加载失败:', backgroundVideo, e)
              setVideoError(true)
              if (retryCount < 3) {
                console.log(`重试视频加载 (${retryCount + 1}/3)...`)
                const newRetryCount = retryCount + 1
                setRetryCount(newRetryCount)
                setTimeout(() => {
                  setVideoError(false)
                  setVideoLoaded(false)
                }, 2000)
              }
            }}
            onLoadStart={() => {
              console.log('开始加载视频:', backgroundVideo)
            }}
            onWaiting={() => {
              console.log('视频缓冲中...')
            }}
            key={`${backgroundVideo}-${retryCount}`}
            aria-hidden="true"
          />
        )}

        <div
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
          style={{
            backgroundImage: mounted && resolvedTheme === 'dark'
              ? 'linear-gradient(135deg, var(--tech-darkblue), var(--tech-deepblue), var(--tech-cyan))'
              : 'linear-gradient(135deg, var(--secondary), var(--accent), var(--primary))',
            backgroundSize: '400% 400%',
            animation: 'gradient-move 8s ease infinite'
          }}
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 bg-[color:var(--background)]/[.3]"
          aria-hidden="true"
        />
      </div>

      <div ref={contentRef} className="relative z-20 flex flex-col w-full flex-1">
        <div className="container mx-auto px-4 text-center flex-1 flex flex-col justify-center hero-content">
          <GlassCard
            padding="sm"
            hoverEffect={false}
            glowEffect={true}
            className="max-w-2xl mx-auto text-center animate-fade-in-up"
            aria-label="欢迎信息"
          >
            <h1
              className="text-2xl md:text-3xl font-bold mb-4"
              id="hero-title"
            >
              <TextType
                fetchFromApi={true}
                typingSpeed={150}
                pauseDuration={1500}
                showCursor
                cursorCharacter="_"
                loop={true}
              />
            </h1>
          </GlassCard>

          <div className="mt-8 flex items-center justify-center gap-4 hero-content">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'social-icon p-3 rounded-lg bg-glass/30 backdrop-blur-xl border border-glass-border',
                  'text-gray-300 hover:text-white transition-all duration-200',
                  'hover:scale-110 hover:-translate-y-1',
                  link.color
                )}
                aria-label={`访问我的${link.name}`}
                title={link.name}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="relative w-full">
          <WaveStack className="wave-stack" waveCount={3} />
        </div>

        <button
          onClick={scrollToContent}
          className="scroll-indicator absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-300 hover:text-tech-cyan transition-colors cursor-pointer group"
          aria-label="向下滚动查看更多"
        >
          <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            向下滚动
          </span>
          <div className="p-2 rounded-full bg-glass/30 backdrop-blur-xl border border-glass-border">
            <ArrowDown className="w-5 h-5" />
          </div>
        </button>
      </div>
    </section>
  )
}
