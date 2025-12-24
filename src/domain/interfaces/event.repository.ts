import { Event, CreateEventData, UpdateEventData, EventCategory } from '../entities/event.entity';

/**
 * 이벤트 Repository 인터페이스
 * Domain Layer - 구현체와 독립적인 계약
 */
export interface IEventRepository {
  /**
   * 모든 이벤트 조회
   */
  findAll(): Promise<Event[]>;

  /**
   * ID로 이벤트 조회
   */
  findById(id: string): Promise<Event | null>;

  /**
   * 카테고리별 이벤트 조회
   */
  findByCategory(category: EventCategory): Promise<Event[]>;

  /**
   * Featured 이벤트 조회
   */
  findFeatured(): Promise<Event | null>;

  /**
   * 이벤트 생성
   */
  create(data: CreateEventData): Promise<string>;

  /**
   * 이벤트 수정
   */
  update(id: string, data: UpdateEventData): Promise<void>;

  /**
   * 이벤트 삭제
   */
  delete(id: string): Promise<void>;
}
