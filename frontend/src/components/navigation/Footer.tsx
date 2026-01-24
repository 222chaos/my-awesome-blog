import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-tech-darkblue pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">我的优秀博客</h3>
            <p className="text-gray-300">
              一个现代的企业级个人博客，分享关于技术、设计和开发的见解。
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">导航</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-tech-cyan transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-gray-300 hover:text-tech-cyan transition-colors">
                  文章
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-tech-cyan transition-colors">
                  关于
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">联系方式</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-tech-cyan transition-colors"
                >
                  推特
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-tech-cyan transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-tech-cyan transition-colors"
                >
                  领英
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">订阅</h3>
            <p className="text-gray-300 mb-4">
              获取最新文章，直接发送到您的邮箱。
            </p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="您的邮箱"
                className="px-4 py-2 rounded-md bg-glass border border-glass-border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tech-cyan"
              />
              <button className="px-4 py-2 bg-tech-cyan text-white rounded-md hover:bg-tech-lightcyan transition-colors">
                订阅
              </button>
            </div>
          </div>
        </div>
        
        <GlassCard className="text-center py-6" padding="none">
          <p className="text-gray-300 text-sm">
            © {currentYear} 我的优秀博客. 保留所有权利。
          </p>
        </GlassCard>
      </div>
    </footer>
  );
}