'use client';

import { useRef, useEffect } from 'react';
import { useTheme } from '@/context/theme-context';

const MatrixCodeRain = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const { resolvedTheme } = useTheme();
  const frameCount = useRef(0);
  
  // 字符集：英文字母、特殊符号和数字
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const fontSize = 20;
  let drops: number[] = [];
  let columnActive: boolean[] = [];
  let columnChars: string[] = []; // 存储每列当前显示的字符
  
  const getRandomChar = () => characters.charAt(Math.floor(Math.random() * characters.length));
  
  const initDrops = (width: number) => {
    const columns = Math.floor(width / fontSize);
    const center = columns / 2;
    
    drops = Array(columns).fill(1);
    // 中间稀疏，两侧密集的概率分布
    columnActive = Array(columns).fill(false).map((_, i) => {
      const distanceFromCenter = Math.abs(i - center) / center; // 0~1，中心为0，两侧为1
      const probability = 0.2 + distanceFromCenter * 0.8; // 中心20%概率，两侧100%概率
      return Math.random() < probability;
    });
    
    // 初始化每列的字符
    columnChars = Array(columns).fill('').map(() => getRandomChar());
    
    return columns;
  };
  
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // 使用半透明黑色背景创建尾迹效果
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);
    
    // 设置字体样式
    ctx.font = `${fontSize}px monospace`;
    
    const columns = Math.floor(width / fontSize);
    
    // 每6帧更新一次位置，减缓下滑速度
    const shouldUpdatePosition = frameCount.current % 6 === 0;
    // 每12帧更新一次字符，减缓字符变换速度
    const shouldUpdateChars = frameCount.current % 12 === 0;
    
    // 绘制每一列的字符
    for (let i = 0; i < drops.length; i++) {
      // 跳过非活跃列（中间区域稀疏）
      if (!columnActive[i]) continue;
      
      // 更新字符（仅在特定帧）
      if (shouldUpdateChars) {
        columnChars[i] = getRandomChar();
      }
      const text = columnChars[i];
      
      // 随机选择颜色：使用 tech-cyan 和 tech-lightcyan
      const isHighlight = Math.random() > 0.9;
      ctx.fillStyle = isHighlight ? '#10b981' : '#059669';
      
      // 绘制字符
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillText(text, x, y);
      
      if (shouldUpdatePosition) {
        // 字符到达底部时随机重置到顶部
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // 向下移动
        drops[i]++;
      }
    }
    
    frameCount.current++;
    animationRef.current = requestAnimationFrame(draw);
  };
  
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const parent = canvas.parentElement;
    if (!parent) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    
    // 重新初始化下落位置
    initDrops(rect.width);
  };
  
  useEffect(() => {
    // 只在深色主题时渲染
    if (resolvedTheme !== 'dark') {
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    resizeCanvas();
    draw();
    
    let resizeTimeout: ReturnType<typeof setTimeout>;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        resizeCanvas();
        draw();
      }, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [resolvedTheme]);
  
  // 如果不是深色主题，不渲染 Canvas
  if (resolvedTheme !== 'dark') {
    return null;
  }
  
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default MatrixCodeRain;
