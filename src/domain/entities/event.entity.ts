import { Timestamp } from 'firebase/firestore';

/**
 * 이벤트 엔티티
 * Domain Layer - 핵심 비즈니스 로직과 무관한 순수 데이터 구조
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;            // YYYY-MM-DD 형식
  time: string;            // HH:MM - HH:MM 형식
  location: string;
  category: EventCategory;
  attendees: string;       // 예: "2000+", "500-1000"
  image: string;
  isFeatured: boolean;     // 메인 Featured 이벤트 여부
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * 이벤트 카테고리
 */
export type EventCategory =
  | 'ceremony'   // 기념식
  | 'academic'   // 학술
  | 'festival';  // 행사

/**
 * 이벤트 작성/수정 폼 데이터
 */
export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  attendees: string;
  image: string;
  isFeatured: boolean;
}

/**
 * 이벤트 생성 데이터 (ID 제외)
 */
export type CreateEventData = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * 이벤트 업데이트 데이터 (ID, 생성일 제외)
 */
export type UpdateEventData = Partial<Omit<Event, 'id' | 'createdAt'>>;
