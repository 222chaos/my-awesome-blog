import '../../styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeWrapper from '@/components/theme-wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '登录 - 我的优秀博客',
  description: '登录以访问您的个人资料',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.className} bg-background`}>
        <ThemeWrapper>
          <main className="bg-background min-h-screen">{children}</main>
        </ThemeWrapper>
      </body>
    </html>
  );
}

