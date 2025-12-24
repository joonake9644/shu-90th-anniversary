import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from './config';

/**
 * Firebase Auth 서비스
 * Infrastructure Layer - Firebase Auth 연동
 */

/**
 * 이메일/비밀번호로 로그인
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '로그인에 실패했습니다.';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * 로그아웃
 */
export async function logout(): Promise<void> {
  await signOut(auth);
}

/**
 * 인증 상태 변경 감지
 */
export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

/**
 * 현재 사용자 조회
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
