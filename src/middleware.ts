import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware
 * /admin/* 경로 보호
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin 경로 보호 (로그인 페이지 제외)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Firebase Auth 토큰 확인
    // Note: Next.js middleware에서는 Firebase Auth를 직접 확인하기 어려움
    // 클라이언트 측 useAuthGuard에서 보호 처리

    // 향후 쿠키 기반 인증 추가 시 여기서 체크 가능
    // const authCookie = request.cookies.get('auth-token');
    // if (!authCookie) {
    //   return NextResponse.redirect(new URL('/admin/login', request.url));
    // }
  }

  return NextResponse.next();
}

/**
 * Middleware 적용 경로
 */
export const config = {
  matcher: '/admin/:path*',
};
