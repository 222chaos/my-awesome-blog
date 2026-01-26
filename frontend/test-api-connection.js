// 测试 API 连接的简单脚本
async function testApiConnection() {
  console.log('Testing API connection...');
  
  // 模拟环境变量
  const env = {
    NEXT_PUBLIC_API_BASE_URL: 'http://localhost:8000/api'
  };
  
  // 使用与前端相同的逻辑构建 API URL
  const apiBaseUrl = env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';
  const apiUrl = `${apiBaseUrl}/v1/typewriter-contents/active`;
  
  console.log('API Base URL:', apiBaseUrl);
  console.log('Full API URL:', apiUrl);
  
  try {
    // 尝试连接到后端 API
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Successfully connected to backend API');
      console.log('Response data:', data);
      return true;
    } else {
      console.log('❌ API request failed with status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Network error connecting to API:', error.message);
    return false;
  }
}

// 在浏览器环境中运行测试
if (typeof window !== 'undefined') {
  testApiConnection();
} else {
  console.log('This test should run in a browser environment');
}