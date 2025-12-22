/**
 * Firestore Database Schema Types
 * 90주년 기념 홈페이지 데이터베이스 타입 정의
 */

import { Timestamp } from 'firebase/firestore';

// ============ 방명록 (Guestbook) ============
export interface GuestbookEntry {
    id: string;
    name: string;
    graduationYear: number;
    major?: string;
    message: string;
    isAnonymous: boolean;
    likes: number;
    approved: boolean; // 관리자 승인 여부
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface GuestbookFormData {
    name: string;
    graduationYear: number;
    major?: string;
    message: string;
    isAnonymous: boolean;
}

// ============ 추억 게시판 (Memory Posts) ============
export interface MemoryPost {
    id: string;
    authorName: string;
    title: string;
    content: string;
    images: string[]; // Storage URLs
    memoryYear: number; // 추억의 연도
    hashtags: string[];
    likes: number;
    commentCount: number;
    approved: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface MemoryComment {
    id: string;
    postId: string;
    authorName: string;
    content: string;
    createdAt: Timestamp;
}

export interface MemoryFormData {
    authorName: string;
    title: string;
    content: string;
    memoryYear: number;
    hashtags: string[];
}

// ============ 좋아요 기록 (Local Storage) ============
export interface LikeRecord {
    guestbookLikes: string[]; // guestbook entry IDs
    memoryLikes: string[]; // memory post IDs
}

// ============ 동기생 프로필 (Alumni Profile) ============
export interface AlumniProfile {
    id: string; // user ID
    name: string;
    graduationYear: number;
    major: string;
    email?: string;
    phone?: string;
    isPublic: boolean;
    showContact: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// ============ 통계 데이터 (Statistics) ============
export interface StatisticsData {
    id: string;
    year: number;
    students: number;
    graduates: number;
    professors: number;
    departments: number;
    updatedAt: Timestamp;
}

// ============ 이벤트 (Events) ============
export interface Event {
    id: string;
    title: string;
    description: string;
    date: Timestamp;
    location: string;
    image?: string;
    registrationLink?: string;
    category: 'ceremony' | 'exhibition' | 'conference' | 'other';
    createdAt: Timestamp;
}

// ============ 뉴스 (News) ============
export interface NewsArticle {
    id: string;
    title: string;
    summary: string;
    content: string;
    thumbnail?: string;
    author: string;
    category: 'anniversary' | 'achievement' | 'event' | 'general';
    publishedAt: Timestamp;
    createdAt: Timestamp;
}
