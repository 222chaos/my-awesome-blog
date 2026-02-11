## 修复登录API响应解析问题

### 问题分析
登录返回空对象 `{}`，可能原因：
1. 后端未正确返回JSON响应
2. 前端响应解析有误
3. CORS或网络问题导致响应被拦截

### 解决方案

**1. 修改 `frontend/src/lib/api/auth.ts` 第54-70行**

添加更详细的日志和响应解析：

```tsx
try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    console.log('[loginApi] 响应状态:', response.status, response.statusText);
    console.log('[loginApi] 响应头:', Object.fromEntries(response.headers.entries()));
    console.log('[loginApi] 响应类型:', response.headers.get('content-type'));

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorData = {};
      
      if (contentType && contentType.includes('application/json')) {
        try {
          errorData = await response.json();
        } catch (e) {
          console.error('[loginApi] JSON解析失败:', e);
          const text = await response.text();
          console.error('[loginApi] 响应文本:', text);
        }
      } else {
        const text = await response.text();
        console.error('[loginApi] 非JSON响应:', text);
      }
      
      console.error('[loginApi] 错误响应:', errorData);
      throw new Error(errorData.detail || errorData.message || `登录失败 (${response.status})`);
    }

    const data = await response.json();
    console.log('[loginApi] 成功响应:', data);
    // ... 其余代码不变
```

**2. 检查后端是否启动并监听正确端口**

确保后端运行在 `http://localhost:8989`