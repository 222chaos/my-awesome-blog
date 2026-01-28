'use client';

import { useState } from 'react';
import { CameraIcon, Mail, Globe, Twitter, Github, Linkedin, MapPin } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UserProfile } from '@/lib/api/profile';

interface ProfileViewProps {
  profile: UserProfile;
  isEditing: boolean;
  setEditing: (editing: boolean) => void;
  formData: Partial<UserProfile>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<UserProfile>>>;
  onSave: () => void;
  onCancel: () => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileView({
  profile,
  isEditing,
  setEditing,
  formData,
  setFormData,
  onSave,
  onCancel,
  onAvatarChange
}: ProfileViewProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <GlassCard className="overflow-hidden border-border shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 pb-6 border-b border-border p-6">
        <div className="flex flex-col items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-lg transition-all duration-300 group-hover:shadow-2xl">
              {formData.avatar ? (
                <img 
                  src={formData.avatar} 
                  alt="Avatar" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-2xl text-muted-foreground">
                    {formData.fullName?.charAt(0) || (formData.username ? formData.username.charAt(0) : '?')}
                  </span>
                </div>
              )}
            </div>
            {isEditing && (
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-all duration-200 hover:scale-110 shadow-md"
              >
                <CameraIcon className="w-4 h-4 text-primary-foreground" />
                <input 
                  id="avatar-upload"
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={onAvatarChange}
                />
              </label>
            )}
          </div>
          
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-1">
              {isEditing ? (
                <Input
                  name="fullName"
                  value={formData.fullName || ''}
                  onChange={handleInputChange}
                  className="text-3xl font-bold bg-transparent border-none focus:border-primary px-0 h-auto py-0 text-center"
                />
              ) : (
                formData.fullName || formData.username
              )}
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
              <span className="w-2 h-2 rounded-full bg-tech-cyan"></span>
              <p>@{formData.username}</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4 text-primary" />
              <span>{formData.email}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {!isEditing ? (
              <Button 
                onClick={() => setEditing(true)} 
                className="cursor-pointer transition-all duration-200 hover:scale-105"
              >
                <span className="mr-2">✏️</span>
                编辑个人资料
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={onCancel}
                  className="cursor-pointer transition-all duration-200 hover:scale-105"
                >
                  取消
                </Button>
                <Button 
                  onClick={onSave} 
                  className="cursor-pointer transition-all duration-200 hover:scale-105"
                >
                  保存更改
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 p-6">
        {isEditing ? (
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground flex items-center gap-1">
                  <span className="w-4 h-4 flex items-center justify-center">👤</span>
                  用户名
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username || ''}
                  onChange={handleInputChange}
                  readOnly
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground transition-colors duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  邮箱
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground transition-colors duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website" className="text-foreground flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  个人网站
                </Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground transition-colors duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter" className="text-foreground flex items-center gap-1">
                  <Twitter className="w-4 h-4" />
                  Twitter
                </Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={formData.twitter || ''}
                  onChange={handleInputChange}
                  placeholder="@username"
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground transition-colors duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github" className="text-foreground flex items-center gap-1">
                  <Github className="w-4 h-4" />
                  GitHub
                </Label>
                <Input
                  id="github"
                  name="github"
                  value={formData.github || ''}
                  onChange={handleInputChange}
                  placeholder="username"
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground transition-colors duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-foreground flex items-center gap-1">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin || ''}
                  onChange={handleInputChange}
                  placeholder="username"
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground transition-colors duration-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-foreground flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                个人简介
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio || ''}
                onChange={handleInputChange}
                rows={4}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground resize-none transition-colors duration-200"
                placeholder="介绍一下自己..."
              />
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {formData.bio && (
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  关于我
                </h3>
                <p className="text-muted-foreground leading-relaxed">{formData.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  联系方式
                </h3>
                <div className="space-y-3 pl-6">
                  <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer group">
                    <Mail className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                    <a 
                      href={`mailto:${formData.email}`}
                      className="hover:text-foreground transition-colors"
                    >
                      {formData.email}
                    </a>
                  </div>
                  {formData.website && (
                    <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer group">
                      <Globe className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                      <a 
                        href={formData.website.startsWith('http') ? formData.website : `https://${formData.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground transition-colors"
                      >
                        {formData.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 flex items-center justify-center">👤</span>
                  社交媒体
                </h3>
                <div className="space-y-3 pl-6">
                  {formData.twitter && (
                    <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer group">
                      <Twitter className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                      <a 
                        href={`https://twitter.com/${formData.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground transition-colors"
                      >
                        {formData.twitter}
                      </a>
                    </div>
                  )}
                  {formData.github && (
                    <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer group">
                      <Github className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                      <a 
                        href={`https://github.com/${formData.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground transition-colors"
                      >
                        {formData.github}
                      </a>
                    </div>
                  )}
                  {formData.linkedin && (
                    <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer group">
                      <Linkedin className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                      <a 
                        href={`https://linkedin.com/in/${formData.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground transition-colors"
                      >
                        {formData.linkedin}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}