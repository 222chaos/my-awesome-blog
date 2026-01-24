import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/Button';
import type { Category, PopularPost } from '@/types';
import { Twitter, Github, Linkedin, FileText, Folder, Eye } from 'lucide-react';

interface StatsItem {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}

interface SidebarProps {
  categories?: Category[];
  popularPosts?: PopularPost[];
  stats?: StatsItem[];
}

export default function Sidebar({
  categories = [],
  popularPosts = [],
  stats = [
    { icon: FileText, label: '文章', value: 105, color: 'text-tech-cyan' },
    { icon: Folder, label: '分类', value: 12, color: 'text-tech-sky' },
    { icon: Eye, label: '访问', value: 12500, color: 'text-tech-lightcyan' },
  ],
}: SidebarProps) {
  return (
    <div className="space-y-6">
      {/* 个人信息卡片 */}
      <Card className="glass-hover animate-fade-in-up" style={{ animationDelay: '0ms' }}>
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-tech-cyan to-tech-sky p-1">
              <div className="w-full h-full rounded-full bg-glass/80 flex items-center justify-center">
                <span className="text-2xl">👨‍💻</span>
              </div>
            </div>
          </div>
          <CardTitle className="text-xl text-white mb-1">John Doe</CardTitle>
          <p className="text-sm text-gray-300">
            Tech enthusiast & developer
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-4 mb-4">
            <Link
              href="#"
              aria-label="访问Twitter"
              className="w-10 h-10 rounded-lg bg-glass/50 flex items-center justify-center text-tech-cyan hover:text-tech-lightcyan hover:bg-glass/80 transition-all"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              aria-label="访问GitHub"
              className="w-10 h-10 rounded-lg bg-glass/50 flex items-center justify-center text-tech-cyan hover:text-tech-lightcyan hover:bg-glass/80 transition-all"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              aria-label="访问LinkedIn"
              className="w-10 h-10 rounded-lg bg-glass/50 flex items-center justify-center text-tech-cyan hover:text-tech-lightcyan hover:bg-glass/80 transition-all"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
          
          {/* 统计数据 */}
          <div className="space-y-3">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group flex items-center justify-between p-3 rounded-lg bg-glass/30 border border-glass-border/50 hover:bg-glass/50 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-3">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <span className="text-text-secondary">{stat.label}</span>
                </div>
                <span className={`${stat.color} text-2xl font-bold group-hover:scale-110 transition-transform`}>
                  {stat.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 分类卡片 */}
      <Card className="glass-hover animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-tech-cyan">📁</span>
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/category/${category.name}` as any}
                className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-glass/50 transition-all group cursor-pointer"
              >
                <span className="text-gray-200 group-hover:text-tech-lightcyan transition-colors">
                  {category.name}
                </span>
                <span className="text-tech-cyan text-sm font-semibold">
                  {category.count}
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 热门文章卡片 */}
      <Card className="glass-hover animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-tech-cyan">🔥</span>
            Popular Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
            {popularPosts.map((post, index) => (
              <Link
                key={index}
                href={`/posts/${post.id}`}
                className="block group"
              >
                <h4 className="font-medium text-gray-200 group-hover:text-tech-cyan transition-colors mb-1 line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-xs text-gray-400 flex items-center gap-2">
                  <span>{post.date}</span>
                </p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 订阅卡片 */}
      <Card className="glass-hover animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-tech-cyan">📧</span>
            Subscribe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 text-sm mb-4">
            Get the latest posts delivered right to your inbox.
          </p>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Your email address"
              aria-label="输入邮箱地址"
              className="w-full px-4 py-2.5 rounded-lg bg-glass/50 border border-glass-border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tech-cyan transition-all"
            />
            <Button className="w-full bg-gradient-to-r from-tech-cyan to-tech-sky text-white hover:shadow-lg hover:shadow-tech-cyan/20 transition-all">
              Subscribe
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
