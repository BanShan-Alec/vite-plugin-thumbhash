export interface IOptions {
  cacheDir: string;
  cacheFile: string;
  useCache?: boolean; // 新增配置项
  thumbhashOptions: {
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
