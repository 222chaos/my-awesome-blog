'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CameraIcon, Mail, Globe, Twitter, Github, Linkedin, User, UserRound, AtSign, Link as LinkIcon, MapPin, Calendar } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { validateSocialLink } from '@/services/userService';
import UserStats from '@/components/profile/UserStats';
import SkillCloud from '@/components/profile/SkillCloud';
import ActivityTimeline from '@/components/profile/ActivityTimeline';
import BadgeCollection from '@/components/profile/BadgeCollection';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<{success: boolean; message: string} | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const mockProfile: UserProfile = {
        id: '1',
        username: 'johndoe',
        email: 'john@example.com',
        fullName: 'John Doe',
        avatar: '/assets/微信图片.jpg',
        bio: 'Software developer passionate about creating amazing web experiences.',
        website: 'https://example.com',
        twitter: '@johndoe',
        github: 'johndoe',
        linkedin: 'johndoe'
      };
      setProfile(mockProfile);
      setFormData(mockProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // 验证社交链接格式
    if (['twitter', 'github', 'linkedin', 'website'].includes(name)) {
      const validation = validateSocialLink(name, value);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, [name]: validation.message || '' }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatar: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 在实际应用中，这里会调用API更新用户信息
      console.log('Updating profile:', formData);
      
      // 模拟API调用
      setTimeout(() => {
        setProfile(prev => ({ ...prev!, ...formData }) as UserProfile);
        setIsEditing(false);
        setSaveStatus({ success: true, message: '个人资料已成功更新!' });
        setTimeout(() => setSaveStatus(null), 3000);
      }, 500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveStatus({ success: false, message: '更新个人资料时出错，请重试。' });
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300">
        <GlassCard padding="lg" className="max-w-md w-full mx-4 border-border">
          <h2 className="text-2xl font-bold text-center mb-4 text-foreground">访问受限</h2>
          <p className="text-center text-muted-foreground mb-6">
            请先登录以查看您的个人资料
          </p>
          <div className="flex justify-center">
            <Button className="cursor-pointer transition-all duration-200">前往登录</Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl animate-fade-in-up">
        {saveStatus && (
          <div className={`mb-6 p-4 rounded-lg transition-all duration-300 ${
            saveStatus.success 
              ? 'bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/30'
          }`}>
            {saveStatus.message}
          </div>
        )}

        <GlassCard className="overflow-hidden border-border shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-scale-up">
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
                      onChange={handleAvatarUpload}
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
                  <AtSign className="w-4 h-4 text-primary" />
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
                    onClick={() => setIsEditing(true)} 
                    className="cursor-pointer transition-all duration-200 hover:scale-105"
                  >
                    <UserRound className="w-4 h-4 mr-2" />
                    编辑个人资料
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(profile);
                      }}
                      className="cursor-pointer transition-all duration-200 hover:scale-105"
                    >
                      取消
                    </Button>
                    <Button 
                      onClick={handleSubmit} 
                      className="cursor-pointer transition-all duration-200 hover:scale-105"
                    >
                      保存更改
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 p-6 space-y-8">
            {!isEditing && (
              <>
                <UserStats />
                <SkillCloud />
                <ActivityTimeline />
                <BadgeCollection />
              </>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-foreground flex items-center gap-1">
                      <User className="w-4 h-4" />
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
                      <LinkIcon className="w-4 h-4" />
                      个人网站
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website || ''}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className={`bg-muted border-border text-foreground placeholder:text-muted-foreground transition-colors duration-200 ${errors.website ? 'border-red-500' : ''}`}
                    />
                    {errors.website && (
                      <p className="text-red-500 text-sm">{errors.website}</p>
                    )}
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
                      className={`bg-muted border-border text-foreground placeholder:text-muted-foreground transition-colors duration-200 ${errors.twitter ? 'border-red-500' : ''}`}
                    />
                    {errors.twitter && (
                      <p className="text-red-500 text-sm">{errors.twitter}</p>
                    )}
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
                      className={`bg-muted border-border text-foreground placeholder:text-muted-foreground transition-colors duration-200 ${errors.github ? 'border-red-500' : ''}`}
                    />
                    {errors.github && (
                      <p className="text-red-500 text-sm">{errors.github}</p>
                    )}
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
                      className={`bg-muted border-border text-foreground placeholder:text-muted-foreground transition-colors duration-200 ${errors.linkedin ? 'border-red-500' : ''}`}
                    />
                    {errors.linkedin && (
                      <p className="text-red-500 text-sm">{errors.linkedin}</p>
                    )}
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
                          <LinkIcon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-200" />
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
                      <User className="w-4 h-4 text-primary" />
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
      </div>
    </div>
  );
}