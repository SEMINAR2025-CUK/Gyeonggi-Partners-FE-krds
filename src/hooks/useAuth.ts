import { useState, useEffect } from 'react';

interface UserInfo {
  userId: number;
  nickname: string;
  email?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // sessionStorage에서 사용자 정보 로드
    const userInfoStr = sessionStorage.getItem('userInfo');
    const token = sessionStorage.getItem('accessToken');

    if (userInfoStr && token) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        setUser(userInfo);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user info:', error);
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  }, []);

  const login = (userInfo: UserInfo, token: string) => {
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    sessionStorage.setItem('accessToken', token);
    setUser(userInfo);
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('accessToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
  };
};