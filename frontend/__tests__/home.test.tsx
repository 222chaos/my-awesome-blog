import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock the Button component to avoid complex dependencies in tests
jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) => (
    <button {...props}>{children}</button>
  ),
}));

describe('Home Page', () => {
  it('should render welcome heading', () => {
    render(<Home />);
    const heading = screen.getByText(/Welcome to My Awesome Blog/i);
    expect(heading).toBeInTheDocument();
  });

  it('should render call to action buttons', () => {
    render(<Home />);
    expect(screen.getByText('Read Articles')).toBeInTheDocument();
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });

  it('should render blog categories', () => {
    render(<Home />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
    expect(screen.getByText('Development')).toBeInTheDocument();
  });
});