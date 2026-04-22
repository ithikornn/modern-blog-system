const TOKEN_KEY = 'admin_token';

export const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

export const setToken = (token: string) =>
  localStorage.setItem(TOKEN_KEY, token);

export const removeToken = () =>
  localStorage.removeItem(TOKEN_KEY);

export const isLoggedIn = () => !!getToken();