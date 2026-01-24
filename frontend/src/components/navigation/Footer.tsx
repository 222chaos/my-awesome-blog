import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-tech-darkblue pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">My Awesome Blog</h3>
            <p className="text-gray-300">
              A modern, enterprise-grade personal blog sharing insights on technology, design, and development.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-tech-cyan transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-gray-300 hover:text-tech-cyan transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-tech-cyan transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-tech-cyan transition-colors"
                >
                  Twitter
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
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Subscribe</h3>
            <p className="text-gray-300 mb-4">
              Get the latest posts delivered right to your inbox.
            </p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-md bg-glass border border-glass-border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tech-cyan"
              />
              <button className="px-4 py-2 bg-tech-cyan text-white rounded-md hover:bg-tech-lightcyan transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <GlassCard className="text-center py-6" padding="none">
          <p className="text-gray-300 text-sm">
            © {currentYear} My Awesome Blog. All rights reserved.
          </p>
        </GlassCard>
      </div>
    </footer>
  );
}