import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
}

interface PortfolioProps {
  projects: Project[];
}

export default function Portfolio({ projects }: PortfolioProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 animate-fade-in-up">
          作品集
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <GlassCard
              key={project.id}
              className="group cursor-pointer overflow-hidden"
              hoverEffect={true}
              padding="none"
            >
              {/* 预览图 */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* 悬停覆盖层 */}
                <div className="absolute inset-0 bg-tech-cyan/0 group-hover:bg-tech-cyan/20 transition-colors duration-300"></div>
              </div>
              
              {/* 内容区 */}
              <div className="p-6">
                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-tech-cyan transition-colors">
                  {project.title}
                </h4>
                
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                {/* 技术标签 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-glass text-tech-cyan border border-glass-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* 链接按钮 */}
                <Link href={project.link as any} className="flex items-center text-tech-cyan group-hover:translate-x-2 transition-transform">
                  <span>查看项目</span>
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}