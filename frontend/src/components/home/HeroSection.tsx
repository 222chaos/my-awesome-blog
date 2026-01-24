'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0 gradient-bg"></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 z-10">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-glass-cyan opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 20}px`,
              height: `${Math.random() * 100 + 20}px`,
              animation: `pulse ${Math.random() * 10 + 10}s infinite alternate`
            }}
          ></div>
        ))}
      </div>
      
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.2; }
          100% { transform: scale(1.2); opacity: 0.4; }
        }
      `}</style>
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-16 text-center">
        <GlassCard 
          className="max-w-4xl mx-auto text-center backdrop-blur-xl border border-glass-border/30 shadow-2xl"
          padding="lg"
          floatEffect
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Welcome to My <span className="text-tech-cyan">Tech Blog</span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto animate-fade-in delay-100">
            Exploring the future of technology with cutting-edge insights and innovative solutions. 
            Join me on a journey through the digital landscape.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-200">
            <Button asChild variant="glass" size="lg">
              <Link href="/posts">Explore Articles</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}