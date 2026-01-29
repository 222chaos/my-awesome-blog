import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { ThemeProvider } from '@/context/theme-context';

// Mock the Button component to avoid complex dependencies in tests
jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) => (
    <button {...props}>{children}</button>
  ),
}));

// 创建一个带ThemeProvider的包装组件
const HomeWithProvider = () => (
  <ThemeProvider>
    <Home />
  </ThemeProvider>
);

describe('Home Page', () => {
  it('should render welcome heading', () => {
    render(<HomeWithProvider />);
    // 根据实际页面内容调整测试文本
    const heading = screen.getByText('POETIZE');
    expect(heading).toBeInTheDocument();
  });

  it('should render call to action buttons', async () => {
    render(<HomeWithProvider />);
    // 查找文章列表中的"查看更多文章"按钮
    const viewMoreBtn = await screen.findByLabelText('查看更多文章');
    expect(viewMoreBtn).toBeInTheDocument();
  });

  it('should render blog categories', () => {
    render(<HomeWithProvider />);
    // 根据实际页面内容调整测试文本
    expect(screen.getByText('开发')).toBeInTheDocument();
    expect(screen.getByText('设计')).toBeInTheDocument();
    expect(screen.getByText('后端')).toBeInTheDocument();
  });
});