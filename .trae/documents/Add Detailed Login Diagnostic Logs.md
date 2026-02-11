## 添加更详细的登录诊断日志

### 问题分析
后端返回空JSON对象 `{}`，需要查看完整的请求/响应信息

### 解决方案
修改 `frontend/src/lib/api/auth.ts`，在响应解析前添加原始响应检查：

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
    
    // 在解析JSON前先读取原始文本
    const responseText = await response.text();
    console.log('[loginApi] 原始响应文本:', responseText);

    if (!response.ok) {
      let errorData = {};
      
      try {
        if (responseText) {
            errorData = JSON.parse(responseText);
        }
      } catch (e) {
        console.error('[loginApi] JSON解析失败:', e);
      }
      
      console.error('[loginApi] 错误响应:', errorData);
      throw new Error(errorData.detail || errorData.message || `登录失败 (${response.status})`);
    }

    const data = JSON.parse(responseText);
    console.log('[loginApi] 成功响应:', data);

    // ... 其余代码不变
```