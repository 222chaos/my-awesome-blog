import { NextRequest } from 'next/server';
import { Album } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8989/api/v1';

// GET /api/albums - 获取所有相册
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = searchParams.get('skip') || '0';
    const limit = searchParams.get('limit') || '100';

    // 从后端API获取相册数据
    const response = await fetch(`${API_BASE_URL}/albums?skip=${skip}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const albums: Album[] = await response.json();
    
    return Response.json({
      success: true,
      data: albums,
      message: '相册数据获取成功'
    });
  } catch (error) {
    console.error('获取相册数据失败:', error);
    
    return Response.json(
      {
        success: false,
        message: '获取相册数据失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}