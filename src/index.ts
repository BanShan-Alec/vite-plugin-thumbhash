import type { Plugin } from "vite";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { rgbaToDataURL } from "thumbhash";
import type { IOptions } from "./constant";
import {
  DEFAULT_CACHE_DIR,
  DEFAULT_CACHE_FILE,
  DEFAULT_WIDTH,
  SUPPORTED_IMAGE_EXTS,
  LOADER_SUFFIX,
} from "./constant";

export default (options: Partial<IOptions> = {}) => {
  // 合并用户配置和默认配置
  const config = {
    cacheDir: options.cacheDir || DEFAULT_CACHE_DIR,
    cacheFile: options.cacheFile || DEFAULT_CACHE_FILE,
    thumbWidth: options.thumbhashOptions?.width || DEFAULT_WIDTH,
    useCache: options.useCache ?? true, // 默认启用缓存
  };

  let cache = new Map();
  let cacheFile = "";
  let saveThrottleTimer: NodeJS.Timeout | null = null;
  let log = (...args: any[]) => {};

  // 加载缓存
  function loadCache() {
    if (!config.useCache) return;
    try {
      if (fs.existsSync(cacheFile)) {
        const data: Record<string, string> = JSON.parse(
          fs.readFileSync(cacheFile, "utf-8")
        );
        cache = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error("Failed to load thumbhash cache:", error);
    }
  }

  // 缓存写入磁盘
  function saveCache() {
    if (!config.useCache) return;
    if (saveThrottleTimer) {
      clearTimeout(saveThrottleTimer);
    }

    saveThrottleTimer = setTimeout(() => {
      try {
        fs.writeFileSync(cacheFile, JSON.stringify(Object.fromEntries(cache)));
      } catch (error) {
        console.error("Failed to save thumbhash cache:", error);
      }
      saveThrottleTimer = null;
    }, 5000); // 5秒节流
  }

  async function genThumbhashByPath(path: string) {
    return new Promise((resolve, reject) => {
      sharp(path)
        .metadata()
        .then((metadata) => {
          const originalWidth = metadata.width;
          const originalHeight = metadata.height;
          if (!originalWidth || !originalHeight) {
            reject("Not a valid image!");
            return;
          }

          const targetWidth = Math.min(config.thumbWidth, 100);
          // 保持宽高比计算新的高度
          let targetHeight = Math.round(
            (originalHeight / originalWidth) * targetWidth
          );
          // thumbhash限制宽/高度最大为100
          targetHeight = Math.min(targetHeight, 100);

          sharp(path)
            .raw()
            .ensureAlpha()
            .resize(targetWidth, targetHeight)
            .toBuffer((err, buffer, { width, height }) => {
              if (err) return reject(err);

              const dataUrl = rgbaToDataURL(width, height, buffer);
              resolve(dataUrl);
            });
        })
        .catch(reject);
    });
  }

  const plugin: Plugin = {
    name: "vite-plugin-thumbhash",
    enforce: "pre",
    config(_, { command }) {
      if (command === "build") {
        log = console.log;
      }
    },
    configResolved({ cacheDir: viteCacheDir, root }) {
      if (config.cacheDir === DEFAULT_CACHE_DIR) {
        cacheFile = path.resolve(viteCacheDir, config.cacheFile);
      } else {
        cacheFile = path.resolve(root, config.cacheDir, config.cacheFile);
      }
      loadCache();
      log("\n [vite-thumbhash-plugin]", cacheFile, cache.size);
    },
    async load(id) {
      if (!id.endsWith(LOADER_SUFFIX)) return null;

      const fileExt = path.extname(id.replace(LOADER_SUFFIX, "").toLowerCase());
      if (!SUPPORTED_IMAGE_EXTS.includes(fileExt)) return null;

      const imagePath = id.replace(LOADER_SUFFIX, "");

      // 优先从缓存中读取
      if (cache.has(imagePath)) {
        log("\n [vite-thumbhash-plugin] cache hit", imagePath);
        return `export default "${cache.get(imagePath)}";`;
      }

      // 生成 thumbhash
      try {
        const hash = await genThumbhashByPath(imagePath);
        if (config.useCache) {
          cache.set(imagePath, hash);
          saveCache();
        }
        return `export default "${hash}";`;
      } catch (error: any) {
        console.error(
          `Failed to generate thumbhash for ${imagePath}: ${error.message}`
        );
        return `export default "";`;
      }
    },
  };

  return plugin;
};
