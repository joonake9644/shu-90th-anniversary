'use client';

import { useState, useRef } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import Image from 'next/image';

interface ImageUploadProps {
  value: string; // 현재 이미지 URL
  onChange: (url: string) => void; // URL 변경 콜백
  label?: string;
  path?: string; // Storage 저장 경로 (예: 'periods', 'news', 'events')
  required?: boolean;
}

/**
 * Firebase Storage 이미지 업로드 컴포넌트
 * - 파일 선택 / 드래그 앤 드롭
 * - 업로드 진행률 표시
 * - 이미지 미리보기
 * - 기존 이미지 삭제
 */
export function ImageUpload({ value, onChange, label = '이미지', path = 'uploads', required = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // 파일 유효성 검사
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      setError('파일 크기는 10MB 이하여야 합니다.');
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      // Firebase Storage 경로 생성
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const storageRef = ref(storage, `${path}/${fileName}`);

      // 업로드 시작
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // 진행률 업데이트
          const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(percentage);
        },
        (error) => {
          console.error('Upload error:', error);
          setError('업로드에 실패했습니다.');
          setUploading(false);
        },
        async () => {
          // 업로드 완료
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onChange(downloadURL);
          setUploading(false);
          setProgress(0);
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      setError('업로드에 실패했습니다.');
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    if (confirm('이미지를 제거하시겠습니까?')) {
      onChange('');
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      {/* 현재 이미지 미리보기 */}
      {value && !uploading && (
        <div className="relative">
          <div className="relative w-full h-48 bg-gray-800 rounded-lg overflow-hidden">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
            >
              이미지 변경
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
            >
              제거
            </button>
          </div>
        </div>
      )}

      {/* 업로드 영역 */}
      {!value && !uploading && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${dragActive
              ? 'border-amber-500 bg-amber-500/10'
              : 'border-white/20 hover:border-white/40 bg-black'
            }
          `}
        >
          <div className="text-gray-400">
            <svg
              className="mx-auto h-12 w-12 mb-3"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm">
              <span className="font-medium text-amber-500">클릭</span>하여 파일 선택 또는{' '}
              <span className="font-medium">드래그 앤 드롭</span>
            </p>
            <p className="text-xs mt-1">PNG, JPG, GIF (최대 10MB)</p>
          </div>
        </div>
      )}

      {/* 업로드 중 */}
      {uploading && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">업로드 중...</span>
            <span className="text-sm text-amber-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* URL 직접 입력 (선택사항) */}
      <details className="text-sm">
        <summary className="text-gray-400 cursor-pointer hover:text-white">
          또는 URL 직접 입력
        </summary>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="mt-2 w-full px-4 py-2 bg-black border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none"
        />
      </details>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
