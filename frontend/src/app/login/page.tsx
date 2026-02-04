'use client';

import { Suspense } from 'react';
import LoginPageContent from './login-content';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">加载中...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
