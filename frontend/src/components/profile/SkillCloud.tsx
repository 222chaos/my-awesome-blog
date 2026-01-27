'use client';

import { useState } from 'react';
import { Code2, Database, Palette, Globe, Cpu, Server, Layout, Smartphone, Cloud, Lock, Zap, GitBranch } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface Skill {
  name: string;
  level: number;
  icon: React.ReactNode;
  category: string;
}

const skills: Skill[] = [
  { name: 'React', level: 95, icon: <Code2 className="w-4 h-4" />, category: 'Frontend' },
  { name: 'Next.js', level: 90, icon: <Globe className="w-4 h-4" />, category: 'Frontend' },
  { name: 'TypeScript', level: 88, icon: <Code2 className="w-4 h-4" />, category: 'Frontend' },
  { name: 'Tailwind CSS', level: 92, icon: <Palette className="w-4 h-4" />, category: 'Design' },
  { name: 'Node.js', level: 82, icon: <Server className="w-4 h-4" />, category: 'Backend' },
  { name: 'Python', level: 85, icon: <Code2 className="w-4 h-4" />, category: 'Backend' },
  { name: 'PostgreSQL', level: 78, icon: <Database className="w-4 h-4" />, category: 'Database' },
  { name: 'MongoDB', level: 80, icon: <Database className="w-4 h-4" />, category: 'Database' },
  { name: 'Docker', level: 75, icon: <Cloud className="w-4 h-4" />, category: 'DevOps' },
  { name: 'AWS', level: 72, icon: <Cloud className="w-4 h-4" />, category: 'DevOps' },
  { name: 'Git', level: 90, icon: <GitBranch className="w-4 h-4" />, category: 'Tools' },
  { name: 'Figma', level: 85, icon: <Palette className="w-4 h-4" />, category: 'Design' },
  { name: 'UI/UX', level: 82, icon: <Layout className="w-4 h-4" />, category: 'Design' },
  { name: 'Performance', level: 78, icon: <Zap className="w-4 h-4" />, category: 'Expertise' },
  { name: 'Security', level: 80, icon: <Lock className="w-4 h-4" />, category: 'Expertise' },
  { name: 'Mobile', level: 76, icon: <Smartphone className="w-4 h-4" />, category: 'Frontend' },
];

const categories = Array.from(new Set(skills.map(skill => skill.category)));

export default function SkillCloud() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const filteredSkills = selectedCategory === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Cpu className="w-4 h-4 text-primary" />
        技能专长
      </h3>

      <GlassCard padding="lg" className="border-border">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === 'All'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            全部
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              className="group"
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-primary/10 text-primary transition-all duration-300 ${
                    hoveredSkill === skill.name ? 'scale-110 bg-primary/20' : ''
                  }`}>
                    {skill.icon}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{skill.name}</div>
                    <div className="text-xs text-muted-foreground">{skill.category}</div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-primary">
                  {skill.level}%
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all duration-500 ${
                    hoveredSkill === skill.name ? 'from-primary/80 to-primary' : ''
                  }`}
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">16</div>
              <div className="text-xs text-muted-foreground">技能总数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">4</div>
              <div className="text-xs text-muted-foreground">专业领域</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">88%</div>
              <div className="text-xs text-muted-foreground">平均熟练度</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">95%</div>
              <div className="text-xs text-muted-foreground">最高技能</div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
