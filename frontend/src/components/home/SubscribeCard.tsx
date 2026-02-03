'use client'

import { useState } from 'react'
import { Mail, CheckCircle, XCircle, FileText, Calendar, Bell, ExternalLink, ArrowRight } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface SubscriptionStatus {
  isSubscribed: boolean
  email: string
  subscribedDate?: string
  format: 'html' | 'text' | 'digest'
}

const mockRecentNewsletters = [
  {
    id: '1',
    title: 'Next.js 14 最佳实践',
    date: '2025-01-20',
    preview: '探索Next.js 14的新特性和App Router的最佳实践...',
    readTime: '5分钟'
  },
  {
    id: '2',
    title: 'TypeScript 高级技巧',
    date: '2025-01-15',
    preview: '深入学习TypeScript的高级类型系统和实用技巧...',
    readTime: '7分钟'
  },
  {
    id: '3',
    title: 'React 性能优化',
    date: '2025-01-10',
    preview: '提升React应用性能的关键技术和策略...',
    readTime: '6分钟'
  }
]

export default function SubscribeCard() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<'html' | 'text' | 'digest'>('html')
  const [showPreview, setShowPreview] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')

    setTimeout(() => {
      setStatus('success')
      setSubscriptionStatus({
        isSubscribed: true,
        email,
        subscribedDate: new Date().toISOString(),
        format: selectedFormat
      })

      setTimeout(() => setStatus('idle'), 3000)
    }, 1500)
  }

  const handleUnsubscribe = () => {
    setStatus('loading')

    setTimeout(() => {
      setSubscriptionStatus(null)
      setStatus('success')
      setEmail('')

      setTimeout(() => setStatus('idle'), 3000)
    }, 1000)
  }

  const formats = [
    { id: 'html' as const, label: 'HTML邮件', icon: FileText, description: '富文本格式' },
    { id: 'text' as const, label: '纯文本', icon: FileText, description: '简洁文本格式' },
    { id: 'digest' as const, label: '周报摘要', icon: Calendar, description: '每周汇总' }
  ]

  return (
    <GlassCard
      className="container mx-auto px-4 py-8 mt-12"
      padding="lg"
      aria-label="订阅卡片"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-tech-cyan to-tech-sky mb-4 animate-bounce">
            <Mail className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            订阅更新
          </h3>

          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            加入我们的邮件列表，获取最新文章、技巧和资源。
          </p>
        </div>

        {subscriptionStatus?.isSubscribed ? (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/30">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    订阅成功！
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    感谢您的订阅。我们已向 <span className="text-tech-cyan font-medium">{subscriptionStatus.email}</span> 发送确认邮件。
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-glass/20 border border-glass-border">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-tech-cyan" />
                  <span className="text-xs text-muted-foreground">订阅邮箱</span>
                </div>
                <p className="text-sm font-medium text-foreground">{subscriptionStatus.email}</p>
              </div>

              <div className="p-4 rounded-lg bg-glass/20 border border-glass-border">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-tech-cyan" />
                  <span className="text-xs text-muted-foreground">订阅日期</span>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {subscriptionStatus.subscribedDate ? new Date(subscriptionStatus.subscribedDate).toLocaleDateString('zh-CN') : '今天'}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-glass/20 border border-glass-border">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="w-4 h-4 text-tech-cyan" />
                  <span className="text-xs text-muted-foreground">邮件格式</span>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {formats.find(f => f.id === subscriptionStatus.format)?.label}
                </p>
              </div>
            </div>

            <div>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 text-sm text-tech-cyan hover:text-tech-lightcyan transition-colors mb-4"
                aria-expanded={showPreview}
              >
                {showPreview ? '隐藏' : '查看'} 邮件预览
                <ArrowRight className={cn('w-4 h-4 transition-transform', showPreview ? 'rotate-90' : '')} />
              </button>

              {showPreview && (
                <div className="p-4 rounded-lg bg-glass/20 border border-glass-border space-y-3 animate-fade-in-up">
                  <h5 className="text-sm font-semibold text-foreground">最近发送的邮件</h5>
                  {mockRecentNewsletters.map(newsletter => (
                    <div
                      key={newsletter.id}
                      className="p-3 rounded-lg hover:bg-glass/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h6 className="text-sm font-medium text-foreground">{newsletter.title}</h6>
                        <span className="text-xs text-muted-foreground">{newsletter.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{newsletter.preview}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {newsletter.readTime}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleUnsubscribe}
                className="flex-1 bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? '处理中...' : '取消订阅'}
              </Button>

              <a
                href="/archive"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-glass/40 border border-glass-border text-foreground hover:bg-glass/60 transition-colors text-sm font-medium"
              >
                查看历史归档
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                邮箱地址
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg bg-glass/40 border border-glass-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tech-cyan/50 backdrop-blur-lg transition-all"
                disabled={status === 'loading'}
                aria-invalid={status === 'error'}
              />
              {status === 'error' && (
                <div className="flex items-center gap-2 mt-2 text-sm text-red-400">
                  <XCircle className="w-4 h-4" />
                  <span>请输入有效的邮箱地址</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                邮件格式
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {formats.map((format) => {
                  const Icon = format.icon
                  return (
                    <button
                      key={format.id}
                      type="button"
                      onClick={() => setSelectedFormat(format.id)}
                      className={cn(
                        'p-4 rounded-lg border-2 transition-all duration-200',
                        'flex flex-col items-center gap-2 text-center',
                        selectedFormat === format.id
                          ? 'border-tech-cyan bg-tech-cyan/10'
                          : 'border-glass-border bg-glass/20 hover:bg-glass/40'
                      )}
                      aria-pressed={selectedFormat === format.id}
                    >
                      <Icon className="w-6 h-6 text-tech-cyan" />
                      <span className="text-sm font-medium text-foreground">{format.label}</span>
                      <span className="text-xs text-muted-foreground">{format.description}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-tech-cyan text-white hover:bg-tech-lightcyan transition-colors flex items-center justify-center gap-2"
              disabled={status === 'loading' || !email}
            >
              {status === 'loading' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  <Bell className="w-5 h-5" />
                  订阅更新
                </>
              )}
            </Button>

            <div className="flex flex-col sm:flex-row gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                <span>无垃圾邮件</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                <span>随时取消</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                <span>每周更新</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </GlassCard>
  )
}
