'use client';

import { useState } from 'react';
import { Bell, Moon, Sun, Globe, Lock, Palette, Mail } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/switch';

interface SettingsState {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  darkMode: boolean;
  autoSave: boolean;
  publicProfile: boolean;
  showEmail: boolean;
  language: string;
  timezone: string;
}

export default function SettingsView() {
  const [settings, setSettings] = useState<SettingsState>({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    darkMode: true,
    autoSave: true,
    publicProfile: true,
    showEmail: false,
    language: 'zh-CN',
    timezone: 'Asia/Shanghai'
  });

  const [saveStatus, setSaveStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleToggle = (key: keyof SettingsState) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    try {
      // 模拟保存设置
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus({ success: true, message: '设置已成功保存！' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus({ success: false, message: '保存失败，请稍后再试' });
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const SettingSection = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-tech-cyan" />
        <h4 className="font-semibold text-foreground">{title}</h4>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );

  const SettingItem = ({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: () => void }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--card)]/40 hover:bg-tech-cyan/10 transition-colors">
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        {description && <div className="text-xs text-muted-foreground mt-1">{description}</div>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );

  return (
    <div className="space-y-6">
      {saveStatus && (
        <div
          className={`p-4 rounded-lg transition-all duration-300 animate-fade-in-up ${
            saveStatus.success
              ? 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/30'
              : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/30'
          }`}
        >
          {saveStatus.message}
        </div>
      )}

      <GlassCard padding="lg" className="border-tech-cyan/20">
        <SettingSection icon={Bell} title="通知设置">
          <SettingItem
            label="邮件通知"
            description="接收关于您账户活动的重要邮件通知"
            checked={settings.emailNotifications}
            onChange={() => handleToggle('emailNotifications')}
          />
          <SettingItem
            label="推送通知"
            description="在浏览器中接收实时推送通知"
            checked={settings.pushNotifications}
            onChange={() => handleToggle('pushNotifications')}
          />
          <SettingItem
            label="每周摘要"
            description="每周接收一次活动摘要邮件"
            checked={settings.weeklyDigest}
            onChange={() => handleToggle('weeklyDigest')}
          />
        </SettingSection>

        <SettingSection icon={Mail} title="邮件订阅">
          <SettingItem
            label="新文章通知"
            description="当有新文章发布时通知您"
            checked={true}
            onChange={() => {}}
          />
          <SettingItem
            label="评论回复"
            description="有人回复您的评论时通知您"
            checked={true}
            onChange={() => {}}
          />
        </SettingSection>

        <SettingSection icon={Palette} title="外观设置">
          <SettingItem
            label="深色模式"
            description="使用深色主题以减少眼睛疲劳"
            checked={settings.darkMode}
            onChange={() => handleToggle('darkMode')}
          />
        </SettingSection>

        <SettingSection icon={Globe} title="隐私设置">
          <SettingItem
            label="公开资料"
            description="允许其他用户查看您的个人资料"
            checked={settings.publicProfile}
            onChange={() => handleToggle('publicProfile')}
          />
          <SettingItem
            label="显示邮箱"
            description="在公开资料中显示您的邮箱地址"
            checked={settings.showEmail}
            onChange={() => handleToggle('showEmail')}
          />
        </SettingSection>

        <SettingSection icon={Lock} title="安全设置">
          <SettingItem
            label="自动保存"
            description="编辑时自动保存草稿"
            checked={settings.autoSave}
            onChange={() => handleToggle('autoSave')}
          />
        </SettingSection>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            className="bg-tech-cyan hover:bg-tech-sky text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            保存设置
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
