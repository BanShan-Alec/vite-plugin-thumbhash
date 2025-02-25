# vite-plugin-thumbhash

A Vite Plugin to generate [ThumbHash](https://evanw.github.io/thumbhash/) data URLs at compile time for your images.

ThumbHash generates compact image preview placeholders, similar to BlurHash but with smaller output size.

## Features

- 🚀 Generate ThumbHash data URLs during build time
- 💾 Built-in caching for better performance
- 🎯 TypeScript support
- 📦 Makesure the aspect ratio of imgage.

  > Use `sharp.js` to fix this issue [Aspect ratio isn't the same · Issue #31 · evanw/thumbhash](https://github.com/evanw/thumbhash/issues/31)
- 🖼️ Support multiple image formats (PNG, JPG, JPEG, WebP, AVIF, GIF)

## [Why ThumbHash?](https://evanw.github.io/thumbhash/)

- Encodes more detail in the same space
- Also encodes the aspect ratio
- Gives more accurate colors
- Supports images with alpha

## Installation

```bash
npm install vite-plugin-thumbhash --save-dev
# or
yarn add vite-plugin-thumbhash -D
# or
pnpm add vite-plugin-thumbhash -D
```

## Usage

### 1. Configure Vite Plugin

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import thumbhash from 'vite-plugin-thumbhash'

export default defineConfig({
  plugins: [
    thumbhash({
      // optional configurations
      thumbhashOptions: {
        width: 40, // default: 40, max: 100
      },
      useCache: true, // default: true
    })
  ]
})
```

### 2. Import and Use (React)

```typescript
// App.tsx
import { useState } from 'react'
import url from './assets/photo.jpg'
import thumbUrl from './assets/photo.jpg?thumb' // Import with ?thumb suffix

const ImageComponent = (props) => {
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
      const image = new Image()
      image.onload = () => {
          setLoading(false)
      };
      image.src = url
    }, [url])
  
  return (
    <div>
      <img width={'366px'} src={loading ? thumbUrl : url} />
    </div>
  )
}
export default ImageComponent
```

## Configuration Options

```typescript
interface IOptions {
  cacheDir?: string;       // Custom cache directory (relative to project root)
  cacheFile?: string;      // Custom cache filename (default: "thumbhash-cache.json")
  useCache?: boolean;      // Enable/disable caching (default: true)
  thumbhashOptions?: {
    width?: number;        // ThumbHash image width (default: 40, max: 100)
  };
}
```

## Type Support

Types for importing images with `?thumb` suffix are provided.

```ts
// vite-env.d.ts

/// <reference types="vite/client" />
/// <reference types="vite-plugin-thumbhash/types/images" />
```

## License

MIT
