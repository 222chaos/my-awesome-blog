import '../styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import ThemeWrapper from '@/components/theme-wrapper';
import { LoadingProvider } from '@/context/loading-context';
import LoadingHandler from '@/components/loading/LoadingHandler';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '我的优秀博客',
  description: '一个现代的企业级个人博客',
};

// 创建一个客户端包装组件来处理加载状态显示
const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <LoadingProvider>
      <ThemeWrapper>
        <Navbar />
        <main className="bg-background">
          <LoadingHandler>{children}</LoadingHandler>
        </main>
        <Footer />
      </ThemeWrapper>
    </LoadingProvider>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}