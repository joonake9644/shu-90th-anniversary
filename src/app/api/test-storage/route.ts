import { NextResponse } from 'next/server';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Firebase Storage 테스트 API
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

  console.log('🧪 Firebase Storage 테스트 시작...\n');

  // 테스트 1: 텍스트 파일 업로드
  try {
    console.log('Test 1: 텍스트 파일 업로드...');
    const testContent = `Firebase Storage Test - ${new Date().toISOString()}`;
    const testBlob = new Blob([testContent], { type: 'text/plain' });
    const testFile = new File([testBlob], 'test.txt');

    const fileName = `test-${Date.now()}.txt`;
    const storageRef = ref(storage, `test/${fileName}`);

    await uploadBytes(storageRef, testFile);
    const downloadURL = await getDownloadURL(storageRef);

    console.log('✅ 업로드 성공:', downloadURL);

    testResults.tests.push({
      name: 'Text File Upload',
      status: 'PASS',
      details: {
        fileName,
        url: downloadURL,
        size: testBlob.size
      }
    });
    testResults.summary.passed++;

    // 테스트 2: 다운로드 URL 접근 가능 확인
    try {
      console.log('Test 2: 다운로드 URL 접근 확인...');
      const response = await fetch(downloadURL);
      if (response.ok) {
        const content = await response.text();
        console.log('✅ 다운로드 성공:', content.substring(0, 50));
        testResults.tests.push({
          name: 'Download URL Access',
          status: 'PASS',
          details: {
            statusCode: response.status,
            contentPreview: content.substring(0, 100)
          }
        });
        testResults.summary.passed++;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error: any) {
      console.error('❌ 다운로드 실패:', error.message);
      testResults.tests.push({
        name: 'Download URL Access',
        status: 'FAIL',
        error: error.message
      });
      testResults.summary.failed++;
    }

    // 테스트 3: 파일 삭제
    try {
      console.log('Test 3: 파일 삭제...');
      await deleteObject(storageRef);
      console.log('✅ 삭제 성공');

      testResults.tests.push({
        name: 'File Deletion',
        status: 'PASS',
        details: {
          deletedFile: fileName
        }
      });
      testResults.summary.passed++;
    } catch (error: any) {
      console.error('❌ 삭제 실패:', error.message);
      testResults.tests.push({
        name: 'File Deletion',
        status: 'FAIL',
        error: error.message
      });
      testResults.summary.failed++;
    }

  } catch (error: any) {
    console.error('❌ 업로드 실패:', error.message);
    testResults.tests.push({
      name: 'Text File Upload',
      status: 'FAIL',
      error: error.message
    });
    testResults.summary.failed++;
  }

  // 테스트 4: 큰 파일 업로드 (제한 테스트)
  try {
    console.log('Test 4: 파일 크기 제한 확인...');
    // 1MB 파일 생성
    const largeContent = 'x'.repeat(1024 * 1024);
    const largeBlob = new Blob([largeContent], { type: 'text/plain' });
    const largeFile = new File([largeBlob], 'large-test.txt');

    const largeFileName = `test-large-${Date.now()}.txt`;
    const largeStorageRef = ref(storage, `test/${largeFileName}`);

    await uploadBytes(largeStorageRef, largeFile);
    console.log('✅ 1MB 파일 업로드 성공');

    // 정리
    await deleteObject(largeStorageRef);

    testResults.tests.push({
      name: 'Large File Upload (1MB)',
      status: 'PASS',
      details: {
        size: largeBlob.size,
        sizeInMB: (largeBlob.size / 1024 / 1024).toFixed(2)
      }
    });
    testResults.summary.passed++;
  } catch (error: any) {
    console.error('❌ 큰 파일 업로드 실패:', error.message);
    testResults.tests.push({
      name: 'Large File Upload (1MB)',
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
