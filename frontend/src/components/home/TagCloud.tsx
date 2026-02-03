'use client';

import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiPython, SiPostgresql, SiFastapi, SiDocker, SiGit, SiGithub, SiVercel } from 'react-icons/si';
import LogoLoop, { LogoItem } from '@/components/ui/LogoLoop';

interface TechStackProps {
}

const techLogos: LogoItem[] = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <SiPython />, title: "Python", href: "https://www.python.org" },
  { node: <SiPostgresql />, title: "PostgreSQL", href: "https://www.postgresql.org" },
  { node: <SiFastapi />, title: "FastAPI", href: "https://fastapi.tiangolo.com" },
  { node: <SiDocker />, title: "Docker", href: "https://www.docker.com" },
  { node: <SiGit />, title: "Git", href: "https://git-scm.com" },
  { node: <SiGithub />, title: "GitHub", href: "https://github.com" },
  { node: <SiVercel />, title: "Vercel", href: "https://vercel.com" },
];

export default function TagCloud({ }: TechStackProps) {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12 animate-fade-in-up">
          技术栈
        </h2>

        <div className="py-8">
          <LogoLoop
            logos={techLogos}
            speed={80}
            direction="left"
            logoHeight={60}
            gap={48}
            pauseOnHover={true}
            scaleOnHover={true}
            fadeOut={true}
            ariaLabel="技术栈图标"
            className="py-4"
          />
        </div>
      </div>
    </section>
  );
}