import { env } from '@/lib/env';

export const API_BASE_URL = env.NEXT_PUBLIC_API_URL || env.NEXT_PUBLIC_API_BASE_URL;
export const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
export const IS_DEVELOPMENT = env.NODE_ENV === 'development';
export const IS_PRODUCTION = env.NODE_ENV === 'production';
export const POSTS_PER_PAGE = parseInt(env.NEXT_PUBLIC_POSTS_PER_PAGE, 10);
