'use client';

import { useState } from 'react';
import { User, Mail, Globe, Github, Twitter, Linkedin, Edit3, Check, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { UserProfile } from '@/types';

interface ProfileHeaderProps {
  profile: UserProfile;
  isEditing: boolean;
  onEditToggle: () => void;
}

export default function ProfileHeader({ profile, isEditing, onEditToggle }: ProfileHeaderProps) {
  const [showEditHint, setShowEditHint] = useState(false);

  return (
    <div className="relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden rounded-t-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-tech-cyan/5 via-tech-sky/10 to-tech-cyan/5 animate-gradient-move" />
        <div className="absolute top-0 left-0 w-72 h-72 bg-tech-cyan/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-tech-sky/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* 主要内容 */}
      <div className="relative z-10">
        {/* 头部信息区域 */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 p-8 pb-6">
          {/* 头像区域 */}
          <div className="relative group">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-tech-cyan via-tech-sky to-tech-cyan rounded-full animate-spin-slow blur-xl opacity-50" />
              <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-background shadow-2xl bg-background transition-all duration-500 group-hover:shadow-[0_0_40px_var(--shadow-tech-cyan)] group-hover:scale-105">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.fullName || profile.username}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-tech-cyan/20 to-tech-sky/20 flex items-center justify-center">
                    <span className="text-4xl lg:text-5xl font-bold text-gradient-primary">
                      {profile.fullName?.charAt(0) || profile.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              {/* 在线状态指示器 */}
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-3 border-background animate-pulse" />
            </div>

            {/* 编辑模式下的头像上传按钮 */}
            {isEditing && (
              <button
                className="absolute -bottom-2 -right-2 bg-gradient-to-r from-tech-cyan to-tech-sky text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer group-hover:-rotate-12"
                onMouseEnter={() => setShowEditHint(true)}
                onMouseLeave={() => setShowEditHint(false)}
              >
                <Sparkles className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* 用户信息 */}
          <div className="flex-1 text-center lg:text-left space-y-3">
            {/* 姓名 */}
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <h1 className="text-3xl lg:text-4xl font-bold text-gradient-primary animate-fade-in-up">
                {profile.fullName || profile.username}
              </h1>
              {!isEditing && (
                <button
                  onClick={onEditToggle}
                  className="p-2 rounded-full bg-tech-cyan/10 hover:bg-tech-cyan/20 text-tech-cyan transition-all duration-300 hover:scale-110 cursor-pointer"
                  title="编辑资料"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* 用户名 */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-lg text-muted-foreground">
              <User className="w-5 h-5 text-tech-cyan" />
              <span className="font-medium">@{profile.username}</span>
            </div>

            {/* 邮箱 */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-muted-foreground">
              <Mail className="w-5 h-5 text-tech-sky" />
              <span>{profile.email}</span>
            </div>

            {/* 简介 */}
            {profile.bio && (
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 mt-4 line-clamp-2">
                {profile.bio}
              </p>
            )}

            {/* 社交链接 */}
            <div className="flex items-center justify-center lg:justify-start gap-4 mt-4 flex-wrap">
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-tech-cyan/10 hover:bg-tech-cyan/20 text-tech-cyan rounded-full transition-all duration-300 hover:scale-105 cursor-pointer group"
                >
                  <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span className="text-sm font-medium">网站</span>
                </a>
              )}
              {profile.github && (
                <a
                  href={`https://github.com/${profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-tech-cyan/20 text-muted-foreground hover:text-tech-cyan rounded-full transition-all duration-300 hover:scale-105 cursor-pointer group"
                >
                  <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">GitHub</span>
                </a>
              )}
              {profile.twitter && (
                <a
                  href={`https://twitter.com/${profile.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-tech-cyan/20 text-muted-foreground hover:text-tech-cyan rounded-full transition-all duration-300 hover:scale-105 cursor-pointer group"
                >
                  <Twitter className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                  <span className="text-sm font-medium">Twitter</span>
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={`https://linkedin.com/in/${profile.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-tech-cyan/20 text-muted-foreground hover:text-tech-cyan rounded-full transition-all duration-300 hover:scale-105 cursor-pointer group"
                >
                  <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">LinkedIn</span>
                </a>
              )}
            </div>
          </div>

          {/* 右侧状态标签 */}
          <div className="hidden lg:flex flex-col items-center gap-3">
            <div className="px-4 py-2 bg-gradient-to-r from-tech-cyan/20 to-tech-sky/20 border border-tech-cyan/30 rounded-full animate-fade-in-up">
              <span className="text-sm font-medium text-tech-cyan">✨ 在线</span>
            </div>
            <div className="text-xs text-muted-foreground">
              活跃用户
            </div>
          </div>
        </div>

        {/* 底部装饰线 */}
        <div className="h-1 bg-gradient-to-r from-transparent via-tech-cyan to-transparent" />
      </div>
    </div>
  );
}
