import GlassCard from '@/components/ui/GlassCard';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20 lg:py-24">
        <GlassCard className="max-w-3xl mx-auto mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            关于我
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            欢迎来到我的个人博客！我热衷于技术、设计，并喜欢与社区分享知识。
          </p>
        </GlassCard>

        <div className="max-w-3xl mx-auto space-y-8">
          <GlassCard className="animate-fade-in-up animate-delay-100">
            <p className="text-muted-foreground text-lg leading-relaxed">
              凭借多年的软件开发经验，我专注于为复杂问题创建优雅的解决方案。
              我的专业知识涵盖前后端技术，特别关注现代JavaScript框架和云架构。
            </p>
          </GlassCard>

          <GlassCard className="animate-fade-in-up animate-delay-200">
            <h2 className="text-2xl font-bold text-white mb-4">
              在这里你会发现
            </h2>
            <p className="text-muted-foreground mb-6">这个博客涵盖广泛的主题，包括：</p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-tech-cyan mt-1">✓</span>
                技术教程和指南
              </li>
              <li className="flex items-start gap-3">
                <span className="text-tech-cyan mt-1">✓</span>
                现代Web开发的最佳实践
              </li>
              <li className="flex items-start gap-3">
                <span className="text-tech-cyan mt-1">✓</span>
                设计系统和UI/UX的见解
              </li>
              <li className="flex items-start gap-3">
                <span className="text-tech-cyan mt-1">✓</span>
                最新工具和框架的评测
              </li>
              <li className="flex items-start gap-3">
                <span className="text-tech-cyan mt-1">✓</span>
                行业趋势和发展的观点
              </li>
            </ul>
          </GlassCard>

          <GlassCard className="animate-fade-in-up animate-delay-300">
            <h2 className="text-2xl font-bold text-white mb-4">联系方式</h2>
            <p className="text-muted-foreground">
              有问题或想要联系？欢迎通过联系页面与我取得联系，或在社交媒体上关注我。
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}