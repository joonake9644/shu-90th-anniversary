# TRD: 삼육보건대학교 개교 90주년 기념 홈페이지 - 기술 요구사항 문서

**문서 버전**: 1.0
**작성일**: 2025-12-19
**프로젝트명**: SHU 90th Anniversary Website
**대상**: 개발팀, DevOps 팀, 아키텍트

---

## 📋 문서 개요

본 문서는 삼육보건대학교 90주년 기념 홈페이지의 기술적 요구사항을 정의합니다. 현재 구현된 시스템의 아키텍처를 기반으로 신규 기능 구현을 위한 기술 스펙, 데이터베이스 설계, API 명세, 보안 고려사항, 성능 최적화 전략을 포함합니다.

---

## 🛠️ Technology Stack

### Frontend

| 기술 | 버전 | 용도 |
|------|------|------|
| **Next.js** | 15.5.9 | React 프레임워크, App Router, SSR/SSG |
| **React** | 19.2.3 | UI 라이브러리, 최신 Server Components 지원 |
| **TypeScript** | 5.x | 타입 안정성, strict mode 활성화 |
| **Tailwind CSS** | 4.0 | 유틸리티 우선 CSS 프레임워크 |
| **PostCSS** | 4.0 (@tailwindcss/postcss) | CSS 처리 및 최적화 |
| **Framer Motion** | 11.18.2 | 애니메이션 라이브러리, scroll 애니메이션 |
| **Lucide React** | 0.562.0 | 아이콘 컴포넌트 라이브러리 |

### Backend & Services

| 기술 | 버전 | 용도 |
|------|------|------|
| **Firebase** | 12.7.0 | BaaS (Backend as a Service) |
| ㄴ Firebase Auth | 12.7.0 | 사용자 인증 (Google, Email) |
| ㄴ Firestore | 12.7.0 | NoSQL 데이터베이스 |
| ㄴ Firebase Storage | 12.7.0 | 이미지/비디오 스토리지 |
| ㄴ Firebase Analytics | 12.7.0 (Optional) | 사용자 분석 |

### Development Tools

| 기술 | 버전 | 용도 |
|------|------|------|
| **ESLint** | 9.x | 코드 린팅 |
| **Git** | - | 버전 관리 |
| **Node.js** | 20+ | 런타임 환경 |
| **npm** | 10+ | 패키지 관리자 |

### Deployment & Hosting

| 서비스 | 용도 |
|--------|------|
| **Vercel** (추천) | Next.js 애플리케이션 호스팅, CI/CD |
| **Firebase Hosting** (대안) | 정적 파일 호스팅 |
| **Firebase Cloud Functions** (Optional) | 서버리스 백엔드 로직 |

---

## 🏗️ Architecture Overview

### 시스템 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │             Next.js 15.5.9 (App Router)             │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │   │
│  │  │   Pages      │  │  Components  │  │   Hooks   │ │   │
│  │  │  /history    │  │   Layout     │  │ useScroll │ │   │
│  │  │  /archive    │  │   Sections   │  │useFirestore│ │   │
│  │  │  /guestbook  │  │   UI         │  │           │ │   │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                      VERCEL CDN                              │
│  - Edge Caching                                              │
│  - Image Optimization                                        │
│  - Gzip/Brotli Compression                                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   FIREBASE BACKEND                           │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐       │
│  │  Firestore  │  │   Storage   │  │     Auth     │       │
│  │   (NoSQL)   │  │  (Images/   │  │  (Google,    │       │
│  │             │  │   Videos)   │  │   Email)     │       │
│  └─────────────┘  └─────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### 컴포넌트 아키텍처

```
src/
├── app/
│   ├── layout.tsx                    # Root Layout (Metadata, Fonts)
│   ├── page.tsx                      # Home Page
│   ├── globals.css                   # Global Styles
│   └── (routes)/                     # Route Group
│       ├── history/
│       │   └── page.tsx              # Main Timeline (Client Component)
│       ├── archive/
│       │   └── page.tsx              # Photo Archive
│       ├── guestbook/                # 신규
│       │   └── page.tsx              # Guestbook
│       ├── memories/                 # 신규
│       │   ├── page.tsx              # Memories List
│       │   └── [id]/
│       │       └── page.tsx          # Memory Detail
│       └── ...
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                # Global Header (Client)
│   │   ├── Footer.tsx                # Global Footer
│   │   ├── MenuOverlay.tsx           # Full-screen Menu (Client)
│   │   ├── SubPageLayout.tsx         # Sub-page Wrapper
│   │   └── TimelineProgressBar.tsx   # Progress Indicator (Client)
│   │
│   ├── sections/
│   │   ├── HeroSection.tsx           # Hero with Parallax (Client)
│   │   ├── TimelineIntro.tsx         # Timeline Intro (Client)
│   │   ├── HistoryStory.tsx          # Story Narrative (Client)
│   │   ├── PeriodSection.tsx         # Period Display (Client)
│   │   └── MarqueeSection.tsx        # Marquee Text (Client)
│   │
│   ├── ui/
│   │   ├── HighlightCard.tsx         # Highlight Card
│   │   ├── TextReveal.tsx            # Text Animation
│   │   ├── GuestbookCard.tsx         # 신규: Guestbook Entry
│   │   ├── MemoryCard.tsx            # 신규: Memory Card
│   │   ├── Lightbox.tsx              # 신규: Image Lightbox
│   │   ├── AudioPlayer.tsx           # 신규: Audio Player
│   │   └── ParticleEffect.tsx        # 신규: Particle System
│   │
│   └── forms/                        # 신규
│       ├── GuestbookForm.tsx         # Guestbook Form
│       ├── MemoryForm.tsx            # Memory Upload Form
│       └── CommentForm.tsx           # Comment Form
│
├── lib/
│   ├── firebase.ts                   # Firebase Config & Init
│   ├── firestore.ts                  # 신규: Firestore Helpers
│   ├── storage.ts                    # 신규: Storage Helpers
│   └── utils.ts                      # Utility Functions
│
├── hooks/                            # 신규
│   ├── useGuestbook.ts               # Guestbook CRUD
│   ├── useMemories.ts                # Memories CRUD
│   ├── useComments.ts                # Comments CRUD
│   ├── useLikes.ts                   # Likes Management
│   └── useAudio.ts                   # Audio Player Hook
│
├── data/
│   └── timelineData.ts               # Timeline Static Data
│
└── types/                            # 신규
    ├── guestbook.ts                  # Guestbook Types
    ├── memory.ts                     # Memory Types
    └── common.ts                     # Common Types
```

### Client vs Server Components 전략

**Server Components** (기본):
- 정적 콘텐츠 렌더링
- 초기 데이터 페칭 (Firestore 쿼리)
- SEO 최적화가 중요한 페이지

**Client Components** (`'use client'`):
- 인터랙티브 애니메이션 (Framer Motion)
- 상태 관리 (useState, useEffect)
- 브라우저 API 사용 (window, localStorage)
- 이벤트 핸들러가 필요한 컴포넌트

---

## 💾 Database Design

### Firestore Collections 구조

#### 1. `guestbook` Collection

**문서 ID**: 자동 생성 (Firestore auto-ID)

```typescript
interface GuestbookEntry {
  id: string                    // Document ID
  name: string                  // 작성자 이름 (필수)
  graduationYear: number        // 졸업 연도 (필수)
  major: string | null          // 전공 (선택)
  message: string               // 메시지 (최대 500자)
  isAnonymous: boolean          // 익명 여부
  likes: number                 // 좋아요 수
  approved: boolean             // 관리자 승인 여부
  createdAt: Timestamp          // 작성 시간
  updatedAt: Timestamp          // 수정 시간
  ipAddress?: string            // IP 주소 (스팸 방지용, 선택)
}
```

**Indexes**:
- `createdAt` (descending) - 최신순 정렬
- `likes` (descending) - 좋아요순 정렬
- `graduationYear` (ascending) - 연도별 필터링
- `approved` (boolean) - 승인된 항목만 조회

**Security Rules**:
```javascript
match /guestbook/{entryId} {
  // 읽기: 승인된 항목만
  allow read: if resource.data.approved == true;

  // 쓰기: 모든 사용자 (rate limiting via Cloud Functions)
  allow create: if request.auth != null || true;

  // 수정/삭제: 관리자만
  allow update, delete: if request.auth.token.admin == true;
}
```

#### 2. `memories` Collection

**문서 ID**: 자동 생성

```typescript
interface Memory {
  id: string                    // Document ID
  authorId: string              // 작성자 UID (Firebase Auth)
  authorName: string            // 작성자 이름
  title: string                 // 제목 (최대 100자)
  content: string               // 본문 (최대 2000자)
  images: string[]              // 이미지 URLs (최대 5개)
  year: number                  // 추억의 연도
  tags: string[]                // 해시태그 (최대 5개)
  likes: number                 // 좋아요 수
  commentCount: number          // 댓글 수
  viewCount: number             // 조회수
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Indexes**:
- `createdAt` (descending)
- `likes` (descending)
- `year` (ascending)
- `tags` (array-contains) - 태그별 필터링

**Security Rules**:
```javascript
match /memories/{memoryId} {
  allow read: if true;  // 모두 공개
  allow create: if request.auth != null;  // 로그인 필요
  allow update, delete: if request.auth.uid == resource.data.authorId;
}
```

#### 3. `comments` Collection

**문서 ID**: 자동 생성

**경로**: `/memories/{memoryId}/comments/{commentId}` (Subcollection)

```typescript
interface Comment {
  id: string
  memoryId: string              // Parent Memory ID
  authorId: string              // 작성자 UID
  authorName: string            // 작성자 이름
  content: string               // 댓글 내용 (최대 500자)
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Security Rules**:
```javascript
match /memories/{memoryId}/comments/{commentId} {
  allow read: if true;
  allow create: if request.auth != null;
  allow delete: if request.auth.uid == resource.data.authorId;
}
```

#### 4. `users` Collection (Optional)

**문서 ID**: Firebase Auth UID

```typescript
interface User {
  uid: string
  name: string
  email: string
  graduationYear: number | null
  major: string | null
  profilePublic: boolean        // 동기생 찾기 공개 여부
  contactPublic: boolean        // 연락처 공개 여부
  phoneNumber: string | null
  createdAt: Timestamp
}
```

**Security Rules**:
```javascript
match /users/{userId} {
  allow read: if resource.data.profilePublic == true;
  allow write: if request.auth.uid == userId;
}
```

#### 5. `analytics` Collection (Optional)

페이지 조회, 사용자 행동 추적용

```typescript
interface PageView {
  path: string
  timestamp: Timestamp
  userId: string | null
  deviceType: 'mobile' | 'desktop' | 'tablet'
  referrer: string
}
```

### Firebase Storage 구조

```
/memories/
  /{memoryId}/
    /image_001.jpg
    /image_002.jpg
    ...

/archive/
  /1930s/
    /photo_001.jpg
    ...
  /1940s/
    ...

/videos/
  /interview_001.mp4
  /event_002.mp4
  ...
```

**Storage Rules**:
```javascript
service firebase.storage {
  match /b/{bucket}/o {
    match /memories/{memoryId}/{fileName} {
      // 읽기: 모두 허용
      allow read: if true;

      // 쓰기: 로그인 사용자, 5MB 이하, 이미지만
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }

    match /archive/{path=**} {
      allow read: if true;
      allow write: if false;  // 관리자만 (Cloud Functions via Admin SDK)
    }
  }
}
```

---

## 🔌 API Specifications

### Firebase Authentication

#### 1. Google Sign-In

```typescript
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/lib/firebase'

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    // user.uid, user.displayName, user.email
    return user
  } catch (error) {
    console.error('Google Sign-In Error:', error)
    throw error
  }
}
```

#### 2. Anonymous Authentication (Optional)

방명록 작성 시 로그인 없이 사용 가능

```typescript
import { signInAnonymously } from 'firebase/auth'

const signInAnon = async () => {
  try {
    const result = await signInAnonymously(auth)
    return result.user
  } catch (error) {
    console.error('Anonymous Sign-In Error:', error)
    throw error
  }
}
```

### Firestore CRUD Operations

#### 1. Guestbook Operations

**Create (방명록 작성)**:
```typescript
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const createGuestbookEntry = async (entry: Omit<GuestbookEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'guestbook'), {
      ...entry,
      likes: 0,
      approved: false,  // 관리자 승인 대기
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error('Guestbook Create Error:', error)
    throw error
  }
}
```

**Read (방명록 조회)**:
```typescript
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'

const getGuestbookEntries = async (
  sortBy: 'createdAt' | 'likes' = 'createdAt',
  limitCount: number = 20
) => {
  try {
    const q = query(
      collection(db, 'guestbook'),
      where('approved', '==', true),
      orderBy(sortBy, 'desc'),
      limit(limitCount)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GuestbookEntry[]
  } catch (error) {
    console.error('Guestbook Read Error:', error)
    throw error
  }
}
```

**Update (좋아요)**:
```typescript
import { doc, updateDoc, increment } from 'firebase/firestore'

const likeGuestbookEntry = async (entryId: string) => {
  try {
    const docRef = doc(db, 'guestbook', entryId)
    await updateDoc(docRef, {
      likes: increment(1)
    })
  } catch (error) {
    console.error('Guestbook Like Error:', error)
    throw error
  }
}
```

#### 2. Memories Operations

**Create (추억 작성 + 이미지 업로드)**:
```typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'

const createMemory = async (
  memory: Omit<Memory, 'id' | 'images' | 'createdAt' | 'updatedAt'>,
  imageFiles: File[]
) => {
  try {
    // 1. 이미지 업로드
    const imageUrls: string[] = []
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      const storageRef = ref(storage, `memories/${Date.now()}_${i}/${file.name}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      imageUrls.push(url)
    }

    // 2. Firestore에 문서 생성
    const docRef = await addDoc(collection(db, 'memories'), {
      ...memory,
      images: imageUrls,
      likes: 0,
      commentCount: 0,
      viewCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    return docRef.id
  } catch (error) {
    console.error('Memory Create Error:', error)
    throw error
  }
}
```

**Read (추억 조회 with Pagination)**:
```typescript
import { query, startAfter, DocumentSnapshot } from 'firebase/firestore'

const getMemories = async (
  lastVisible: DocumentSnapshot | null = null,
  limitCount: number = 12
) => {
  try {
    let q = query(
      collection(db, 'memories'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    if (lastVisible) {
      q = query(q, startAfter(lastVisible))
    }

    const snapshot = await getDocs(q)
    return {
      memories: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      lastVisible: snapshot.docs[snapshot.docs.length - 1]
    }
  } catch (error) {
    console.error('Memories Read Error:', error)
    throw error
  }
}
```

#### 3. Comments Operations

**Create (댓글 작성)**:
```typescript
const addComment = async (memoryId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    // 1. 댓글 추가
    const commentRef = await addDoc(
      collection(db, 'memories', memoryId, 'comments'),
      {
        ...comment,
        memoryId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    )

    // 2. Memory의 commentCount 증가
    const memoryRef = doc(db, 'memories', memoryId)
    await updateDoc(memoryRef, {
      commentCount: increment(1)
    })

    return commentRef.id
  } catch (error) {
    console.error('Comment Create Error:', error)
    throw error
  }
}
```

### Real-time Listeners (Optional)

실시간 업데이트가 필요한 경우 (예: 좋아요 카운트)

```typescript
import { onSnapshot } from 'firebase/firestore'

const subscribeToGuestbook = (callback: (entries: GuestbookEntry[]) => void) => {
  const q = query(
    collection(db, 'guestbook'),
    where('approved', '==', true),
    orderBy('createdAt', 'desc'),
    limit(20)
  )

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GuestbookEntry[]
    callback(entries)
  })

  return unsubscribe  // cleanup function
}
```

---

## 🔒 Security Considerations

### 1. Firebase Security Rules

**Firestore Rules** (`firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Guestbook
    match /guestbook/{entryId} {
      allow read: if resource.data.approved == true;
      allow create: if request.resource.data.message.size() <= 500
                    && request.resource.data.name.size() > 0
                    && request.resource.data.graduationYear is number;
      allow update: if request.auth.token.admin == true;
      allow delete: if request.auth.token.admin == true;
    }

    // Memories
    match /memories/{memoryId} {
      allow read: if true;
      allow create: if request.auth != null
                    && request.resource.data.title.size() <= 100
                    && request.resource.data.content.size() <= 2000
                    && request.resource.data.images.size() <= 5;
      allow update: if request.auth.uid == resource.data.authorId;
      allow delete: if request.auth.uid == resource.data.authorId
                    || request.auth.token.admin == true;

      // Comments subcollection
      match /comments/{commentId} {
        allow read: if true;
        allow create: if request.auth != null
                      && request.resource.data.content.size() <= 500;
        allow delete: if request.auth.uid == resource.data.authorId
                      || request.auth.token.admin == true;
      }
    }

    // Users
    match /users/{userId} {
      allow read: if resource.data.profilePublic == true
                  || request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

**Storage Rules** (`storage.rules`):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /memories/{memoryId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/(jpeg|png|gif|webp)');
    }

    match /archive/{path=**} {
      allow read: if true;
      allow write: if false;  // Admin only via Cloud Functions
    }
  }
}
```

### 2. Input Sanitization

**XSS 방지**:
```typescript
import DOMPurify from 'isomorphic-dompurify'

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],  // 모든 HTML 태그 제거
    ALLOWED_ATTR: []
  })
}

// 사용 예시
const createGuestbookEntry = async (entry: GuestbookEntry) => {
  const sanitized = {
    ...entry,
    name: sanitizeInput(entry.name),
    message: sanitizeInput(entry.message),
    major: entry.major ? sanitizeInput(entry.major) : null
  }
  // ... Firestore에 저장
}
```

### 3. Rate Limiting

**Cloud Functions를 통한 Rate Limiting**:
```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

export const checkRateLimit = functions.https.onCall(async (data, context) => {
  const ipAddress = context.rawRequest.ip
  const now = admin.firestore.Timestamp.now()
  const oneMinuteAgo = admin.firestore.Timestamp.fromMillis(now.toMillis() - 60000)

  // 최근 1분간 요청 횟수 확인
  const recentRequests = await admin.firestore()
    .collection('rateLimits')
    .where('ipAddress', '==', ipAddress)
    .where('timestamp', '>', oneMinuteAgo)
    .get()

  if (recentRequests.size >= 10) {  // 1분에 최대 10회
    throw new functions.https.HttpsError('resource-exhausted', 'Too many requests')
  }

  // 요청 기록
  await admin.firestore().collection('rateLimits').add({
    ipAddress,
    timestamp: now
  })

  return { success: true }
})
```

### 4. Image Upload Validation

**클라이언트 측 검증**:
```typescript
const validateImage = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024  // 5MB

  if (!allowedTypes.includes(file.type)) {
    alert('JPEG, PNG, GIF, WebP 형식만 업로드 가능합니다.')
    return false
  }

  if (file.size > maxSize) {
    alert('이미지 크기는 5MB 이하여야 합니다.')
    return false
  }

  return true
}
```

### 5. Content Moderation (Optional)

**욕설 필터링**:
```typescript
import Filter from 'bad-words'

const filter = new Filter()

const moderateContent = (content: string): string => {
  return filter.clean(content)
}
```

---

## ⚡ Performance Optimization

### 1. Next.js Image Optimization

```typescript
import Image from 'next/image'

<Image
  src="/timeline-bg.jpg"
  alt="Timeline Background"
  width={1920}
  height={1080}
  quality={85}
  priority  // LCP 최적화
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### 2. Code Splitting

**Dynamic Imports**:
```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false  // 클라이언트에서만 로드
})
```

### 3. Lazy Loading Images

**Intersection Observer 활용**:
```typescript
'use client'

import { useEffect, useRef, useState } from 'react'

const LazyImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isVisible, setIsVisible] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px' }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : '/placeholder.jpg'}
      alt={alt}
      loading="lazy"
    />
  )
}
```

### 4. Firestore Query Optimization

**Composite Indexes**:
```javascript
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "guestbook",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "approved", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "memories",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "year", "order": "ASCENDING" },
        { "fieldPath": "likes", "order": "DESCENDING" }
      ]
    }
  ]
}
```

**데이터 캐싱**:
```typescript
import { enableIndexedDbPersistence } from 'firebase/firestore'

// 오프라인 지원 및 캐싱
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    // 여러 탭에서 열린 경우
  } else if (err.code == 'unimplemented') {
    // 브라우저가 지원하지 않음
  }
})
```

### 5. Framer Motion Optimization

**LazyMotion**:
```typescript
import { LazyMotion, domMax, m } from 'framer-motion'

export default function App() {
  return (
    <LazyMotion features={domMax} strict>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Content
      </m.div>
    </LazyMotion>
  )
}
```

**애니메이션 최적화**:
```typescript
// ✅ Good: transform과 opacity만 사용
<motion.div
  animate={{
    x: 100,
    opacity: 0.5
  }}
/>

// ❌ Bad: width, height, margin 등은 리페인트 발생
<motion.div
  animate={{
    width: 200,
    height: 300
  }}
/>
```

### 6. Bundle Size Optimization

**Tree Shaking**:
```typescript
// ✅ Good: 필요한 것만 import
import { collection, addDoc } from 'firebase/firestore'

// ❌ Bad: 전체 import
import * as firestore from 'firebase/firestore'
```

**Webpack Bundle Analyzer**:
```bash
npm install @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // ... config
})
```

---

## 🎨 UI/UX Technical Implementation

### 1. Responsive Design Breakpoints

```typescript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  }
}
```

### 2. Scroll-based Animations

```typescript
'use client'

import { useScroll, useTransform, motion } from 'framer-motion'
import { useRef } from 'react'

export const ParallaxSection = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])

  return (
    <div ref={ref} className="h-screen relative">
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0"
      >
        Content
      </motion.div>
    </div>
  )
}
```

### 3. Audio Player Implementation

```typescript
'use client'

import { useState, useRef, useEffect } from 'react'

export const AudioPlayer = ({ src }: { src: string }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 p-4 rounded-lg">
      <audio ref={audioRef} src={src} loop />
      <button onClick={togglePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
      />
    </div>
  )
}
```

### 4. Lightbox Implementation

```typescript
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

export const Gallery = ({ images }: { images: string[] }) => {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            onClick={() => {
              setIndex(i)
              setOpen(true)
            }}
          />
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map(src => ({ src }))}
      />
    </>
  )
}
```

---

## 🌐 Accessibility Implementation

### 1. ARIA Labels

```typescript
<button
  aria-label="Close menu"
  aria-expanded={isOpen}
  onClick={handleClose}
>
  <X />
</button>
```

### 2. Keyboard Navigation

```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  switch (e.key) {
    case 'Escape':
      closeModal()
      break
    case 'Enter':
      submitForm()
      break
  }
}
```

### 3. Focus Management

```typescript
'use client'

import { useEffect, useRef } from 'react'

export const Modal = ({ isOpen }: { isOpen: boolean }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [isOpen])

  return (
    <div role="dialog" aria-modal="true">
      <button ref={closeButtonRef}>Close</button>
    </div>
  )
}
```

---

## 🚀 Deployment Architecture

### Vercel Deployment

**vercel.json**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["icn1"],
  "env": {
    "NEXT_PUBLIC_FIREBASE_API_KEY": "@firebase-api-key",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "@firebase-auth-domain",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "@firebase-project-id",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET": "@firebase-storage-bucket",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "@firebase-messaging-sender-id",
    "NEXT_PUBLIC_FIREBASE_APP_ID": "@firebase-app-id"
  }
}
```

### CI/CD Pipeline

**GitHub Actions** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run type-check

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Environment Variables

**.env.local** (로컬 개발):
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Vercel Dashboard**:
- Environment Variables 섹션에서 동일한 변수들 설정
- Production, Preview, Development 환경별로 다른 값 설정 가능

---

## 📊 Monitoring & Analytics

### 1. Firebase Analytics

```typescript
import { logEvent } from 'firebase/analytics'
import { analytics } from '@/lib/firebase'

// 페이지 조회
logEvent(analytics, 'page_view', {
  page_path: window.location.pathname,
  page_title: document.title
})

// 사용자 행동 추적
logEvent(analytics, 'guestbook_submit', {
  graduation_year: 1992
})

logEvent(analytics, 'memory_created', {
  year: 2005,
  has_images: true
})
```

### 2. Web Vitals

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### 3. Error Tracking (Sentry - Optional)

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV
})
```

---

## 🧪 Testing Strategy

### Unit Tests (Jest + React Testing Library)

```typescript
// __tests__/components/GuestbookCard.test.tsx
import { render, screen } from '@testing-library/react'
import { GuestbookCard } from '@/components/ui/GuestbookCard'

describe('GuestbookCard', () => {
  it('renders guestbook entry correctly', () => {
    const entry = {
      id: '1',
      name: 'John Doe',
      graduationYear: 1992,
      major: 'Nursing',
      message: 'Great memories!',
      likes: 5,
      createdAt: new Date()
    }

    render(<GuestbookCard entry={entry} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('1992')).toBeInTheDocument()
    expect(screen.getByText('Great memories!')).toBeInTheDocument()
  })
})
```

### E2E Tests (Playwright - Optional)

```typescript
// e2e/guestbook.spec.ts
import { test, expect } from '@playwright/test'

test('submit guestbook entry', async ({ page }) => {
  await page.goto('/guestbook')

  await page.fill('input[name="name"]', 'Test User')
  await page.fill('input[name="graduationYear"]', '2020')
  await page.fill('textarea[name="message"]', 'This is a test message')

  await page.click('button[type="submit"]')

  await expect(page.locator('text=감사합니다')).toBeVisible()
})
```

---

## 📦 Dependencies

### Production Dependencies

```json
{
  "dependencies": {
    "next": "15.5.9",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "firebase": "12.7.0",
    "framer-motion": "11.18.2",
    "lucide-react": "0.562.0",
    "yet-another-react-lightbox": "^3.15.0",
    "isomorphic-dompurify": "^2.6.0"
  }
}
```

### Development Dependencies

```json
{
  "devDependencies": {
    "@types/node": "20",
    "@types/react": "19",
    "@types/react-dom": "19",
    "typescript": "5",
    "tailwindcss": "4",
    "@tailwindcss/postcss": "4",
    "eslint": "9",
    "@next/bundle-analyzer": "^15.0.0",
    "@vercel/analytics": "^1.0.0",
    "@vercel/speed-insights": "^1.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

---

## 🔧 Development Workflow

### Git Branching Strategy

```
main (production)
  └── develop (staging)
        ├── feature/alumni-interaction
        ├── feature/multimedia-gallery
        └── feature/emotion-effects
```

### Commit Convention

```bash
feat: 방명록 기능 구현
fix: 이미지 업로드 버그 수정
docs: README 업데이트
style: 코드 포매팅
refactor: 컴포넌트 구조 개선
test: 단위 테스트 추가
chore: 의존성 업데이트
```

### Code Review Checklist

- [ ] TypeScript 타입 정의 완료
- [ ] 반응형 디자인 적용 (모바일/태블릿/데스크톱)
- [ ] 접근성 (ARIA labels, keyboard navigation)
- [ ] 성능 최적화 (이미지, 코드 스플리팅)
- [ ] 보안 (입력 검증, XSS 방지)
- [ ] 에러 처리 (try-catch, 사용자 피드백)
- [ ] 테스트 작성 (유닛 테스트)
- [ ] 문서화 (JSDoc, README)

---

## 📅 Implementation Roadmap

| Week | Task | Owner | Status |
|------|------|-------|--------|
| **Week 1-2** | 동문 인터랙션 - Firestore 스키마 설정 | Backend Dev | |
| | 동문 인터랙션 - 방명록 UI 구현 | Frontend Dev | |
| | 동문 인터랙션 - 추억 공유 기능 | Full-stack Dev | |
| **Week 3-4** | 멀티미디어 갤러리 - Storage 설정 | Backend Dev | |
| | 멀티미디어 갤러리 - 사진 아카이브 UI | Frontend Dev | |
| | 멀티미디어 갤러리 - Lightbox 통합 | Frontend Dev | |
| **Week 5-6** | 감성 효과 - 오디오 플레이어 | Frontend Dev | |
| | 감성 효과 - 파티클 시스템 | Frontend Dev | |
| | 감성 효과 - 사운드 효과 | Frontend Dev | |
| **Week 7-8** | QA & Bug Fixes | QA Team | |
| | 성능 최적화 | DevOps | |
| | 문서화 완료 | Tech Writer | |
| **Week 9** | Staging 배포 및 테스트 | DevOps | |
| | 최종 검수 | PM | |
| **Week 10** | Production 배포 | DevOps | |

---

## 🎓 Technical Glossary

| 용어 | 설명 |
|------|------|
| **SSR** | Server-Side Rendering, 서버에서 HTML 렌더링 |
| **SSG** | Static Site Generation, 빌드 타임에 HTML 생성 |
| **ISR** | Incremental Static Regeneration, 점진적 정적 재생성 |
| **CSR** | Client-Side Rendering, 클라이언트에서 렌더링 |
| **BaaS** | Backend as a Service, 백엔드 서비스 플랫폼 |
| **NoSQL** | Not Only SQL, 비관계형 데이터베이스 |
| **CDN** | Content Delivery Network, 콘텐츠 전송 네트워크 |
| **LCP** | Largest Contentful Paint, 최대 콘텐츠 렌더링 시간 |
| **FID** | First Input Delay, 최초 입력 지연 |
| **CLS** | Cumulative Layout Shift, 누적 레이아웃 이동 |
| **XSS** | Cross-Site Scripting, 크로스 사이트 스크립팅 공격 |
| **ARIA** | Accessible Rich Internet Applications, 웹 접근성 표준 |

---

## 📞 Technical Support

**Tech Lead**: [이름]
**Backend Lead**: [이름]
**Frontend Lead**: [이름]
**DevOps Lead**: [이름]

**Slack Channels**:
- #shu-90th-dev (개발 논의)
- #shu-90th-bugs (버그 리포트)
- #shu-90th-devops (배포/인프라)

**Documentation**:
- Notion: [링크]
- Confluence: [링크]
- GitHub Wiki: [링크]

---

**문서 끝**
