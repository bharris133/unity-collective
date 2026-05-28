/**
 * Storage Service
 *
 * Provides a unified interface for file uploads.
 * In mock mode (dev/test): returns a fake local URL immediately.
 * In production mode: uploads to Firebase Storage and returns the public download URL.
 *
 * Firebase Storage paths:
 *   - Verification docs:  onboarding/{memberId}/docs/{filename}
 *   - Product images:     products/{businessId}/{productId}/{filename}
 *   - Business logos:     businesses/{businessId}/logo/{filename}
 */

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Upload a verification document for a member during onboarding.
 * Returns the download URL (real or mock).
 */
export async function uploadVerificationDoc(
  memberId: string,
  file: File
): Promise<UploadResult> {
  if (USE_MOCK_DATA) {
    const mockPath = `onboarding/${memberId}/docs/${file.name}`;
    console.log(`📦 [Mock] Skipping upload for ${file.name}`);
    return { url: URL.createObjectURL(file), path: mockPath };
  }

  const path = `onboarding/${memberId}/docs/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return { url, path };
}

/**
 * Upload a product image.
 * Returns the download URL (real or mock).
 */
export async function uploadProductImage(
  businessId: string,
  productId: string,
  file: File
): Promise<UploadResult> {
  if (USE_MOCK_DATA) {
    const mockPath = `products/${businessId}/${productId}/${file.name}`;
    console.log(`📦 [Mock] Skipping upload for ${file.name}`);
    return { url: URL.createObjectURL(file), path: mockPath };
  }

  const path = `products/${businessId}/${productId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return { url, path };
}

/**
 * Upload a business logo.
 * Returns the download URL (real or mock).
 */
export async function uploadBusinessLogo(
  businessId: string,
  file: File
): Promise<UploadResult> {
  if (USE_MOCK_DATA) {
    const mockPath = `businesses/${businessId}/logo/${file.name}`;
    console.log(`📦 [Mock] Skipping upload for ${file.name}`);
    return { url: URL.createObjectURL(file), path: mockPath };
  }

  const path = `businesses/${businessId}/logo/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return { url, path };
}

/**
 * Delete a file from Firebase Storage by its path.
 * No-op in mock mode.
 */
export async function deleteStorageFile(path: string): Promise<void> {
  if (USE_MOCK_DATA) {
    console.log(`📦 [Mock] Skipping delete for ${path}`);
    return;
  }

  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}
