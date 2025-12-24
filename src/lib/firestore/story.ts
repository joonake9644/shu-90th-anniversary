/**
 * 사연 보내기 Firestore 함수
 */

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'story_submissions';

export interface StoryFormData {
  name: string;
  email?: string;
  graduationYear?: number;
  title: string;
  content: string;
}

/**
 * 사연 제출
 */
export async function submitStory(
  data: StoryFormData
): Promise<{ success: boolean; message: string }> {
  try {
    // 유효성 검사
    if (!data.name.trim()) {
      return { success: false, message: '이름을 입력해주세요.' };
    }
    if (!data.title.trim()) {
      return { success: false, message: '제목을 입력해주세요.' };
    }
    if (!data.content.trim()) {
      return { success: false, message: '내용을 입력해주세요.' };
    }

    // 사연 저장
    await addDoc(collection(db, COLLECTION_NAME), {
      name: data.name,
      email: data.email || '',
      graduationYear: data.graduationYear || null,
      title: data.title,
      content: data.content,
      isApproved: false, // 기본값: 미승인
      createdAt: Timestamp.now(),
    });

    return {
      success: true,
      message: '소중한 사연이 전달되었습니다. 감사합니다!',
    };
  } catch (error) {
    console.error('Story submission error:', error);
    return {
      success: false,
      message: '사연 전송 중 오류가 발생했습니다.',
    };
  }
}
