/**
 * Local Storage Hook
 * 좋아요 기록 등 클라이언트 측 데이터 저장
 */

import { useState } from 'react';

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
    // State to store our value
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that
    // persists the new value to localStorage.
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}

// 좋아요 기록용 특화 Hook
export function useLikeRecord() {
    const [likeRecord, setLikeRecord] = useLocalStorage<{
        guestbookLikes: string[];
        memoryLikes: string[];
    }>('shu-90th-likes', {
        guestbookLikes: [],
        memoryLikes: [],
    });

    const hasLikedGuestbook = (id: string) => {
        return likeRecord.guestbookLikes.includes(id);
    };

    const toggleGuestbookLike = (id: string) => {
        setLikeRecord((prev) => ({
            ...prev,
            guestbookLikes: prev.guestbookLikes.includes(id)
                ? prev.guestbookLikes.filter((likeId) => likeId !== id)
                : [...prev.guestbookLikes, id],
        }));
    };

    const hasLikedMemory = (id: string) => {
        return likeRecord.memoryLikes.includes(id);
    };

    const toggleMemoryLike = (id: string) => {
        setLikeRecord((prev) => ({
            ...prev,
            memoryLikes: prev.memoryLikes.includes(id)
                ? prev.memoryLikes.filter((likeId) => likeId !== id)
                : [...prev.memoryLikes, id],
        }));
    };

    return {
        hasLikedGuestbook,
        toggleGuestbookLike,
        hasLikedMemory,
        toggleMemoryLike,
    };
}
