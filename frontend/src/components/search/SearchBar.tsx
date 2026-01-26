'use client';

import { useState, useEffect, useRef } from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { Input } from '../ui/input';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  href: string;
}

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className = '' }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 模拟搜索功能
  const mockSearch = async (searchQuery: string): Promise<SearchResult[]> => {
    // 实际项目中这里会调用API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 模拟结果
    return [
      {
        id: '1',
        title: `搜索结果: ${searchQuery}`,
        excerpt: '这是搜索结果的摘要...',
        category: '开发',
        href: `/posts/${searchQuery}`
      },
      {
        id: '2',
        title: `相关文章: ${searchQuery}`,
        excerpt: '这是另一篇相关文章的摘要...',
        category: '设计',
        href: `/posts/related-${searchQuery}`
      },
      {
        id: '3',
        title: `热门话题: ${searchQuery}`,
        excerpt: '关于这个话题的热门文章...',
        category: '技术',
        href: `/posts/hot-${searchQuery}`
      }
    ];
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await mockSearch(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('搜索失败:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      const timeoutId = setTimeout(() => {
        handleSearch(query);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="relative">
        <Input
          type="text"
          placeholder="搜索文章..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 py-2 w-full md:w-64 lg:w-80 rounded-full bg-glass border-glass-border backdrop-blur-md focus:ring-2 focus:ring-tech-cyan focus:outline-none"
          aria-label="搜索"
        />
        <SearchIcon 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          size={18} 
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="清除搜索"
          >
            <XIcon size={18} />
          </button>
        )}
      </div>

      {isOpen && (results.length > 0 || isLoading) && (
        <div 
          className="absolute z-50 mt-2 w-full md:w-96 bg-glass backdrop-blur-xl border border-glass-border rounded-xl shadow-lg overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="搜索结果"
        >
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              搜索中...
            </div>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {results.map((result) => (
                <li key={result.id}>
                  <a
                    href={result.href}
                    className="block p-4 hover:bg-glass-border/20 transition-colors border-b border-glass-border last:border-b-0"
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                    }}
                  >
                    <h3 className="font-medium text-foreground">{result.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{result.excerpt}</p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-glass rounded-full text-muted-foreground border border-glass-border">
                      {result.category}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}