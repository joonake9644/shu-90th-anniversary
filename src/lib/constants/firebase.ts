/**
 * Firebase 관련 상수
 * 공통 유틸리티 - 계층 무관
 */

/**
 * Firestore 컬렉션 이름
 */
export const COLLECTIONS = {
  NEWS: 'news',
  EVENTS: 'events',
  GUESTBOOK: 'guestbook',
  TIMELINE: 'timeline',
  STATISTICS: 'statistics',
  MEMORY_POSTS: 'memoryPosts',
  ALUMNI_PROFILES: 'alumniProfiles',
} as const;

/**
 * Firebase Storage 폴더
 */
export const STORAGE_FOLDERS = {
  NEWS: 'news',
  EVENTS: 'events',
  TIMELINE: 'timeline',
  GUESTBOOK: 'guestbook',
  UPLOADS: 'uploads',
} as const;

/**
 * 관리자 이메일 목록
 * (Firestore/Storage 규칙에서 사용)
 */
export const ADMIN_EMAILS = [
  'admin@shu.ac.kr',
  // 추가 관리자 이메일을 여기에 추가
] as const;

/**
 * 이미지 최적화 설정
 */
export const IMAGE_OPTIMIZATION = {
  MAX_WIDTH: 1920,
  QUALITY: 0.85,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;
