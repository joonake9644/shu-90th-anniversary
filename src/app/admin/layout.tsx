import type { Metadata } from "next";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayout";

export const metadata: Metadata = {
  title: "SHU 90주년 관리자",
  description: "삼육보건대학교 90주년 기념 홈페이지 관리 시스템",
};

/**
 * 관리자 페이지 전용 레이아웃
 * GlobalHeader를 표시하지 않음
 * AdminLayoutWrapper로 인증 체크 처리
 */
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
