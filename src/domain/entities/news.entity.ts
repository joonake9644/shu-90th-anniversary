import { Timestamp } from 'firebase/firestore';

/**
 * 뉴스 엔티티
 * Domain Layer - 핵심 비즈니스 로직과 무관한 순수 데이터 구조
 */
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  thumbnail: string;
  author: string;
  category: NewsCategory;
  publishedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * 뉴스 카테고리
 */
export type NewsCategory =
  | 'anniversary'  // 90주년
  | 'achievement'  // 성과
  | 'event'        // 행사
  | 'general';     // 일반

/**
 * 뉴스 작성/수정 폼 데이터
 */
export interface NewsFormData {
  title: string;
  summary: string;
  content: string;
  thumbnail: string;
  author: string;
  category: NewsCategory;
}

/**
 * 뉴스 생성 데이터 (ID 제외)
 */
export type CreateNewsData = Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>;

/**
 * 뉴스 업데이트 데이터 (ID, 생성일 제외)
 */
export type UpdateNewsData = Partial<Omit<NewsArticle, 'id' | 'createdAt'>>;
