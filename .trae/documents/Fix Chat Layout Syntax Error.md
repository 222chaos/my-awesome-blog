## 修复聊天页面布局的语法错误

### 问题分析
`'use client'`指令必须放在文件最顶部（在任何import之前），不能放在函数内部。当前`ClientLayout`函数中的`'use client'`位置错误。

### 解决方案
将`ClientLayout`组件移到单独的文件中

**创建文件：** `frontend/src/app/chat/ClientLayout.tsx`

```tsx
'use client';

import Navbar from '@/components/navigation/Navbar';
import ThemeWrapper from '@/components/theme-wrapper';
import { LoadingProvider } from '@/context/loading-context';
import LoadingHandler from '@/components/loading/LoadingHandler';
import { Toaster } from '@/components/ui/toaster';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <ThemeWrapper>
        <Navbar />
        <main className="bg-background min-h-screen">
          <LoadingHandler>{children}</LoadingHandler>
        </main>
        <Toaster />
      </ThemeWrapper>
    </LoadingProvider>
  );
}
```

**修改文件：** `frontend/src/app/chat/layout.tsx`

```tsx
import '../styles/globals.css';
import type { Metadata } from 'next';
import { Inter, Syne, Manrope } from 'next/font/google';
import { env } from '@/lib/env';
import ClientLayout from './ClientLayout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

export const metadata: Metadata = {
  title: 'AI 对话 - 我的优秀博客',
  description: '与AI模型进行对话',
  generator: 'Next.js',
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.variable} ${syne.variable} ${manrope.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
```

### 预期效果
- 修复语法错误，构建成功
- 客户端组件正确分离，符合Next.js规范