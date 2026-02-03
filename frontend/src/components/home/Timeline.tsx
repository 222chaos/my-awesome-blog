'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Award, Calendar, Image, Video, ChevronDown, ChevronRight, Badge, ExternalLink, FileText } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface MediaItem {
  type: 'image' | 'video' | 'article'
  url: string
  title: string
}

interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  badge?: {
    type: 'milestone' | 'achievement' | 'award' | 'project'
    label: string
    color: string
  }
  media?: MediaItem[]
  link?: string
}

const mockEvents: TimelineEvent[] = [
  {
    id: '1',
    date: '2024-12',
    title: '完成100篇技术博客',
    description: '坚持写作100篇技术博客，分享前端、后端和DevOps相关的知识和经验',
    badge: {
      type: 'milestone',
      label: '里程碑',
      color: 'from-purple-500 to-pink-500'
    }
  },
  {
    id: '2',
    date: '2024-10',
    title: '开源项目获得500+ Star',
    description: '个人开源项目在GitHub上获得超过500个Star，感谢社区的支持',
    badge: {
      type: 'achievement',
      label: '成就',
      color: 'from-yellow-500 to-orange-500'
    },
    media: [
      { type: 'image', url: '/assets/project-screenshot.jpg', title: '项目截图' }
    ],
    link: 'https://github.com/yourproject'
  },
  {
    id: '3',
    date: '2024-08',
    title: '技术文章被推荐',
    description: '多篇技术文章被掘金、知乎等平台推荐，累计阅读量超过10万',
    badge: {
      type: 'award',
      label: '荣誉',
      color: 'from-red-500 to-pink-500'
    },
    media: [
      { type: 'article', url: '/articles/featured', title: '推荐文章' }
    ]
  },
  {
    id: '4',
    date: '2024-06',
    title: '发布第一个开源项目',
    description: '正式发布第一个开源项目，为开发者提供实用的工具库',
    badge: {
      type: 'project',
      label: '项目',
      color: 'from-blue-500 to-cyan-500'
    },
    media: [
      { type: 'video', url: '/assets/project-demo.mp4', title: '项目演示' }
    ],
    link: 'https://github.com/yourproject'
  },
  {
    id: '5',
    date: '2024-03',
    title: '开始技术博客之旅',
    description: '创建个人技术博客，开始系统性地记录学习和成长历程',
    badge: {
      type: 'milestone',
      label: '起点',
      color: 'from-green-500 to-emerald-500'
    }
  }
]

const badgeIcons = {
  milestone: Award,
  achievement: Award,
  award: Badge,
  project: FileText
}

const mediaIcons = {
  image: Image,
  video: Video,
  article: FileText
}

interface TimelineEventItemProps {
  event: TimelineEvent
  index: number
}

function TimelineEventItem({ event, index }: TimelineEventItemProps) {
  const itemRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showMediaPreview, setShowMediaPreview] = useState(false)

  const isLeft = index % 2 === 0

  useEffect(() => {
    const item = itemRef.current
    const dot = dotRef.current
    const card = cardRef.current

    if (!item || !dot || !card || typeof window === 'undefined') return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        end: 'top 15%',
        scrub: 1
      }
    })

    tl.fromTo(dot,
      { scale: 0, opacity: 0, boxShadow: '0 0 0px var(--tech-cyan)' },
      {
        scale: 1,
        opacity: 1,
        boxShadow: '0 0 20px var(--tech-cyan)',
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)'
      },
      0
    )

    tl.fromTo(card,
      {
        x: isLeft ? -80 : 80,
        opacity: 0,
        y: 30,
        rotateY: isLeft ? -30 : 30,
        scale: 0.9
      },
      {
        x: 0,
        opacity: 1,
        y: 0,
        rotateY: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out'
      },
      '<0.2'
    )

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [isLeft, index])

  const BadgeIcon = event.badge ? badgeIcons[event.badge.type] : null

  return (
    <div
      ref={itemRef}
      className={cn('relative flex items-start mb-12', isLeft ? 'flex-row' : 'flex-row-reverse')}
    >
      <div className="relative z-20 w-16 h-16 flex items-center justify-center">
        <div
          ref={dotRef}
          className="w-5 h-5 bg-tech-cyan rounded-full"
          style={{
            backgroundColor: 'var(--tech-cyan)',
            boxShadow: '0 0 15px var(--tech-cyan)',
            filter: 'blur(0.5px)'
          }}
        />
      </div>

      <GlassCard
        ref={cardRef}
        className="flex-1 ml-4 relative z-10"
        hoverEffect={true}
        padding="md"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-tech-cyan" />
            <span className="text-sm text-tech-cyan font-medium">{event.date}</span>
          </div>

          {event.badge && BadgeIcon && (
            <div
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold',
                'bg-gradient-to-r',
                event.badge.color,
                'text-white'
              )}
            >
              <BadgeIcon className="w-3.5 h-3.5" />
              {event.badge.label}
            </div>
          )}
        </div>

        <h4 className="text-lg font-bold text-foreground mb-2">{event.title}</h4>

        <p
          className={cn(
            'text-muted-foreground transition-all duration-300',
            !isExpanded && 'line-clamp-2'
          )}
        >
          {event.description}
        </p>

        {(event.media || event.link) && (
          <div className="mt-4 space-y-3">
            {event.media && event.media.length > 0 && (
              <div>
                <button
                  onClick={() => setShowMediaPreview(!showMediaPreview)}
                  className="flex items-center gap-2 text-sm text-tech-cyan hover:text-tech-lightcyan transition-colors"
                  aria-expanded={showMediaPreview}
                  aria-label={showMediaPreview ? '隐藏媒体预览' : '显示媒体预览'}
                >
                  {showMediaPreview ? (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      隐藏媒体
                    </>
                  ) : (
                    <>
                      <ChevronRight className="w-4 h-4" />
                      查看媒体 ({event.media.length})
                    </>
                  )}
                </button>

                {showMediaPreview && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 animate-fade-in-up">
                    {event.media.map((media, idx) => {
                      const MediaIcon = mediaIcons[media.type]
                      return (
                        <div
                          key={idx}
                          className={cn(
                            'relative group overflow-hidden rounded-lg',
                            'bg-glass/20 border border-glass-border',
                            'cursor-pointer transition-all duration-300',
                            'hover:scale-105 hover:shadow-lg'
                          )}
                          onClick={() => window.open(media.url, '_blank')}
                          aria-label={`查看${media.title}`}
                        >
                          <div className="p-3 flex flex-col items-center gap-2">
                            <MediaIcon className="w-8 h-8 text-tech-cyan" />
                            <span className="text-xs text-center text-foreground">{media.title}</span>
                          </div>

                          <div className="absolute inset-0 bg-tech-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ExternalLink className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {event.link && (
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-tech-cyan hover:text-tech-lightcyan transition-colors"
              >
                查看详情
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        )}

        {event.description.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 flex items-center gap-1 text-sm text-tech-cyan hover:text-tech-lightcyan transition-colors"
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                收起
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                展开更多
              </>
            )}
          </button>
        )}
      </GlassCard>
    </div>
  )
}

function ChevronUp({ className }: { className?: string }) {
  return <ChevronDown className={className} style={{ transform: 'rotate(180deg)' }} />
}

export default function Timeline() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const verticalLineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timeline = timelineRef.current
    const verticalLine = verticalLineRef.current

    if (!timeline || !verticalLine || typeof window === 'undefined') return

    gsap.fromTo(timeline,
      { y: 60, opacity: 0, scale: 0.98 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: timeline,
          start: 'top 85%',
          end: 'bottom 10%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    gsap.fromTo(verticalLine,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: 'top',
        duration: 2,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: timeline,
          start: 'top 90%',
          end: 'bottom 10%',
          scrub: 0.5
        }
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in-up text-foreground">
          我的历程
        </h2>

        <div ref={timelineRef} className="relative max-w-4xl mx-auto">
          <div
            ref={verticalLineRef}
            className="absolute left-8 top-0 bottom-0 w-0.5 origin-top"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, var(--tech-cyan) 10%, var(--tech-cyan) 90%, transparent 100%)',
              filter: 'blur(0.5px)'
            }}
          />

          <div className="absolute left-8 top-0 h-full w-40 -ml-20 bg-gradient-to-r from-transparent via-tech-cyan/10 to-transparent opacity-30 pointer-events-none" />

          {mockEvents.map((event, index) => (
            <TimelineEventItem key={event.id} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
