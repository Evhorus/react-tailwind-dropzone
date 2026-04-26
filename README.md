# React Tailwind Dropzone

A highly customizable, framework-agnostic, and zero-dependency React file dropzone component for modern web applications.

## Features

- **Drag and Drop**: Seamless file uploading experience.
- **Validation**: Strict dimension and aspect ratio validation for images.
- **Performance**: Smart preview generation utilizing `WeakMap` to prevent memory leaks.
- **Standalone**: Zero external UI dependencies (no icons libraries, no toast libraries, no custom button dependencies).
- **Agnostic**: Use standard `<img>` or inject your framework's image component (like `next/image`).
- **Styling**: Built with Tailwind CSS for easy customization.

## Installation

```bash
npm install react-tailwind-dropzone
```
*(Note: Tailwind class merging utilities (`clsx` and `tailwind-merge`) will be installed automatically as dependencies of this package).*

## Usage

```tsx
import { useState } from "react";
import { FileDropzone, MediaItem } from "react-tailwind-dropzone";

export default function App() {
  const [media, setMedia] = useState<MediaItem[]>([]);

  return (
    <FileDropzone
      media={media}
      onChange={setMedia}
      onError={(msg) => alert(msg)}
      maxFiles={5}
      aspectRatio="square"
    />
  );
}
```
