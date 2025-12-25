import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 - SHU 90주년 관리자",
  description: "삼육보건대학교 90주년 기념 홈페이지 관리 시스템 로그인",
};

/**
 * 로그인 페이지 전용 레이아웃
 * AdminLayoutWrapper를 사용하지 않음 (인증 체크 제외)
 */
export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
