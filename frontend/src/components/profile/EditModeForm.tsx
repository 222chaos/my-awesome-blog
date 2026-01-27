'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { User, Mail, Globe, Twitter, Github, Linkedin, MapPin, CameraIcon, X, Save } from 'lucide-react';

interface EditModeFormProps {
  formData: Partial<{
    fullName: string;
    email: string;
    bio: string;
    website: string;
    twitter: string;
    github: string;
    linkedin: string;
  }>;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function EditModeForm({ formData, errors, onChange, onSubmit, onCancel }: EditModeFormProps) {
  return (
    <GlassCard padding="lg" className="border-tech-cyan/20 animate-fade-in-up">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* 头部 */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h3 className="text-xl font-bold text-gradient-primary">编辑个人资料</h3>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-tech-cyan/10 rounded-full transition-all duration-200 cursor-pointer group"
          >
            <X className="w-5 h-5 text-muted-foreground group-hover:text-tech-cyan transition-colors" />
          </button>
        </div>

        {/* 基本信息 */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-tech-cyan uppercase tracking-wider">基本信息</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2 text-foreground">
                <User className="w-4 h-4" />
                全名
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName || ''}
                onChange={onChange}
                placeholder="请输入全名"
                className="bg-muted/50 border-border focus:border-tech-cyan transition-colors duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-foreground">
                <Mail className="w-4 h-4" />
                邮箱
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={onChange}
                placeholder="请输入邮箱"
                className="bg-muted/50 border-border focus:border-tech-cyan transition-colors duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="flex items-center gap-2 text-foreground">
              <MapPin className="w-4 h-4" />
              个人简介
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio || ''}
              onChange={onChange}
              rows={4}
              placeholder="介绍一下你自己..."
              className="bg-muted/50 border-border focus:border-tech-cyan resize-none transition-colors duration-200"
            />
          </div>
        </div>

        {/* 社交链接 */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-tech-cyan uppercase tracking-wider">社交链接</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2 text-foreground">
                <Globe className="w-4 h-4" />
                个人网站
              </Label>
              <Input
                id="website"
                name="website"
                value={formData.website || ''}
                onChange={onChange}
                placeholder="https://example.com"
                className={`bg-muted/50 border-border focus:border-tech-cyan transition-colors duration-200 ${
                  errors.website ? 'border-red-500' : ''
                }`}
              />
              {errors.website && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.website}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="flex items-center gap-2 text-foreground">
                <Twitter className="w-4 h-4" />
                Twitter
              </Label>
              <Input
                id="twitter"
                name="twitter"
                value={formData.twitter || ''}
                onChange={onChange}
                placeholder="@username"
                className={`bg-muted/50 border-border focus:border-tech-cyan transition-colors duration-200 ${
                  errors.twitter ? 'border-red-500' : ''
                }`}
              />
              {errors.twitter && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.twitter}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="github" className="flex items-center gap-2 text-foreground">
                <Github className="w-4 h-4" />
                GitHub
              </Label>
              <Input
                id="github"
                name="github"
                value={formData.github || ''}
                onChange={onChange}
                placeholder="username"
                className={`bg-muted/50 border-border focus:border-tech-cyan transition-colors duration-200 ${
                  errors.github ? 'border-red-500' : ''
                }`}
              />
              {errors.github && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.github}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-2 text-foreground">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                name="linkedin"
                value={formData.linkedin || ''}
                onChange={onChange}
                placeholder="username"
                className={`bg-muted/50 border-border focus:border-tech-cyan transition-colors duration-200 ${
                  errors.linkedin ? 'border-red-500' : ''
                }`}
              />
              {errors.linkedin && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.linkedin}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 按钮组 */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="cursor-pointer transition-all duration-200 hover:scale-105"
          >
            取消
          </Button>
          <Button
            type="submit"
            className="cursor-pointer transition-all duration-200 hover:scale-105 bg-gradient-to-r from-tech-cyan to-tech-sky hover:from-tech-cyan/90 hover:to-tech-sky/90"
          >
            <Save className="w-4 h-4 mr-2" />
            保存更改
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}
