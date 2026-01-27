'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import EditModeForm from './components/EditModeForm';
import TabNavigation from './components/TabNavigation';
import StatsGrid from './components/StatsGrid';
import SettingsView from './components/SettingsView';
import ActivityView from './components/ActivityView';
import { UserProfile, getMockUserProfile, getMockUserStats, UserStats } from '@/lib/api/profile';
import { FormErrors, validateForm, sanitizeFormData } from '@/lib/validation/profileValidation';

type TabType = 'profile' | 'settings' | 'activity';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saveStatus, setSaveStatus] = useState<{success: boolean; message: string} | null>(null);

  useEffect(() => {
    fetchUserProfile();
    fetchUserStats();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // 在实际项目中，使用 fetchCurrentUserProfile()
      const mockProfile = getMockUserProfile();
      setProfile(mockProfile);
      setFormData(mockProfile);
    } catch (error) {
      console.error('获取用户资料失败:', error);
      setSaveStatus({ success: false, message: '获取用户资料失败' });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      setStatsLoading(true);
      // 在实际项目中，使用 fetchCurrentUserStats()
      const mockStats = getMockUserStats();
      setStats(mockStats);
    } catch (error) {
      console.error('获取用户统计数据失败:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleSave = async (data: Partial<UserProfile>) => {
    // 表单验证
    const validationErrors = validateForm(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // 清理表单数据
      const sanitizedData = sanitizeFormData(data);
      
      // 在实际项目中，使用 updateUserProfile(sanitizedData)
      setProfile(prev => ({ ...prev!, ...sanitizedData }) as UserProfile);
      setIsEditing(false);
      setErrors({});
      setSaveStatus({ success: true, message: '个人资料已成功更新!' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('更新用户资料失败:', error);
      setSaveStatus({ success: false, message: '更新失败，请稍后再试' });
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(profile || {});
    setErrors({});
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
        <GlassCard padding="lg" className="max-w-md w-full mx-4 border-tech-cyan/20 backdrop-blur-xl bg-card/40 hover:shadow-[0_0_30px_var(--shadow-tech-cyan)] transition-all duration-300">
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

        {/* 选项卡导航 */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 不同选项卡的内容 */}
        <div className="animate-fade-in-up">
          {activeTab === 'profile' && (
            <div className="space-y-8">
              {/* 统计数据 */}
              <StatsGrid stats={stats!} loading={statsLoading} />

              {/* 编辑模式表单或查看模式内容 */}
              {isEditing ? (
                <EditModeForm
                  initialData={formData}
                  onSave={handleSave}
                  onCancel={handleCancelEdit}
                  errors={errors}
                />
              ) : (
                <GlassCard padding="lg" className="border-tech-cyan/20 backdrop-blur-xl bg-card/40 hover:shadow-[0_0_30px_var(--shadow-tech-cyan)] transition-all duration-300">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-foreground mb-4">个人资料</h3>
                    <p className="text-muted-foreground">
                      {profile.bio || '这个人很懒，还没有填写个人简介。'}
                    </p>
                  </div>
                </GlassCard>
              )}
            </div>
          )}
          
          {activeTab === 'settings' && <SettingsView />}
          {activeTab === 'activity' && <ActivityView />}
        </div>
      </div>
    </div>
  );
}
