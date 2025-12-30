import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';

/**
 * Firestore CRUD 테스트 API
 * GET 요청으로 자동 테스트 실행
 */
export async function GET() {
  const testResults: any = {
    timestamp: new Date().toISOString(),
    tests: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0
    }
  };

  const testId = `test-${Date.now()}`;
  const collectionName = 'test-collection';

  console.log('🧪 Firestore CRUD 테스트 시작...\n');

  // 테스트 1: Create (문서 생성)
  try {
    console.log('Test 1: 문서 생성 (Create)...');
    const testData = {
      title: '테스트 제목',
      content: '테스트 내용',
      count: 100,
      active: true,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, collectionName, testId), testData);
    console.log('✅ Create 성공:', testId);

    testResults.tests.push({
      name: 'Create Document',
      status: 'PASS',
      details: {
        documentId: testId,
        data: testData
      }
    });
    testResults.summary.passed++;
  } catch (error: any) {
    console.error('❌ Create 실패:', error.message);
    testResults.tests.push({
      name: 'Create Document',
      status: 'FAIL',
      error: error.message
    });
    testResults.summary.failed++;
  }

  // 테스트 2: Read (문서 읽기)
  try {
    console.log('Test 2: 문서 읽기 (Read)...');
    const docSnap = await getDoc(doc(db, collectionName, testId));

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('✅ Read 성공:', data);

      testResults.tests.push({
        name: 'Read Document',
        status: 'PASS',
        details: {
          exists: true,
          data: data
        }
      });
      testResults.summary.passed++;
    } else {
      throw new Error('문서가 존재하지 않습니다');
    }
  } catch (error: any) {
    console.error('❌ Read 실패:', error.message);
    testResults.tests.push({
      name: 'Read Document',
      status: 'FAIL',
      error: error.message
    });
    testResults.summary.failed++;
  }

  // 테스트 3: Update (문서 수정)
  try {
    console.log('Test 3: 문서 수정 (Update)...');
    const updateData = {
      content: '수정된 내용',
      count: 200,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(doc(db, collectionName, testId), updateData);

    // 수정 확인
    const docSnap = await getDoc(doc(db, collectionName, testId));
    const updatedData = docSnap.data();

    if (updatedData?.content === '수정된 내용' && updatedData?.count === 200) {
      console.log('✅ Update 성공:', updatedData);
      testResults.tests.push({
        name: 'Update Document',
        status: 'PASS',
        details: {
          updatedFields: updateData,
          verifiedData: updatedData
        }
      });
      testResults.summary.passed++;
    } else {
      throw new Error('수정 내용이 반영되지 않았습니다');
    }
  } catch (error: any) {
    console.error('❌ Update 실패:', error.message);
    testResults.tests.push({
      name: 'Update Document',
      status: 'FAIL',
      error: error.message
    });
    testResults.summary.failed++;
  }

  // 테스트 4: Query (쿼리)
  try {
    console.log('Test 4: 쿼리 테스트...');
    const q = query(
      collection(db, collectionName),
      where('active', '==', true)
    );
    const querySnapshot = await getDocs(q);

    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`✅ Query 성공: ${results.length}개 문서 찾음`);
    testResults.tests.push({
      name: 'Query Collection',
      status: 'PASS',
      details: {
        resultCount: results.length,
        query: 'active == true'
      }
    });
    testResults.summary.passed++;
  } catch (error: any) {
    console.error('❌ Query 실패:', error.message);
    testResults.tests.push({
      name: 'Query Collection',
      status: 'FAIL',
      error: error.message
    });
    testResults.summary.failed++;
  }

  // 테스트 5: Delete (문서 삭제)
  try {
    console.log('Test 5: 문서 삭제 (Delete)...');
    await deleteDoc(doc(db, collectionName, testId));

    // 삭제 확인
    const docSnap = await getDoc(doc(db, collectionName, testId));

    if (!docSnap.exists()) {
      console.log('✅ Delete 성공: 문서가 삭제되었습니다');
      testResults.tests.push({
        name: 'Delete Document',
        status: 'PASS',
        details: {
          documentId: testId,
          verified: 'Document no longer exists'
        }
      });
      testResults.summary.passed++;
    } else {
      throw new Error('문서가 삭제되지 않았습니다');
    }
  } catch (error: any) {
    console.error('❌ Delete 실패:', error.message);
    testResults.tests.push({
      name: 'Delete Document',
      status: 'FAIL',
      error: error.message
    });
    testResults.summary.failed++;
  }

  testResults.summary.total = testResults.tests.length;

  console.log('\n📊 테스트 요약:');
  console.log(`총 테스트: ${testResults.summary.total}`);
  console.log(`성공: ${testResults.summary.passed}`);
  console.log(`실패: ${testResults.summary.failed}`);

  return NextResponse.json(testResults, { status: 200 });
}
