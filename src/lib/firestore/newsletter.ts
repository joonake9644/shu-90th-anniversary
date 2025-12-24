/**
 * 뉴스레터 구독 Firestore 함수
 */

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'newsletter_subscribers';

/**
 * 뉴스레터 구독
 */
export async function subscribeNewsletter(
  email: string
): Promise<{ success: boolean; message: string }> {
  try {
    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: '올바른 이메일 주소를 입력해주세요.',
      };
    }

    // 중복 확인
    const q = query(
      collection(db, COLLECTION_NAME),
      where('email', '==', email.toLowerCase())
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return {
        success: false,
        message: '이미 구독 중인 이메일입니다.',
      };
    }

    // 구독자 추가
    await addDoc(collection(db, COLLECTION_NAME), {
      email: email.toLowerCase(),
      subscribedAt: Timestamp.now(),
      isActive: true,
    });

    return {
      success: true,
      message: '뉴스레터 구독이 완료되었습니다!',
    };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      message: '구독 처리 중 오류가 발생했습니다.',
    };
  }
}
