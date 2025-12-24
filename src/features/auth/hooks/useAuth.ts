'use client';

import { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { AdminUser, LoginCredentials } from '@/domain/entities/user.entity';

/**
 * 인증 상태 관리 훅
 * Application Layer - 인증 상태를 React 컴포넌트에서 사용
 */
export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 인증 상태 변경 감지
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * 로그인
   */
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const result = await authService.login(credentials);

    if (result.success && result.user) {
      setUser(result.user);
      setLoading(false);
      return true;
    } else {
      setError(result.error || '로그인에 실패했습니다.');
      setLoading(false);
      return false;
    }
  };

  /**
   * 로그아웃
   */
  const logout = async (): Promise<void> => {
    setLoading(true);
    await authService.logout();
    setUser(null);
    setLoading(false);
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
