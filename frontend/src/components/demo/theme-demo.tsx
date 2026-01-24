'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/theme-context';
import GlassCard from '@/components/ui/GlassCard';

export default function ThemeDemo() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="container mx-auto px-4 py-16">
      <GlassCard className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">主题演示</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">当前主题状态</h3>
              <p>主题模式: <span className="font-semibold">{theme}</span></p>
              <p>解析后的主题: <span className="font-semibold">{resolvedTheme}</span></p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => setTheme('light')} 
                variant={theme === 'light' ? 'default' : 'outline'}
              >
                浅色模式
              </Button>
              <Button 
                onClick={() => setTheme('dark')} 
                variant={theme === 'dark' ? 'default' : 'outline'}
              >
                深色模式
              </Button>
              <Button 
                onClick={() => setTheme('auto')} 
                variant={theme === 'auto' ? 'default' : 'outline'}
              >
                系统默认
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <GlassCard padding="md" hoverEffect={true}>
                <h4 className="font-medium mb-2">玻璃卡片示例</h4>
                <p>这是一个主题感知的玻璃卡片组件，会根据当前主题自动调整样式。</p>
              </GlassCard>
              
              <Card className="p-4">
                <h4 className="font-medium mb-2">普通卡片示例</h4>
                <p>这是一个普通的卡片组件，不受主题切换影响。</p>
              </Card>
            </div>
          </div>
        </CardContent>
      </GlassCard>
    </div>
  );
}