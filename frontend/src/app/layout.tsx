import '../styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import ThemeWrapper from '@/components/theme-wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '我的优秀博客',
  description: '一个现代的企业级个人博客',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background`}>
        <ThemeWrapper>
          <Navbar />
          <main className="bg-background">{children}</main>
          <Footer />
        </ThemeWrapper>
      </body>
    </html>
  );
}