const env = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8989/api/v1',
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8989/api/v1',
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  NEXT_PUBLIC_POSTS_PER_PAGE: process.env.NEXT_PUBLIC_POSTS_PER_PAGE || '10',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

export { env };
export type Env = typeof env;
