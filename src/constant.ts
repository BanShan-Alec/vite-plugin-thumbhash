export interface IOptions {
  /**
   *
   * default: [cacheDir | Vite](https://vite.dev/config/shared-options.html#cachedir)
   *
   * you can set the cacheDir to a custom directory, relative to the project [root | Vite](https://vite.dev/config/shared-options.html#root).
   */
  cacheDir: string;
  /**
   *
   * default: thumbhash-cache.json
   *
   * you can set the cacheFile to a custom file name.
   */
  cacheFile: string;
  /**
   *
   * default: true
   *
   * you can set the useCache to false to disable the cache.
   */
  useCache: boolean;
  thumbhashOptions: {
    /**
     *
     * default: 40, max: 100
     *
     * unit: px
     *
     * you can set a smaller width to reduce ThumbHash's size.
     */
    width?: number;
  };
}

// 默认配置
const DEFAULT_CACHE_DIR = undefined; // 用户可自定义的默认缓存目录
const DEFAULT_CACHE_FILE = "thumbhash-cache.json"; // 用户可自定义的默认缓存文件名
const DEFAULT_WIDTH = 40; // thumbhash 图片默认宽度
const SUPPORTED_IMAGE_EXTS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".gif",
]; // 新增支持的图片格式
const LOADER_SUFFIX = "?thumb"; // 加载器后缀

export {
  DEFAULT_CACHE_DIR,
  DEFAULT_CACHE_FILE,
  DEFAULT_WIDTH,
  SUPPORTED_IMAGE_EXTS,
  LOADER_SUFFIX,
};
