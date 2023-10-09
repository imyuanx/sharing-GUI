import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
import svgr from "vite-plugin-svgr";
import { resolve } from "path"; // 导入 path 模块，帮助我们解析路径

const require = createRequire(import.meta.url); // construct the require method
const pkg = require("./package.json");

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV !== "development" ? "./" : "/",
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "src"),
      },
      {
        find: "assets",
        replacement: resolve(__dirname, "assets"),
      },
    ],
  },
  build: {
    outDir: "vite-build",
  },
  plugins: [
    react(),
    electron({
      main: {
        entry: "./main.cjs",
      },
    }),
    svgr(),
  ],
  server: {
    host: pkg.env.SERVER_HOST,
    port: pkg.env.SERVER_PORT,
  },
});
