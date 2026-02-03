'use client'

import LogoLoop from '@/components/ui/LogoLoop'
import { 
  SiReact, 
  SiNextdotjs, 
  SiTypescript, 
  SiTailwindcss, 
  SiPython, 
  SiPostgresql, 
  SiDocker, 
  SiGit, 
  SiNodedotjs,
  SiFastapi
} from 'react-icons/si'
import { type LogoItem } from '@/components/ui/LogoLoop'

const techLogos: LogoItem[] = [
  { 
    node: <SiReact className="w-full h-full" />, 
    title: "React", 
    href: "https://react.dev",
    ariaLabel: "React - JavaScript 库"
  },
  { 
    node: <SiNextdotjs className="w-full h-full" />, 
    title: "Next.js", 
    href: "https://nextjs.org",
    ariaLabel: "Next.js - React 框架"
  },
  { 
    node: <SiTypescript className="w-full h-full" />, 
    title: "TypeScript", 
    href: "https://www.typescriptlang.org",
    ariaLabel: "TypeScript - 类型安全的 JavaScript"
  },
  { 
    node: <SiTailwindcss className="w-full h-full" />, 
    title: "Tailwind CSS", 
    href: "https://tailwindcss.com",
    ariaLabel: "Tailwind CSS - 实用优先的 CSS 框架"
  },
  { 
    node: <SiPython className="w-full h-full" />, 
    title: "Python", 
    href: "https://www.python.org",
    ariaLabel: "Python - 编程语言"
  },
  { 
    node: <SiPostgresql className="w-full h-full" />, 
    title: "PostgreSQL", 
    href: "https://www.postgresql.org",
    ariaLabel: "PostgreSQL - 开源关系数据库"
  },
  { 
    node: <SiFastapi className="w-full h-full" />, 
    title: "FastAPI", 
    href: "https://fastapi.tiangolo.com",
    ariaLabel: "FastAPI - 现代化 Python Web 框架"
  },
  { 
    node: <SiDocker className="w-full h-full" />, 
    title: "Docker", 
    href: "https://www.docker.com",
    ariaLabel: "Docker - 容器化平台"
  },
  { 
    node: <SiGit className="w-full h-full" />, 
    title: "Git", 
    href: "https://git-scm.com",
    ariaLabel: "Git - 版本控制系统"
  },
  { 
    node: <SiNodedotjs className="w-full h-full" />, 
    title: "Node.js", 
    href: "https://nodejs.org",
    ariaLabel: "Node.js - JavaScript 运行时"
  }
]

export default function TechStack() {
  return (
    <div className="p-6 sm:p-8" aria-label="技术栈展示">
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">技术栈</h3>
        <p className="text-sm text-gray-400 mt-2">
          我使用的核心技术栈和工具
        </p>
      </div>

      <div className="relative overflow-hidden rounded-xl">
        <LogoLoop
          logos={techLogos}
          speed={120}
          direction="left"
          logoHeight={50}
          gap={50}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#0f172a"
          ariaLabel="技术栈 Logo 滚动展示"
          className="py-6"
        />
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
        <span>悬停暂停</span>
        <span className="w-1 h-1 rounded-full bg-gray-500"></span>
        <span>点击查看详情</span>
      </div>
    </div>
  )
}
