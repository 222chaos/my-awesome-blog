import { setCookie, eraseCookie } from './cookie-utils';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const COOKIE_TOKEN_KEY = 'auth_token';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  setCookie(COOKIE_TOKEN_KEY, token, 7);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  eraseCookie(COOKIE_TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  if (!token) {
    return {};
  }
  return {
    'Authorization': `Bearer ${token}`
  };
};
