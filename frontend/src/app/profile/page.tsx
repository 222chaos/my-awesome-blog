'use client';

import { useState, useEffect } from 'react';
import { Mail, Globe, Twitter, Github, Linkedin, User, UserRound, AtSign, Link as LinkIcon, MapPin, Calendar } from 'lucide-react';
import { UserProfile, getMockUserProfile, getMockUserStats, UserStats } from '@/lib/api/profile';
import { validateSocialLink } from '@/services/userService';
import TabNavigation from './components/TabNavigation';
import ProfileView from './components/ProfileView';
import SettingsView from './components/SettingsView';
import ActivityView from './components/ActivityView';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'activity'>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<{success: boolean; message: string} | null>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const profileData = await getMockUserProfile();
      const statsData = await getMockUserStats();
      setProfile(profileData);
      setStats(statsData);
      setFormData(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev: Partial<UserProfile>) => ({
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
        setProfile((prev: UserProfile | null) => ({ ...prev!, ...formData }) as UserProfile);
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
        <div className="p-8 max-w-md w-full mx-4 border-border">
          <h2 className="text-2xl font-bold text-center mb-4 text-foreground">访问受限</h2>
          <p className="text-center text-muted-foreground mb-6">
            请先登录以查看您的个人资料
          </p>
          <div className="flex justify-center">
            <button className="cursor-pointer transition-all duration-200 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
              前往登录
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl">
        {saveStatus && (
          <div className={`mb-6 p-4 rounded-lg transition-all duration-300 ${
            saveStatus.success 
              ? 'bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/30'
          }`}>
            {saveStatus.message}
          </div>
        )}

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">个人中心</h1>
          <p className="text-muted-foreground mt-2">管理您的个人资料、设置和活动</p>
        </div>

        <TabNavigation activeTab={activeTab} setActiveTab={(tab: string) => setActiveTab(tab as 'profile' | 'settings' | 'activity')} />

        <div className="mt-6">
          {activeTab === 'profile' && (
            <ProfileView
              profile={profile}
              isEditing={isEditing}
              setEditing={setIsEditing}
              formData={formData}
              setFormData={setFormData}
              onSave={() => handleSubmit(new Event('submit') as unknown as React.FormEvent)}
              onCancel={() => {
                setIsEditing(false);
                setFormData(profile);
              }}
              onAvatarChange={handleAvatarUpload}
            />
          )}
          
          {activeTab === 'settings' && <SettingsView />}
          
          {activeTab === 'activity' && <ActivityView />}
        </div>

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="bg-glass/70 backdrop-blur-xl border border-glass-border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-tech-cyan">{stats.posts}</p>
              <p className="text-sm text-muted-foreground">文章数</p>
            </div>
            <div className="bg-glass/70 backdrop-blur-xl border border-glass-border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-tech-cyan">{stats.followers}</p>
              <p className="text-sm text-muted-foreground">关注者</p>
            </div>
            <div className="bg-glass/70 backdrop-blur-xl border border-glass-border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-tech-cyan">{stats.following}</p>
              <p className="text-sm text-muted-foreground">关注</p>
            </div>
            <div className="bg-glass/70 backdrop-blur-xl border border-glass-border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-tech-cyan">{stats.likes}</p>
              <p className="text-sm text-muted-foreground">获赞数</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}