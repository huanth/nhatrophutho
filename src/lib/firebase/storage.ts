// Firebase Storage helpers
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./config";

// Upload room image
export async function uploadRoomImage(
  file: File,
  roomId: string,
  index: number
): Promise<string> {
  const extension = file.name.split(".").pop();
  const fileName = `rooms/${roomId}/${Date.now()}_${index}.${extension}`;
  const storageRef = ref(storage, fileName);

  await uploadBytes(storageRef, file, {
    contentType: file.type,
    customMetadata: {
      roomId,
      uploadedAt: new Date().toISOString(),
    },
  });

  return getDownloadURL(storageRef);
}

// Upload multiple images
export async function uploadRoomImages(
  files: File[],
  roomId: string
): Promise<string[]> {
  const uploadPromises = files.map((file, index) =>
    uploadRoomImage(file, roomId, index)
  );
  return Promise.all(uploadPromises);
}

// Upload user avatar
export async function uploadAvatar(file: File, uid: string): Promise<string> {
  const extension = file.name.split(".").pop();
  const fileName = `avatars/${uid}.${extension}`;
  const storageRef = ref(storage, fileName);

  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}

// Delete image
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}
