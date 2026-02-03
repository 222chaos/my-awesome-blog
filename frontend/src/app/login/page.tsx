'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { loginUser } from '@/services/userService';
import { useLoading } from '@/context/loading-context';
import './form-styles.css';

// 提取使用 searchParams 的逻辑到单独的组件中
function LoginFormContent() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // 获取URL参数
  const { isLoading, showLoading, hideLoading } = useLoading();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 客户端验证
    if (!username || !password) {
      setError('请填写所有必填字段');
      return;
    }

    // 验证用户名长度
    if (username.length < 3) {
      setError('用户名长度至少为3位');
      return;
    }

    // 验证密码长度
    if (password.length < 6) {
      setError('密码长度至少为6位');
      return;
    }

    showLoading();

    try {
      const result = await loginUser({ username, password });

      if (result.success && result.user) {
        console.log('Login successful, attempting to navigate');
        // 登录成功后，检查是否有重定向参数
        const redirectParam = searchParams.get('redirect');
        const redirectPath = redirectParam ? decodeURIComponent(redirectParam) : '/profile';
        console.log('Redirect path:', redirectPath);

        // 确保重定向路径是安全的，只允许内部路径
        if (redirectPath.startsWith('/') && !redirectPath.startsWith('//')) {
          // 使用 window.location.href 强制页面刷新，确保中间件能读取到新设置的 cookie
          console.log('Navigating to:', redirectPath);
          window.location.href = redirectPath;
        } else {
          // 如果重定向路径不安全，则默认导航到主页
          console.log('Navigating to default profile page');
          window.location.href = '/profile';
        }
      } else {
        console.log('Login failed:', result.error);
        setError(result.error || '登录失败，请重试');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请重试');
      console.error('Login error:', err);
    } finally {
      hideLoading();
    }
  };

  if (!mounted) {
    return null;
  }

  // 从URL参数获取消息
  const message = searchParams.get('message');

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* 背景图片层 - 最底层 (由CSS控制z-index) */}
      <div className="login-page" />
      {/* 渐变遮罩层 - 中间层 */}
      <div className="absolute inset-0 bg-gradient-to-br from-tech-cyan/10 via-purple-500/15 to-pink-500/10 animate-gradient-shift pointer-events-none" />
      {/* 漂浮的粒子效果 - 上层 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-tech-cyan/10 rounded-full blur-3xl animate-float-1" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float-2" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float-3" />
      </div>

      {/* 登录卡片 - 最顶层 */}
      <div className="relative z-50 p-4">
        <div
          className="bg-glass/90 backdrop-blur-2xl border border-glass-border rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-card-appear"
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            background: 'rgba(15, 23, 42, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              欢迎回来
            </h1>
            <p className="text-gray-300">
              登录以访问您的个人资料
            </p>
            {message && (
              <p className="text-yellow-300 mt-2 text-sm">
                {message}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="bg-transparent"
              />
              <label htmlFor="username" className="absolute pointer-events-none text-white/80">
                {Array.from('用户名').map((char, index) => (
                  <span
                    key={index}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    {char}
                  </span>
                ))}
              </label>
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-tech-cyan" />
            </div>

            <div className="form-control">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-transparent"
              />
              <label htmlFor="password" className="absolute pointer-events-none text-white/80">
                {Array.from('密码').map((char, index) => (
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-tech-cyan hover:text-white transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm animate-shake">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="default"
              className="w-full hover:scale-105 transition-all duration-200 bg-tech-cyan hover:bg-tech-lightcyan text-black font-semibold py-3 shadow-lg shadow-tech-cyan/30"
            >
              <div className="flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                <span>登录</span>
              </div>
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-gray-300">
              还没有账号？
              <button
                type="button"
                onClick={() => router.push('/contact' as any)}
                className="ml-2 text-tech-cyan hover:text-white transition-colors font-medium cursor-pointer hover:underline disabled:opacity-50"
                disabled={isLoading}
              >
                联系我们
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 默认导出组件，用 Suspense 包裹
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载中...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}