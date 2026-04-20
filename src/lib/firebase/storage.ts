import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { getFirebaseStorage } from './config';

export const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export function buildStoragePath(uid: string, projectId: string, itemId: string, filename: string): string {
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `projects/${uid}/${projectId}/${itemId}/${sanitized}`;
}

export function uploadFile(
  file: File,
  path: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(getFirebaseStorage(), path);
    const task = uploadBytesResumable(storageRef, file);
    task.on(
      'state_changed',
      (snap) => {
        if (onProgress) onProgress((snap.bytesTransferred / snap.totalBytes) * 100);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    const storageRef = ref(getFirebaseStorage(), fileUrl);
    await deleteObject(storageRef);
  } catch {
    // Ignore not-found errors on cleanup
  }
}
