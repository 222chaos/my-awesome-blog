'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import ProfileHeader from '@/components/profile/ProfileHeader';
import EditModeForm from '@/components/profile/EditModeForm';
import AvatarUploader from '@/components/profile/AvatarUploader';
import UserStats from '@/components/profile/UserStats';
import SkillCloud from '@/components/profile/SkillCloud';
import ActivityTimeline from '@/components/profile/ActivityTimeline';
import BadgeCollection from '@/components/profile/BadgeCollection';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarUploader, setShowAvatarUploader] = useState(false);
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
        bio: 'Software developer passionate about creating amazing web experiences with modern technologies.',
        website: 'https://example.com',
        twitter: '@johndoe',
        github: 'johndoe',
        linkedin: 'johndoe'
      };
      setProfile(mockProfile);
      setFormData(mockProfile);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (avatar: string) => {
    setFormData(prev => ({ ...prev, avatar }));
    if (profile) {
      setProfile(prev => ({ ...prev!, avatar }));
    }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateSocialLink = (type: string, value: string) => {
    if (!value) return { isValid: true };
    
    let regex: RegExp;
    switch (type) {
      case 'twitter':
        regex = /^@[a-zA-Z0-9_]{1,15}$/;
        break;
      case 'github':
        regex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
        break;
      case 'linkedin':
        regex = /^[a-zA-Z0-9\-_]+$/;
        break;
      case 'website':
        regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        break;
      default:
        return { isValid: true };
    }
    
    return {
      isValid: regex.test(value),
      message: `Invalid ${type} format`
    };
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 在实际应用中，这里会调用API更新用户信息

      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      setProfile(prev => ({ ...prev!, ...formData }) as UserProfile);
      setIsEditing(false);
      setSaveStatus({ success: true, message: '个人资料已成功更新!' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {

      setSaveStatus({ success: false, message: '更新个人资料时出错，请重试。' });
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-tech-cyan/20 border-t-tech-cyan mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse rounded-full h-8 w-8 bg-tech-cyan/20" />
            </div>
          </div>
          <p className="mt-6 text-foreground text-lg font-medium animate-fade-in-up">加载中...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300">
        <GlassCard padding="lg" className="max-w-md w-full mx-4 border-tech-cyan/20 hover:shadow-[0_0_30px_var(--shadow-tech-cyan)] transition-all duration-300">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-tech-cyan/10 flex items-center justify-center animate-float">
              <svg className="w-8 h-8 text-tech-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2 text-gradient-primary">访问受限</h2>
            <p className="text-center text-muted-foreground mb-6">
              请先登录以查看您的个人资料
            </p>
            <div className="flex justify-center">
              <Button className="bg-tech-cyan hover:bg-tech-sky text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                前往登录
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl animate-fade-in-up">
        {saveStatus && (
          <div className={`mb-6 p-4 rounded-lg transition-all duration-300 animate-fade-in-up flex items-center gap-3 ${
            saveStatus.success 
              ? 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/30 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]' 
              : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]'
          }`}>
            {saveStatus.success ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="font-medium">{saveStatus.message}</span>
          </div>
        )}

        {/* 个人资料头部 */}
        <GlassCard padding="none" className="overflow-hidden border-tech-cyan/20 shadow-xl hover:shadow-[0_0_40px_var(--shadow-tech-cyan)] transition-all duration-500">
          <ProfileHeader
            profile={profile}
            isEditing={isEditing}
            onEditToggle={() => setIsEditing(!isEditing)}
          />
        </GlassCard>

        {/* 头像上传器 */}
        <AvatarUploader
          currentAvatar={formData.avatar}
          onAvatarChange={handleAvatarChange}
          isOpen={showAvatarUploader}
          onClose={() => setShowAvatarUploader(false)}
        />

        {/* 编辑模式表单或查看模式内容 */}
        {isEditing ? (
          <div className="mt-8 animate-fade-in-up">
            <EditModeForm
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsEditing(false);
                setFormData(profile);
                setErrors({});
              }}
            />
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {/* 数据概览 */}
            <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <UserStats />
            </div>

            {/* 技能云 */}
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <SkillCloud />
            </div>

            {/* 活动时间线 */}
            <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <ActivityTimeline />
            </div>

            {/* 成就徽章 */}
            <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <BadgeCollection />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
