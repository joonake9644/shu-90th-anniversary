/**
 * Footer CMS - Firestore Admin CRUD Functions
 *
 * 관리자 전용 Footer 콘텐츠 관리 함수
 */

import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'homepage_footer';
const FOOTER_DOC_ID = 'main'; // Singleton document

export interface QuickLink {
  label: string;
  href: string;
}

export interface HomepageFooter {
  id: string;

  // 브랜드
  brandName: string; // "SHU 90th"
  slogan: string; // "Truth · Love · Service"
  description: string; // "Celebrating 90 years..."

  // 소셜 미디어
  socialLinks: {
    instagram: string;
    facebook: string;
    youtube: string;
  };

  // 빠른 링크
  quickLinks: QuickLink[]; // 4개 링크

  // 연락처
  contact: {
    address: string; // "82 Mangu-ro, Dongdaemun-gu,\nSeoul, Republic of Korea"
    phone: string; // "+82-2212-0082"
    email: string; // "admin@shu.ac.kr"
  };

  // 법률
  copyrightText: string; // "Sahmyook Health University. All rights reserved."
  privacyPolicyUrl: string; // "#"
  termsOfServiceUrl: string; // "#"

  // 메타데이터
  updatedAt?: any;
  createdAt?: any;
}

/**
 * Footer 콘텐츠 조회
 */
export async function getFooterContent(): Promise<HomepageFooter | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, FOOTER_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as HomepageFooter;
    }

    return null;
  } catch (error) {
    console.error('Error getting footer content:', error);
    throw error;
  }
}

/**
 * Footer 콘텐츠 업데이트 (생성 또는 수정)
 */
export async function updateFooterContent(
  data: Omit<HomepageFooter, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const docRef = doc(db, COLLECTION_NAME, FOOTER_DOC_ID);

    // 기존 문서 확인
    const existing = await getDoc(docRef);

    const payload = {
      ...data,
      updatedAt: serverTimestamp(),
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() })
    };

    await setDoc(docRef, payload, { merge: true });

    console.log('Footer content updated successfully');
    return FOOTER_DOC_ID;
  } catch (error) {
    console.error('Error updating footer content:', error);
    throw error;
  }
}

/**
 * 초기 데이터 마이그레이션
 * 하드코딩된 데이터를 Firestore로 이전
 */
export async function migrateFooterData(): Promise<void> {
  const initialData: Omit<HomepageFooter, 'id' | 'createdAt' | 'updatedAt'> = {
    brandName: 'SHU 90th',
    slogan: 'Truth · Love · Service',
    description: 'Celebrating 90 years of excellence in health education.\nPreparing for the next century of innovation and service.',
    socialLinks: {
      instagram: 'https://www.instagram.com/shu_university/',
      facebook: 'https://www.facebook.com/sahmyookhealth',
      youtube: 'https://www.youtube.com/@SHU_Official'
    },
    quickLinks: [
      { label: 'History 1936-2026', href: '#' },
      { label: 'Vision 2030', href: '#' },
      { label: 'Campus Map', href: '#' },
      { label: 'Anniversary Events', href: '#' }
    ],
    contact: {
      address: '82 Mangu-ro, Dongdaemun-gu,\nSeoul, Republic of Korea',
      phone: '+82-2212-0082',
      email: 'admin@shu.ac.kr'
    },
    copyrightText: 'Sahmyook Health University. All rights reserved.',
    privacyPolicyUrl: '#',
    termsOfServiceUrl: '#'
  };

  try {
    await updateFooterContent(initialData);
    console.log('✅ Footer data migration completed');
  } catch (error) {
    console.error('❌ Footer data migration failed:', error);
    throw error;
  }
}
