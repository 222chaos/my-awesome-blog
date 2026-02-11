## 修复根布局导致的外部滚动

### 问题分析
根布局结构：
- Navbar (64px)
- `<main className="min-h-screen">` (最小100vh)
- Footer (~32px)

总高度：64px + 100vh + 32px > 100vh，导致滚动

### 解决方案

**修改 `frontend/src/app/layout.tsx` 第23-36行**

使用 flex 布局让 main 区域占据剩余空间，而不是固定高度：

```tsx
const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <LoadingProvider>
      <ThemeWrapper>
        <div className="flex flex-col min-h-screen bg-background">
          <Navbar />
          <main className="flex-1">
            <LoadingHandler>{children}</LoadingHandler>
          </main>
          <Footer />
          <Toaster />
        </div>
      </ThemeWrapper>
    </LoadingProvider>
  );
};
```