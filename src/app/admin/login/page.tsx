'use client';

import { LoginForm } from '@/components/admin/auth/LoginForm';

/**
 * 관리자 로그인 페이지
 * Presentation Layer - Page
 */
export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-black to-black" />

      {/* 로그인 폼 */}
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
