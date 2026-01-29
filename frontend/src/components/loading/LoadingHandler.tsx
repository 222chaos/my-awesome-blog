'use client';

import { useLoading } from '@/context/loading-context';
import Loader from '@/components/loading/Loader';

// 创建一个客户端包装组件来处理加载状态显示
export default function LoadingHandler({ children }: { children: React.ReactNode }) {
  const { isLoading } = useLoading();
  
  return (
    <>
      {children}
      {isLoading && <Loader />}
    </>
  );
}