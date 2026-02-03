import { Album } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

// 获取所有相册
export const getAllAlbums = async (): Promise<Album[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolios`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.items || data; // 根据API返回格式调整
  } catch (error) {
    console.error('Error fetching albums:', error);
    throw error;
  }
};

// 获取特色相册
export const getFeaturedAlbums = async (): Promise<Album[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolios?featured=true`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.items || data; // 根据API返回格式调整
  } catch (error) {
    console.error('Error fetching featured albums:', error);
    throw error;
  }
};

// 根据ID获取特定相册
export const getAlbumById = async (id: string): Promise<Album> => {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolios/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching album with id ${id}:`, error);
    throw error;
  }
};

// 获取相册内的图片
export const getAlbumImages = async (albumId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolios/${albumId}/images`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching images for album ${albumId}:`, error);
    throw error;
  }
};