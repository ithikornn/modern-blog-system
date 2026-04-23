const TOKEN_KEY = 'admin_token';
 
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY); 
};
 
export const setToken = (token: string): void => {
  sessionStorage.setItem(TOKEN_KEY, token); 
  document.cookie = `${TOKEN_KEY}=${token}; path=/; SameSite=Strict`;
};
 
export const removeToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY); 
  document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`;
};
 
export const isLoggedIn = (): boolean => !!getToken();