'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { loginUser } from '@/services/userService';
import './form-styles.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginUser({ email, password });
      
      if (result.success && result.user) {
        router.push('/profile');
      } else {
        setError(result.error || '登录失败，请重试');
      }
    } catch (err) {
      setError('登录失败，请重试');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300 py-12 relative">
      <GlassCard
        padding="lg"
        className="w-full max-w-md mx-4 border-border shadow-2xl hover:shadow-[0_0_40px_var(--shadow-tech-cyan)] transition-all duration-500"
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-2 text-gradient-primary">
            欢迎回来
          </h1>
          <p className="text-muted-foreground">
            登录以访问您的个人资料
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-0">
          <div className="form-control">
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{ outline: 'none' }}
            />
            <label htmlFor="email" className="absolute top-4 left-0 pointer-events-none">
              {Array.from('Email').map((char, index) => (
                <span
                  key={index}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {char}
                </span>
              ))}
            </label>
            <Mail className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-300" />
          </div>

          <div className="form-control">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={{ outline: 'none' }}
            />
            <label htmlFor="password" className="absolute top-4 left-0 pointer-events-none">
              {Array.from('Password').map((char, index) => (
                <span
                  key={index}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {char}
                </span>
              ))}
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-600 dark:text-red-400 text-sm animate-fade-in-up mb-6">
              {error}
            </div>
          )}

          <div className="pt-4">
            <Button
              type="submit"
              variant="glass"
              className="w-full hover:scale-105 transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  <span>登录中...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>登录</span>
                </div>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-glass-border text-center">
          <p className="text-sm text-muted-foreground">
            还没有账号？
            <button
              type="button"
              onClick={() => router.push('/contact')}
              className="ml-2 text-tech-cyan hover:text-tech-lightcyan transition-colors font-medium cursor-pointer hover:underline disabled:opacity-50"
              disabled={loading}
            >
              联系我们
            </button>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
