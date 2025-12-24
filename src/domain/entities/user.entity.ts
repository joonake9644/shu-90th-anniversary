/**
 * 관리자 사용자 엔티티
 * Domain Layer - 순수 데이터 구조
 */
export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Date;
  lastLoginAt?: Date;
}

/**
 * 사용자 역할
 */
export type UserRole = 'admin' | 'editor' | 'viewer';

/**
 * 로그인 자격 증명
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * 인증 결과
 */
export interface AuthResult {
  success: boolean;
  user?: AdminUser;
  error?: string;
}
