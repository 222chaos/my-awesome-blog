'use client';

import React, { Component, type ReactNode } from 'react';
import type { ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props;

    console.error('ErrorBoundary caught an error:', error, errorInfo);

    if (onError) {
      onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    const { children, fallback } = this.props;
    const { hasError, error } = this.state;

    if (hasError) {
      if (fallback) {
        return <>{fallback}</>;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md mx-4 p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                出现了问题
              </h1>
              <p className="text-muted-foreground mb-6">
                抱歉，应用遇到了一个错误。请刷新页面或联系支持团队。
              </p>
            </div>

            {error && (
              <details className="mb-6">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                  查看错误详情
                </summary>
                <pre className="mt-4 p-4 bg-card rounded-lg text-sm overflow-auto max-h-64 border">
                  <code className="text-destructive">
                    {error.toString()}
                  </code>
                </pre>
              </details>
            )}

            <div className="flex flex-col gap-4">
              <button
                onClick={this.handleReset}
                className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                重试
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full py-3 px-6 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors"
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      );
    }

    return <>{children}</>;
  }
}
