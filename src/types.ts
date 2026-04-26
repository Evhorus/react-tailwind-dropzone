import * as React from "react";

/**
 * Represents a media item that can be either an uploaded file URL (string)
 * or a locally selected file (File).
 */
export type MediaItem = string | File;

/**
 * Validation rules for image uploads.
 */
export interface ImageValidation {
  /** Require exact dimensions (e.g., exactly 800x600) */
  exact?: { width: number; height: number };
  /** Require minimum dimensions (e.g., at least 400x400) */
  min?: { width: number; height: number };
  /** Require a specific aspect ratio (e.g., 1.77 for 16:9, or 1 for square) */
  aspectRatio?: number;
}

/**
 * Props for the FileDropzone component.
 */
export interface FileDropzoneProps {
  /** Optional title for the dropzone (currently unused in UI but kept for API compatibility) */
  title?: string;
  /** Optional description for the dropzone (currently unused in UI but kept for API compatibility) */
  description?: string;
  /** Array of currently selected or uploaded media items */
  media?: MediaItem[];
  /** Error message to display, changes dropzone border color to red if present */
  error?: string;
  /** Maximum number of files allowed. Defaults to Infinity */
  maxFiles?: number;
  /** Aspect ratio constraint for the preview containers */
  aspectRatio?: "square" | "16:9";
  /** Loading strategy for the Next.js Image component */
  loadingPreviewImage?: "lazy" | "eager";
  /** HTML input accept attribute. Defaults to "image/*" */
  accept?: string;
  /** Validation rules for the image dimensions and aspect ratio */
  validation?: ImageValidation;
  /** Disables the dropzone and prevents adding or removing files */
  disabled?: boolean;
  /** Optional custom image component (e.g. Next.js Image). Defaults to standard HTML img */
  CustomImageComponent?: React.ElementType<any>;
  /** Callback fired when an error occurs (e.g., validation fails, max files reached) */
  onError?: (message: string) => void;
  /** Callback fired when the media list changes */
  onChange: (media: MediaItem[]) => void;
}
