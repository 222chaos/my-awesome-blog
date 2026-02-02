'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/userService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = null, 
  redirectTo = '/login' 
}) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 使用 setTimeout 延迟检查认证状态，给认证系统一些时间来同步
    const timer = setTimeout(async () => {
      const checkAuth = async () => {
        try {
          const user = await getCurrentUser();
          if (user) {
            setIsAuthorized(true);
          } else {
            // 重定向到登录页面，并保留原始路径
            const currentPath = window.location.pathname;
            const encodedRedirectPath = encodeURIComponent(currentPath);
            const loginUrl = `${redirectTo}?message=${encodeURIComponent('请先登录以查看此页面')}&redirect=${encodedRedirectPath}`;
            window.location.href = loginUrl;
            setIsAuthorized(false);
          }
        } catch (error) {
          console.error('Error checking authentication:', error);
          // 发生错误时也重定向到登录页面
          const currentPath = window.location.pathname;
          const encodedRedirectPath = encodeURIComponent(currentPath);
          const loginUrl = `${redirectTo}?message=${encodeURIComponent('请先登录以查看此页面')}&redirect=${encodedRedirectPath}`;
          window.location.href = loginUrl;
          setIsAuthorized(false);
        }
      };

      checkAuth();
    }, 1000); // 延迟1000毫秒，确保认证状态同步

    return () => clearTimeout(timer);
  }, [redirectTo]);

  if (isAuthorized === null) {
    // 检查认证状态时显示加载状态
    return (
      <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300">
        <div className="text-center">
          <p className="text-foreground">检查认证状态中...</p>
        </div>
      </div>
    );
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return fallback;
};

export default ProtectedRoute;