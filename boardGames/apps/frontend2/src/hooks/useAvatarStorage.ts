import { useCallback, useEffect, useState } from "react";

interface UseAvatarStorageResult {
  getAvatar: (key: string) => Promise<string | null>;
  storeAvatar: (key: string, imageUrl: string) => Promise<void>;
  error: Error | null;
}

const DB_NAME = "FriendsAvatarDB";
const STORE_NAME = "avatars";
const DB_VERSION = 1;

export function useAvatarStorage(): UseAvatarStorageResult {
  const [error, setError] = useState<Error | null>(null);

  // Initialize IndexedDB
  useEffect(() => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      setError(new Error("Failed to open IndexedDB"));
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  }, []);

  // Convert image URL to Blob
  const urlToBlob = async (url: string): Promise<Blob> => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch image");
      return await response.blob();
    } catch (err) {
      throw new Error(`Failed to convert URL to Blob: ${err}`);
    }
  };

  // Store avatar in IndexedDB
  const storeAvatar = useCallback(
    async (key: string, imageUrl: string): Promise<void> => {
      try {
        const blob = await urlToBlob(imageUrl);
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
          const request = indexedDB.open(DB_NAME);
          request.onerror = () => reject(new Error("Failed to open IndexedDB"));
          request.onsuccess = () => resolve(request.result);
        });

        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        await new Promise<void>((resolve, reject) => {
          const request = store.put(blob, key);
          request.onerror = () => reject(new Error("Failed to store avatar"));
          request.onsuccess = () => resolve();
        });

        db.close();
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    []
  );

  // Retrieve avatar from IndexedDB
  const getAvatar = useCallback(async (key: string): Promise<string | null> => {
    try {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME);
        request.onerror = () => reject(new Error("Failed to open IndexedDB"));
        request.onsuccess = () => resolve(request.result);
      });

      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);

      const blob = await new Promise<Blob | null>((resolve, reject) => {
        const request = store.get(key);
        request.onerror = () => reject(new Error("Failed to retrieve avatar"));
        request.onsuccess = () => resolve(request.result);
      });

      db.close();

      if (!blob) return null;
      return URL.createObjectURL(blob);
    } catch (err) {
      setError(err as Error);
      return null;
    }
  }, []);

  return { getAvatar, storeAvatar, error };
}
