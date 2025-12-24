/**
 * Firebase 설정
 * Infrastructure Layer - 기존 Firebase 설정을 재사용
 *
 * Note: 기존 src/lib/firebase.ts를 그대로 사용하여 중복을 방지합니다.
 * 관리자 페이지와 공개 페이지가 같은 Firebase 프로젝트를 공유합니다.
 */

// 기존 Firebase 설정을 그대로 재export
export { auth, db, storage } from '@/lib/firebase';
