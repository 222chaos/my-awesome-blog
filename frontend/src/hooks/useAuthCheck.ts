import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUserApi } from '@/lib/api/auth';

/**
 * 自定义Hook：检查用户认证状态
 * 如果用户未认证，则重定向到登录页面
 */
export const useAuthCheck = (extraCondition?: () => boolean) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUserApi();
      const conditionResult = extraCondition ? extraCondition() : true;

      if (!user || !conditionResult) {
        // 构造登录页面的完整URL
        const currentPath = window.location.pathname;
        const loginUrl = `/login?message=${encodeURIComponent('请先登录以查看您的个人资料')}&redirect=${encodeURIComponent(currentPath)}`;
        
        // 使用window.location进行导航以绕过Next.js的类型检查
        window.location.href = loginUrl;
      }
    };

    checkAuth();
  }, [extraCondition]); // 移除router和searchParams依赖，因为它们不是稳定的引用
};