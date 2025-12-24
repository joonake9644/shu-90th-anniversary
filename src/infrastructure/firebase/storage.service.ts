import { ref, uploadBytes, getDownloadURL, deleteObject, StorageReference } from 'firebase/storage';
import { storage } from './config';

/**
 * Firebase Storage 서비스
 * Infrastructure Layer - Firebase Storage 연동
 */

/**
 * 이미지 업로드
 * @param file - 업로드할 파일
 * @param folder - 저장할 폴더 (예: 'news', 'events', 'timeline')
 * @returns 업로드된 이미지의 다운로드 URL
 */
export async function uploadImage(file: File, folder: string = 'uploads'): Promise<string> {
  // 파일명 생성 (타임스탬프 + 랜덤 문자열)
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(7);
  const ext = file.name.split('.').pop();
  const fileName = `${timestamp}-${randomStr}.${ext}`;

  // Storage 경로 생성 (folder/YYYY/MM/fileName)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const path = `${folder}/${year}/${month}/${fileName}`;

  // Storage 참조
  const storageRef: StorageReference = ref(storage, path);

  // 파일 업로드
  await uploadBytes(storageRef, file);

  // 다운로드 URL 반환
  const url = await getDownloadURL(storageRef);
  return url;
}

/**
 * 이미지 삭제
 * @param url - 삭제할 이미지의 다운로드 URL
 */
export async function deleteImage(url: string): Promise<void> {
  try {
    const storageRef: StorageReference = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('이미지 삭제 실패:', error);
    throw error;
  }
}

/**
 * 클라이언트 측 이미지 최적화
 * @param file - 최적화할 파일
 * @param maxWidth - 최대 너비 (기본: 1920px)
 * @returns 최적화된 파일
 */
export async function optimizeImage(file: File, maxWidth: number = 1920): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // 최대 너비를 초과하면 리사이징
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);

        // JPEG로 변환 (85% 품질)
        canvas.toBlob(
          (blob) => {
            resolve(new File([blob!], file.name, { type: 'image/jpeg' }));
          },
          'image/jpeg',
          0.85
        );
      };

      img.src = e.target!.result as string;
    };

    reader.readAsDataURL(file);
  });
}
