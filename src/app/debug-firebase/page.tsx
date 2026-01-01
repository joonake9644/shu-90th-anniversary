'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

/**
 * Firebase 연결 디버깅 페이지
 * 접속: http://localhost:3000/debug-firebase
 */
export default function DebugFirebasePage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorDetails, setErrorDetails] = useState<any>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    addLog('🔍 Firebase 설정 확인 중...');

    // 환경 변수 확인
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    addLog('📋 환경 변수:');
    Object.entries(config).forEach(([key, value]) => {
      if (value) {
        addLog(`  ✅ ${key}: ${value.substring(0, 20)}...`);
      } else {
        addLog(`  ❌ ${key}: undefined`);
      }
    });

    // Firebase 인스턴스 확인
    if (db) {
      addLog('✅ Firestore 인스턴스 생성됨');
      addLog(`   앱 이름: ${db.app.name}`);
      addLog(`   프로젝트 ID: ${db.app.options.projectId || '(없음)'}`);
    } else {
      addLog('❌ Firestore 인스턴스가 없습니다');
    }
  }, []);

  const testGuestbookWrite = async () => {
    setTestResult('loading');
    setErrorDetails(null);
    addLog('\n📝 방명록 작성 테스트 시작...');

    try {
      const testData = {
        name: '테스트 디버깅',
        graduationYear: 2024,
        major: '디버깅학과',
        message: `브라우저 테스트 - ${new Date().toLocaleString()}`,
        isAnonymous: false,
        likes: 0,
        approved: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      addLog('📦 저장할 데이터:');
      addLog(JSON.stringify(testData, null, 2));

      addLog('⏳ Firestore에 저장 중...');
      const docRef = await addDoc(collection(db, 'guestbook'), testData);

      addLog(`✅ 성공! 문서 ID: ${docRef.id}`);
      addLog(`   컬렉션: guestbook`);
      setTestResult('success');
    } catch (error: any) {
      addLog('❌ 에러 발생!');
      addLog(`   메시지: ${error.message}`);
      addLog(`   코드: ${error.code}`);
      addLog(`   전체: ${JSON.stringify(error, null, 2)}`);

      setErrorDetails(error);
      setTestResult('error');
    }
  };

  const testStoryWrite = async () => {
    setTestResult('loading');
    setErrorDetails(null);
    addLog('\n📖 사연 작성 테스트 시작...');

    try {
      const testData = {
        name: '테스트 디버깅',
        email: 'debug@test.com',
        graduationYear: 2024,
        title: '디버깅 테스트 사연',
        content: `브라우저 테스트 - ${new Date().toLocaleString()}`,
        isApproved: false,
        createdAt: Timestamp.now(),
      };

      addLog('📦 저장할 데이터:');
      addLog(JSON.stringify(testData, null, 2));

      addLog('⏳ Firestore에 저장 중...');
      const docRef = await addDoc(collection(db, 'story_submissions'), testData);

      addLog(`✅ 성공! 문서 ID: ${docRef.id}`);
      addLog(`   컬렉션: story_submissions`);
      setTestResult('success');
    } catch (error: any) {
      addLog('❌ 에러 발생!');
      addLog(`   메시지: ${error.message}`);
      addLog(`   코드: ${error.code}`);
      addLog(`   전체: ${JSON.stringify(error, null, 2)}`);

      setErrorDetails(error);
      setTestResult('error');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Firebase 연결 디버깅</h1>
        <p className="text-gray-400 mb-8">브라우저에서 Firebase 연결 상태를 확인합니다</p>

        {/* 테스트 버튼 */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={testGuestbookWrite}
            disabled={testResult === 'loading'}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
          >
            방명록 작성 테스트
          </button>
          <button
            onClick={testStoryWrite}
            disabled={testResult === 'loading'}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
          >
            사연 작성 테스트
          </button>
        </div>

        {/* 상태 표시 */}
        {testResult !== 'idle' && (
          <div className={`mb-8 p-4 rounded-lg border ${
            testResult === 'loading' ? 'bg-blue-900/20 border-blue-500' :
            testResult === 'success' ? 'bg-green-900/20 border-green-500' :
            'bg-red-900/20 border-red-500'
          }`}>
            <p className="font-bold">
              {testResult === 'loading' && '⏳ 테스트 진행 중...'}
              {testResult === 'success' && '✅ 테스트 성공!'}
              {testResult === 'error' && '❌ 테스트 실패'}
            </p>
          </div>
        )}

        {/* 에러 상세 */}
        {errorDetails && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-500 rounded-lg">
            <h3 className="font-bold text-red-400 mb-2">에러 상세:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(errorDetails, null, 2)}
            </pre>
          </div>
        )}

        {/* 로그 */}
        <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">로그</h2>
          <div className="bg-black p-4 rounded font-mono text-sm space-y-1 max-h-[600px] overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="text-gray-300">
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* 안내 */}
        <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-500 rounded-lg">
          <h3 className="font-bold text-yellow-400 mb-2">📌 디버깅 가이드</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>1. 환경 변수가 모두 로드되었는지 확인하세요</li>
            <li>2. "방명록 작성 테스트" 또는 "사연 작성 테스트" 버튼을 클릭하세요</li>
            <li>3. 로그에서 에러 메시지를 확인하세요</li>
            <li>4. 브라우저 개발자 도구(F12) 콘솔도 확인하세요</li>
            <li>5. 테스트 성공 시 Firebase Console에서 데이터를 확인하세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
