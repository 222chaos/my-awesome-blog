'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import GlassCard from '@/components/ui/GlassCard';
import { useTheme } from '@/context/theme-context';
import { UploadIcon, CameraIcon } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { apiClient } from '@/lib/api-client';

export default function ProfilePage() {
  const { resolvedTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<{success: boolean; message: string} | null>(null);

  useEffect(() => {
    // 获取用户信息
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // 在实际应用中，这里会调用API获取用户信息
      // 为了演示目的，我们使用模拟数据
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
      // 如果API调用失败，也可以显示错误消息
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tech-cyan mx-auto"></div>
          <p className="mt-4 text-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <GlassCard className="p-8 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-center mb-4">访问受限</h2>
          <p className="text-center text-muted-foreground mb-6">
            请先登录以查看您的个人资料
          </p>
          <div className="flex justify-center">
            <Button>前往登录</Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-tech-cyan to-tech-lightcyan bg-clip-text text-transparent">
            个人资料
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            管理您的个人信息和偏好设置
          </p>
        </div>

        {saveStatus && (
          <div className={`mb-6 p-4 rounded-lg ${saveStatus.success ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
            {saveStatus.message}
          </div>
        )}

        <Card className="glass-card overflow-hidden">
          <CardHeader className="bg-glass/30 pb-4">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-glass-border">
                  {formData.avatar ? (
                    <img 
                      src={formData.avatar} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-glass flex items-center justify-center">
                      <span className="text-2xl">
                        {formData.fullName?.charAt(0) || (formData.username ? formData.username.charAt(0) : '?')}
                      </span>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute bottom-0 right-0 bg-tech-cyan p-2 rounded-full cursor-pointer hover:bg-tech-lightcyan transition-colors"
                  >
                    <CameraIcon className="w-4 h-4 text-white" />
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
              <div className="text-center md:text-left">
                <CardTitle className="text-2xl">
                  {isEditing ? (
                    <Input
                      name="fullName"
                      value={formData.fullName || ''}
                      onChange={handleInputChange}
                      className="text-2xl font-bold bg-transparent border-none focus:border-tech-cyan w-full"
                    />
                  ) : (
                    formData.fullName || formData.username
                  )}
                </CardTitle>
                <p className="text-muted-foreground">@{formData.username}</p>
                <p className="text-muted-foreground">{formData.email}</p>
              </div>
              <div className="md:ml-auto mt-4 md:mt-0">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
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
                    >
                      取消
                    </Button>
                    <Button onClick={handleSubmit}>
                      保存更改
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">用户名</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username || ''}
                      onChange={handleInputChange}
                      readOnly
                      className="bg-glass"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      className="bg-glass"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">网站</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website || ''}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className="bg-glass"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      name="twitter"
                      value={formData.twitter || ''}
                      onChange={handleInputChange}
                      placeholder="@username"
                      className="bg-glass"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      name="github"
                      value={formData.github || ''}
                      onChange={handleInputChange}
                      placeholder="username"
                      className="bg-glass"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin || ''}
                      onChange={handleInputChange}
                      placeholder="username"
                      className="bg-glass"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">简介</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="bg-glass"
                    placeholder="介绍一下自己..."
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-foreground mb-2">联系信息</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex justify-between border-b border-glass-border pb-2">
                        <span>邮箱</span>
                        <span className="text-foreground">{formData.email}</span>
                      </li>
                      {formData.website && (
                        <li className="flex justify-between border-b border-glass-border pb-2">
                          <span>网站</span>
                          <a 
                            href={formData.website.startsWith('http') ? formData.website : `https://${formData.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-tech-cyan hover:underline"
                          >
                            {formData.website}
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-2">社交媒体</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      {formData.twitter && (
                        <li className="flex justify-between border-b border-glass-border pb-2">
                          <span>Twitter</span>
                          <a 
                            href={`https://twitter.com/${formData.twitter.replace('@', '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-tech-cyan hover:underline"
                          >
                            {formData.twitter}
                          </a>
                        </li>
                      )}
                      {formData.github && (
                        <li className="flex justify-between border-b border-glass-border pb-2">
                          <span>GitHub</span>
                          <a 
                            href={`https://github.com/${formData.github}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-tech-cyan hover:underline"
                          >
                            {formData.github}
                          </a>
                        </li>
                      )}
                      {formData.linkedin && (
                        <li className="flex justify-between border-b border-glass-border pb-2">
                          <span>LinkedIn</span>
                          <a 
                            href={`https://linkedin.com/in/${formData.linkedin}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-tech-cyan hover:underline"
                          >
                            {formData.linkedin}
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                {formData.bio && (
                  <div>
                    <h3 className="font-medium text-foreground mb-2">简介</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{formData.bio}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}