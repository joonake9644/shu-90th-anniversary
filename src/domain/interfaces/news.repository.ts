import { NewsArticle, CreateNewsData, UpdateNewsData, NewsCategory } from '../entities/news.entity';

/**
 * 뉴스 Repository 인터페이스
 * Domain Layer - 구현체와 독립적인 계약
 */
export interface INewsRepository {
  /**
   * 모든 뉴스 조회
   */
  findAll(): Promise<NewsArticle[]>;

  /**
   * ID로 뉴스 조회
   */
  findById(id: string): Promise<NewsArticle | null>;

  /**
   * 카테고리별 뉴스 조회
   */
  findByCategory(category: NewsCategory): Promise<NewsArticle[]>;

  /**
   * 뉴스 생성
   */
  create(data: CreateNewsData): Promise<string>;

  /**
   * 뉴스 수정
   */
  update(id: string, data: UpdateNewsData): Promise<void>;

  /**
   * 뉴스 삭제
   */
  delete(id: string): Promise<void>;
}
