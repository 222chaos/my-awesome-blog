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
        <Cpu className="w-4 h-4 text-tech-cyan" />
        技能专长
      </h3>

      <GlassCard padding="lg" className="border-tech-cyan/20">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-gradient-to-r from-tech-cyan to-tech-sky text-white shadow-lg hover:shadow-xl hover:scale-105'
                : 'bg-muted text-muted-foreground hover:bg-tech-cyan/10 hover:text-tech-cyan'
            }`}
          >
            全部
          </button>
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer animate-fade-in-up ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-tech-cyan to-tech-sky text-white shadow-lg hover:shadow-xl hover:scale-105'
                  : 'bg-muted text-muted-foreground hover:bg-tech-cyan/10 hover:text-tech-cyan'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          {filteredSkills.map((skill, index) => (
            <div
              key={skill.name}
              className="group relative"
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              {/* 悬停光晕效果 */}
              <div className={`absolute -inset-2 bg-gradient-to-r from-tech-cyan/0 via-tech-cyan/5 to-tech-cyan/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${hoveredSkill === skill.name ? 'opacity-100' : ''}`} />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl bg-tech-cyan/10 text-tech-cyan transition-all duration-500 group-hover:scale-110 group-hover:bg-tech-cyan/20 group-hover:rotate-3 ${
                      hoveredSkill === skill.name ? 'shadow-[0_0_20px_var(--shadow-tech-cyan)]' : ''
                    }`}>
                      {skill.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground group-hover:text-tech-cyan transition-colors">{skill.name}</div>
                      <div className="text-xs text-muted-foreground">{skill.category}</div>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold text-gradient-primary transition-all duration-300 ${hoveredSkill === skill.name ? 'scale-110' : ''}`}>
                    {skill.level}%
                  </div>
                </div>
                
                {/* 进度条 */}
                <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
                  {/* 背景发光 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-tech-cyan/0 via-tech-cyan/10 to-tech-cyan/0" />
                  
                  <div
                    className={`h-full bg-gradient-to-r from-tech-cyan/60 to-tech-sky rounded-full transition-all duration-700 relative ${
                      hoveredSkill === skill.name ? 'shadow-[0_0_15px_var(--shadow-tech-cyan)]' : ''
                    }`}
                    style={{ width: `${skill.level}%` }}
                  >
                    {/* 进度条光效 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: filteredSkills.length, label: '技能总数', color: 'from-tech-cyan to-tech-sky' },
              { value: categories.length, label: '专业领域', color: 'from-purple-500 to-pink-500' },
              { value: `${Math.round(filteredSkills.reduce((sum, skill) => sum + skill.level, 0) / filteredSkills.length)}%`, label: '平均熟练度', color: 'from-green-500 to-emerald-500' },
              { value: `${Math.max(...filteredSkills.map(s => s.level))}%`, label: '最高技能', color: 'from-orange-500 to-red-500' }
            ].map((stat, index) => (
              <div key={stat.label} className="space-y-2 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className={`text-3xl font-bold text-gradient-${stat.color.replace('from-', '').split(' to-')[0]}-${stat.color.split(' to-')[1]}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

