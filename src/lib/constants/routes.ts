/**
 * 라우트 상수
 * 공통 유틸리티 - 계층 무관
 */

/**
 * 공개 페이지 라우트
 */
export const PUBLIC_ROUTES = {
  HOME: '/',
  HISTORY: '/history',
  ARCHIVE: '/archive',
  HIGHLIGHTS: '/highlights',
  NEWS: '/news',
  EVENTS: '/events',
  GUESTBOOK: '/guestbook',
  STATISTICS: '/statistics',
  VIDEO_HISTORY: '/video-history',
} as const;

/**
 * 관리자 페이지 라우트
 */
export const ADMIN_ROUTES = {
  LOGIN: '/admin/login',
  DASHBOARD: '/admin/dashboard',

  // 뉴스 관리
  NEWS_LIST: '/admin/content/news',
  NEWS_NEW: '/admin/content/news/new',
  NEWS_EDIT: (id: string) => `/admin/content/news/${id}/edit`,

  // 이벤트 관리
  EVENTS_LIST: '/admin/content/events',
  EVENTS_NEW: '/admin/content/events/new',
  EVENTS_EDIT: (id: string) => `/admin/content/events/${id}/edit`,

  // 방명록 관리
  GUESTBOOK: '/admin/content/guestbook',

  // 타임라인 관리
  TIMELINE: '/admin/content/timeline',

  // 미디어 라이브러리
  MEDIA: '/admin/media',

  // 설정
  SETTINGS: '/admin/settings',
} as const;

/**
 * API 라우트 (필요시)
 */
export const API_ROUTES = {
  NEWS: '/api/news',
  EVENTS: '/api/events',
} as const;
