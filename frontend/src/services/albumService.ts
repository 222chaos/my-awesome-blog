import { API_BASE_URL } from '@/config/api';

const API_URL = `${API_BASE_URL}/albums`;

// 获取所有相册
export const getAllAlbums = async (): Promise<Album[]> => {
  try {
    const response = await fetch(`${API_URL}/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching albums:', error);
    throw error;
  }
};

// 获取特色相册
export const getFeaturedAlbums = async (): Promise<Album[]> => {
  try {
    const response = await fetch(`${API_URL}/featured/list`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching featured albums:', error);
    throw error;
  }
};

// 根据ID获取特定相册
export const getAlbumById = async (id: string): Promise<Album> => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
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
    const response = await fetch(`${API_URL}/${albumId}/images`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching images for album ${albumId}:`, error);
    throw error;
  }
};