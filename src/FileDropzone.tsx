"use client";
import * as React from "react";
import { useRef, useState } from "react";
import { cn, getOrCreatePreview } from "./utils";
import { UploadIcon, XIcon } from "./icons";
import type { FileDropzoneProps, MediaItem } from "./types";

/**
 * A highly customizable file dropzone component for images and other files.
 * Supports drag-and-drop, image dimension validation, and previews.
 */
export default function FileDropzone({
  media = [],
  error = "",
  maxFiles = Infinity,
  aspectRatio = "square",
  loadingPreviewImage,
  accept = "image/*",
  validation,
  disabled = false,
  CustomImageComponent,
  onError,
  onChange,
}: FileDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setDragActive(e.type !== "dragleave" && e.type !== "drop");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    addFiles(Array.from(e.dataTransfer.files));
    setDragActive(false);
  };

  const validateImage = (file: File): Promise<boolean> => {
    if (!validation) return Promise.resolve(true);

    // Skip dimension validation for SVG files
    // SVGs are vector-based and don't have meaningful pixel dimensions
    if (file.type === "image/svg+xml") {
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      const img = new Image(); // Browser Image object
      img.src = getOrCreatePreview(file);
      img.onload = () => {
        const { width, height } = img;
        let isValid = true;
        const errors: string[] = [];

        if (validation.exact) {
          if (
            width !== validation.exact.width ||
            height !== validation.exact.height
          ) {
            isValid = false;
            errors.push(
              `Dimensiones exactas requeridas: ${validation.exact.width}x${validation.exact.height}px.`,
            );
          }
        }

        if (validation.min) {
          if (width < validation.min.width || height < validation.min.height) {
            isValid = false;
            errors.push(
              `Dimensiones mínimas requeridas: ${validation.min.width}x${validation.min.height}px.`,
            );
          }
        }

        if (validation.aspectRatio) {
          const ratio = width / height;
          // Allow small tolerance
          if (Math.abs(ratio - validation.aspectRatio) > 0.05) {
            isValid = false;
            errors.push(`Relación de aspecto incorrecta.`);
          }
        }

        if (!isValid) {
          if (onError) {
            onError(
              `Error en imagen "${file.name}": ${errors.join(" ")} Recibido: ${width}x${height}px.`,
            );
          }
        }

        resolve(isValid);
      };
      img.onerror = () => {
        resolve(false);
      };
    });
  };

  const addFiles = async (newFiles: File[]) => {
    if (disabled) return;

    const duplicates = newFiles.filter((file) =>
      media.some((item) => item instanceof File && item.name === file.name),
    );
    const unique = newFiles.filter(
      (file) => !duplicates.some((dup) => dup.name === file.name),
    );

    if (duplicates.length > 0) {
      duplicates.forEach((dup) => {
        if (onError) onError(`La imagen "${dup.name}" ya existe`);
      });
    }

    // Validate dimensions
    const validFiles: File[] = [];
    for (const file of unique) {
      // Only validate images
      if (file.type.startsWith("image/")) {
        const isValid = await validateImage(file);
        if (isValid) validFiles.push(file);
      } else {
        validFiles.push(file);
      }
    }

    // Only add files up to maxFiles limit
    const spaceLeft = maxFiles - media.length;
    const toAdd = validFiles.slice(0, spaceLeft);

    if (spaceLeft <= 0 && validFiles.length > 0) {
      if (onError)
        onError(`Has alcanzado el límite máximo de ${maxFiles} imágenes`);
      return;
    }

    if (validFiles.length > toAdd.length) {
      if (onError)
        onError(`Solo se pueden agregar hasta ${maxFiles} imágenes en total`);
    }

    if (toAdd.length > 0) {
      const updated = [...media, ...toAdd];
      onChange(updated);
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || disabled) return;
    addFiles(Array.from(e.target.files));
  };

  const removeMediaItem = (item: MediaItem) => {
    if (disabled) return;
    const updated = media.filter((m) =>
      typeof m === "string"
        ? m !== item
        : !(item instanceof File) || m.name !== item.name,
    );
    onChange(updated);

    if (inputRef.current) inputRef.current.value = "";
  };

  const getMediaSrc = (m: MediaItem) => {
    return typeof m === "string" ? m : getOrCreatePreview(m);
  };

  // Calculate aspect class based on prop
  const aspectClass =
    aspectRatio === "square" ? "aspect-square" : "aspect-[16/9]";

  return (
    <div className="grid auto-rows-fr grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-2">
      {/* Mostrar botón de subir solo si no se llegó al máximo */}
      {media.length < maxFiles && (
        <div
          className={cn(
            "relative justify-center rounded-lg border-2 p-1 text-center transition-all duration-200",
            disabled
              ? "cursor-not-allowed opacity-50 bg-gray-100 border-gray-200"
              : dragActive
                ? "border-blue-300 bg-blue-50"
                : error
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 bg-gray-50 hover:border-gray-400",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div
            className={cn(
              aspectClass,
              "flex max-h-full flex-col justify-center overflow-hidden",
            )}
          >
            <UploadIcon className="mx-auto text-gray-400" />
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Subir Imagen
            </p>
            <p className="mt-2 text-[9px] text-gray-400 sm:text-xs">
              PNG, JPG, Webp
            </p>
            <input
              ref={inputRef}
              key={media.length}
              type="file"
              multiple
              accept={accept}
              disabled={disabled}
              className={cn(
                "absolute inset-0 h-full w-full opacity-0",
                disabled ? "cursor-not-allowed" : "cursor-pointer",
              )}
              onChange={handleFileChange}
            />
          </div>
        </div>
      )}

      {/* Previews de imágenes */}
      {media.length > 0 &&
        media.map((m, i) => (
          <div key={i} className={cn("group relative", aspectClass)}>
            <div
              className={cn(
                "overflow-hidden rounded-lg border border-gray-200 bg-white",
                aspectClass,
                disabled && "opacity-60",
              )}
            >
              {CustomImageComponent ? (
                <CustomImageComponent
                  src={getMediaSrc(m) || "/placeholder.svg"}
                  alt={`Media preview ${i + 1}`}
                  className="h-full w-full object-contain"
                  width={aspectRatio === "square" ? 500 : 640}
                  height={aspectRatio === "square" ? 500 : 360}
                  loading={loadingPreviewImage}
                />
              ) : (
                <img
                  src={getMediaSrc(m) || "/placeholder.svg"}
                  alt={`Media preview ${i + 1}`}
                  className="h-full w-full object-contain"
                  loading={loadingPreviewImage}
                />
              )}
            </div>
            {!disabled && (
              <button
                onClick={() => removeMediaItem(m)}
                type="button"
                className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-md bg-white/70 p-1 transition-colors hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label={`Eliminar imagen`}
              >
                <XIcon className="h-4 w-4 text-red-600" />
              </button>
            )}
          </div>
        ))}
    </div>
  );
}
