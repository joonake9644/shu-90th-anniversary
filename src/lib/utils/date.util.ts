import { Timestamp } from 'firebase/firestore';

/**
 * 날짜 유틸리티 함수
 * 공통 유틸리티 - 계층 무관
 */

/**
 * Firestore Timestamp를 한국 날짜 문자열로 변환
 * @param timestamp - Firestore Timestamp
 * @returns 예: "2025년 12월 23일"
 */
export function formatKoreanDate(timestamp: Timestamp): string {
  const date = timestamp.toDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
}

/**
 * Firestore Timestamp를 ISO 날짜 문자열로 변환
 * @param timestamp - Firestore Timestamp
 * @returns 예: "2025-12-23"
 */
export function formatISODate(timestamp: Timestamp): string {
  const date = timestamp.toDate();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Firestore Timestamp를 상대 시간으로 변환
 * @param timestamp - Firestore Timestamp
 * @returns 예: "3일 전", "2시간 전"
 */
export function formatRelativeTime(timestamp: Timestamp): string {
  const now = Date.now();
  const then = timestamp.toMillis();
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years}년 전`;
  if (months > 0) return `${months}달 전`;
  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return '방금 전';
}

/**
 * Date 객체를 Firestore Timestamp로 변환
 */
export function dateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

/**
 * ISO 날짜 문자열을 Date 객체로 변환
 * @param dateString - "YYYY-MM-DD" 형식
 */
export function parseISODate(dateString: string): Date {
  return new Date(dateString);
}
