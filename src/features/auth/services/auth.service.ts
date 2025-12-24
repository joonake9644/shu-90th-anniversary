import { User } from 'firebase/auth';
import {
  loginWithEmail,
  logout as firebaseLogout,
  getCurrentUser,
  onAuthStateChange,
} from '@/infrastructure/firebase/auth.service';
import { AdminUser, LoginCredentials, AuthResult } from '@/domain/entities/user.entity';

/**
 * 인증 서비스
 * Application Layer - 비즈니스 로직
 * Infrastructure Layer의 Firebase Auth를 사용
 */
export class AuthService {
  /**
   * 로그인
   */
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    // 입력 검증
    if (!credentials.email || !credentials.password) {
      return {
        success: false,
        error: '이메일과 비밀번호를 입력해주세요.',
      };
    }

    // Firebase Auth 호출
    const result = await loginWithEmail(credentials.email, credentials.password);

    if (!result.success || !result.user) {
      return {
        success: false,
        error: result.error || '로그인에 실패했습니다.',
      };
    }

    // Firebase User → AdminUser 변환
    const adminUser = this.mapFirebaseUserToAdminUser(result.user);

    return {
      success: true,
      user: adminUser,
    };
  }

  /**
   * 로그아웃
   */
  async logout(): Promise<void> {
    await firebaseLogout();
  }

  /**
   * 현재 사용자 조회
   */
  getCurrentUser(): AdminUser | null {
    const firebaseUser = getCurrentUser();

    if (!firebaseUser) {
      return null;
    }

    return this.mapFirebaseUserToAdminUser(firebaseUser);
  }

  /**
   * 인증 상태 변경 감지
   */
  onAuthStateChange(callback: (user: AdminUser | null) => void): () => void {
    return onAuthStateChange((firebaseUser) => {
      const adminUser = firebaseUser
        ? this.mapFirebaseUserToAdminUser(firebaseUser)
        : null;
      callback(adminUser);
    });
  }

  /**
   * Firebase User → AdminUser 변환
   * @private
   */
  private mapFirebaseUserToAdminUser(firebaseUser: User): AdminUser {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || undefined,
      photoURL: firebaseUser.photoURL || undefined,
      role: 'admin', // 기본값, 추후 Firestore에서 조회 가능
      createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
      lastLoginAt: new Date(firebaseUser.metadata.lastSignInTime || Date.now()),
    };
  }
}

// 싱글톤 인스턴스 export
export const authService = new AuthService();
