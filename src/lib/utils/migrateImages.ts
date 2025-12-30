/**
 * Unsplash 이미지를 Firebase Storage로 마이그레이션
 */

import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * URL에서 이미지를 다운로드하여 Firebase Storage에 업로드
 * @param imageUrl - 원본 이미지 URL (Unsplash 등)
 * @param storagePath - Storage 저장 경로 (예: 'hero', 'highlights')
 * @param fileName - 파일명 (예: 'background.jpg')
 * @returns Firebase Storage Download URL
 */
export async function migrateImageToStorage(
  imageUrl: string,
  storagePath: string,
  fileName: string
): Promise<string> {
  try {
    console.log(`🔄 마이그레이션 시작: ${imageUrl}`);

    // 1. Unsplash 이미지 다운로드
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // 2. Blob 변환
    const blob = await response.blob();
    console.log(`📦 이미지 다운로드 완료: ${blob.size} bytes`);

    // 3. Firebase Storage에 업로드
    const timestamp = Date.now();
    const storageFileName = `${timestamp}_${fileName}`;
    const storageRef = ref(storage, `${storagePath}/${storageFileName}`);

    console.log(`📤 Storage 업로드 중: ${storagePath}/${storageFileName}`);
    await uploadBytes(storageRef, blob);

    // 4. Download URL 가져오기
    const downloadURL = await getDownloadURL(storageRef);
    console.log(`✅ 마이그레이션 완료: ${downloadURL}`);

    return downloadURL;
  } catch (error) {
    console.error(`❌ 마이그레이션 실패 (${imageUrl}):`, error);
    throw error;
  }
}

/**
 * 여러 이미지를 한 번에 마이그레이션
 */
export async function migrateManyImages(
  images: Array<{
    url: string;
    path: string;
    fileName: string;
  }>
): Promise<Record<string, string>> {
  const results: Record<string, string> = {};

  for (const img of images) {
    try {
      const downloadURL = await migrateImageToStorage(
        img.url,
        img.path,
        img.fileName
      );
      results[img.fileName] = downloadURL;
    } catch (error) {
      console.error(`Failed to migrate ${img.fileName}:`, error);
      // 실패해도 계속 진행
      results[img.fileName] = img.url; // fallback: 원본 URL 사용
    }
  }

  return results;
}
