'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import { storage } from '@/lib/firebase';
import {
  ref,
  listAll,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
  getMetadata,
} from 'firebase/storage';

interface MediaFile {
  name: string;
  url: string;
  path: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

/**
 * 미디어 라이브러리 페이지
 */
export default function MediaLibraryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(ADMIN_ROUTES.LOGIN);
    }
  }, [user, authLoading, router]);

  // 미디어 파일 목록 로드
  useEffect(() => {
    if (user) {
      loadMediaFiles();
    }
  }, [user]);

  const loadMediaFiles = async () => {
    try {
      setLoading(true);
      const mediaFiles: MediaFile[] = [];

      // Firebase Storage의 루트 폴더 목록 가져오기
      const folders = ['uploads', 'periods', 'highlights', 'news', 'events', 'videos', 'history'];

      for (const folder of folders) {
        try {
          const folderRef = ref(storage, folder);
          const result = await listAll(folderRef);

          for (const itemRef of result.items) {
            try {
              const url = await getDownloadURL(itemRef);
              const metadata = await getMetadata(itemRef);

              mediaFiles.push({
                name: itemRef.name,
                url,
                path: itemRef.fullPath,
                size: metadata.size,
                type: metadata.contentType || 'unknown',
                uploadedAt: new Date(metadata.timeCreated),
              });
            } catch (error) {
              console.error(`Error loading file ${itemRef.name}:`, error);
            }
          }
        } catch (error) {
          console.log(`Folder ${folder} does not exist or is empty`);
        }
      }

      // 최신 파일이 먼저 오도록 정렬
      mediaFiles.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
      setFiles(mediaFiles);
    } catch (error) {
      console.error('Error loading media files:', error);
      alert('미디어 파일을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 유효성 검사
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert('파일 크기는 50MB 이하여야 합니다.');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // 파일 타입에 따라 폴더 결정
      let folder = 'uploads';
      if (file.type.startsWith('image/')) {
        folder = 'uploads';
      } else if (file.type.startsWith('video/')) {
        folder = 'videos';
      }

      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          alert('업로드에 실패했습니다.');
          setUploading(false);
        },
        async () => {
          setUploading(false);
          setUploadProgress(0);
          await loadMediaFiles();
          alert('파일이 업로드되었습니다!');
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      alert('업로드에 실패했습니다.');
      setUploading(false);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`"${file.name}" 파일을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const fileRef = ref(storage, file.path);
      await deleteObject(fileRef);
      alert('파일이 삭제되었습니다.');
      await loadMediaFiles();
    } catch (error) {
      console.error('Delete error:', error);
      alert('파일 삭제에 실패했습니다.');
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredFiles = files.filter((file) => {
    if (filter === 'all') return true;
    if (filter === 'images') return file.type.startsWith('image/');
    if (filter === 'videos') return file.type.startsWith('video/');
    return true;
  });

  // 로딩 중이거나 로그인하지 않은 경우
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 헤더 */}
      <header className="bg-gray-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-amber-500">미디어 라이브러리</h1>
              <p className="text-sm text-gray-400 mt-1">
                이미지, 비디오 등 미디어 파일을 관리합니다 ({files.length}개 파일)
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors disabled:bg-gray-700 disabled:text-gray-500"
              >
                {uploading ? `업로드 중... ${Math.round(uploadProgress)}%` : '+ 파일 업로드'}
              </button>
              <Link
                href={ADMIN_ROUTES.DASHBOARD}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                대시보드로
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 필터 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-amber-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            전체 ({files.length})
          </button>
          <button
            onClick={() => setFilter('images')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'images'
                ? 'bg-amber-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            이미지 ({files.filter((f) => f.type.startsWith('image/')).length})
          </button>
          <button
            onClick={() => setFilter('videos')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'videos'
                ? 'bg-amber-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            비디오 ({files.filter((f) => f.type.startsWith('video/')).length})
          </button>
        </div>

        {/* 미디어 그리드 */}
        {loading ? (
          <div className="bg-gray-900 border border-white/10 rounded-lg p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
              <p className="text-gray-400">미디어 파일을 불러오는 중...</p>
            </div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="bg-gray-900 border border-white/10 rounded-lg p-12 text-center">
            <p className="text-gray-400 mb-4">
              {filter === 'all'
                ? '업로드된 파일이 없습니다.'
                : `${filter === 'images' ? '이미지' : '비디오'} 파일이 없습니다.`}
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors"
            >
              첫 파일 업로드하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.path}
                className="bg-gray-900 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors"
              >
                {/* 미리보기 */}
                <div className="relative w-full h-48 bg-gray-800">
                  {file.type.startsWith('image/') ? (
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : file.type.startsWith('video/') ? (
                    <div className="flex items-center justify-center h-full">
                      <svg
                        className="w-16 h-16 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <svg
                        className="w-16 h-16 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* 파일 정보 */}
                <div className="p-4">
                  <h3 className="text-sm font-medium text-white truncate mb-2" title={file.name}>
                    {file.name}
                  </h3>
                  <div className="text-xs text-gray-400 space-y-1 mb-3">
                    <div>{formatFileSize(file.size)}</div>
                    <div>{file.uploadedAt.toLocaleDateString()}</div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyUrl(file.url)}
                      className="flex-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
                    >
                      {copiedUrl === file.url ? '✓ 복사됨' : 'URL 복사'}
                    </button>
                    <button
                      onClick={() => handleDelete(file)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}
