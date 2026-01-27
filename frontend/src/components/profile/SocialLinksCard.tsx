'use client';

import { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Globe, Github, Twitter, Linkedin, ExternalLink, Share2 } from 'lucide-react';

interface SocialLink {
  platform: string;
  icon: React.ReactNode;
  label: string;
  url: string;
  color: string;
}

interface SocialLinksCardProps {
  links: {
    website?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export default function SocialLinksCard({ links }: SocialLinksCardProps) {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const socialLinks: SocialLink[] = [];

  if (links.website) {
    socialLinks.push({
      platform: 'website',
      icon: <Globe className="w-5 h-5" />,
      label: '个人网站',
      url: links.website,
      color: 'from-blue-500 to-cyan-500'
    });
  }

  if (links.github) {
    socialLinks.push({
      platform: 'github',
      icon: <Github className="w-5 h-5" />,
      label: 'GitHub',
      url: `https://github.com/${links.github}`,
      color: 'from-gray-700 to-gray-900'
    });
  }

  if (links.twitter) {
    socialLinks.push({
      platform: 'twitter',
      icon: <Twitter className="w-5 h-5" />,
      label: 'Twitter',
      url: `https://twitter.com/${links.twitter.replace('@', '')}`,
      color: 'from-sky-400 to-blue-500'
    });
  }

  if (links.linkedin) {
    socialLinks.push({
      platform: 'linkedin',
      icon: <Linkedin className="w-5 h-5" />,
      label: 'LinkedIn',
      url: `https://linkedin.com/in/${links.linkedin}`,
      color: 'from-blue-600 to-blue-700'
    });
  }

  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Share2 className="w-4 h-4 text-tech-cyan" />
        社交链接
      </h3>

      <GlassCard padding="lg" className="border-tech-cyan/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer
                ${hoveredLink === link.platform ? 'border-tech-cyan/50' : 'border-transparent border-2'}
              `}
              onMouseEnter={() => setHoveredLink(link.platform)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {/* 背景渐变 */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* 内容 */}
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* 图标容器 */}
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${link.color} text-white shadow-lg
                      group-hover:scale-110 group-hover:rotate-3 transition-all duration-300
                    `}
                  >
                    {link.icon}
                  </div>

                  {/* 标签 */}
                  <div className="space-y-0.5">
                    <div className="font-semibold text-foreground group-hover:text-tech-cyan transition-colors">
                      {link.label}
                    </div>
                    <div className="text-sm text-muted-foreground truncate max-w-[150px]">
                      {link.url}
                    </div>
                  </div>
                </div>

                {/* 外部链接图标 */}
                <div
                  className={`p-2 rounded-full bg-tech-cyan/10 text-tech-cyan
                    group-hover:bg-tech-cyan group-hover:text-white
                    transition-all duration-300
                    ${hoveredLink === link.platform ? 'translate-x-1' : 'translate-x-0'}
                  `}
                >
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>

              {/* 光晕效果 */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${link.color} opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300 -z-10`}
              />
            </a>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="mt-6 pt-4 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            <span className="text-tech-cyan font-medium">{socialLinks.length}</span> 个社交平台链接
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
