'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';

/**
 * 관리자 로그인 폼 컴포넌트
 */
export function LoginForm() {
  const router = useRouter();
  const { login, error: authError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }
    if (!password.trim()) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const success = await login({ email, password });

      if (success) {
        router.push(ADMIN_ROUTES.DASHBOARD);
      } else {
        setError(authError || '로그인에 실패했습니다.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-amber-500 mb-2">
          SHU 90주년 관리자
        </h1>
        <p className="text-gray-400">
          삼육보건대학교 90주년 기념 홈페이지 관리 시스템
        </p>
      </div>

      {/* 로그인 폼 */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-white/10 rounded-2xl p-8 space-y-6"
      >
        {/* 에러 메시지 */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* 이메일 */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            이메일
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 bg-black border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="admin@example.com"
            autoComplete="email"
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 bg-black border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>

        {/* 안내 메시지 */}
        <p className="text-center text-sm text-gray-500">
          관리자 계정으로만 로그인할 수 있습니다.
        </p>
      </form>
    </div>
  );
}
