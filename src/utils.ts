import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// WeakMap to store object URLs for File instances to prevent memory leaks
// and avoid recreating URLs on every render.
export const filePreviewMap = new WeakMap<File, string>();

export const getOrCreatePreview = (file: File) => {
  if (!filePreviewMap.has(file)) {
    filePreviewMap.set(file, URL.createObjectURL(file));
  }
  return filePreviewMap.get(file) as string;
};
