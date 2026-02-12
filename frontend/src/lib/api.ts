// API utilities for the blog

export interface TypewriterContent {
  id: string;  // UUID from backend
  text: string;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

/**
 * 获取活动的打字机内容
 * @returns Promise<TypewriterContent[]>
 */
export async function getActiveTypewriterContents(): Promise<TypewriterContent[]> {
  try {
    const response = await fetch('/api/v1/typewriter-contents/active');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch typewriter contents:', error);
    // 返回空数组作为 fallback
    return [];
  }
}

// 其他 API 函数可以在这里添加