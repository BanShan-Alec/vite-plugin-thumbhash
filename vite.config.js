// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  // https://cn.vitejs.dev/config/build-options.html#build-lib
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vite", "thumbhash", "sharp", "fs", "path"],
    },
  },
  plugins: [dts({ rollupTypes: true })],
});
