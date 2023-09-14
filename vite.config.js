import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
import svgr from "vite-plugin-svgr";

const require = createRequire(import.meta.url); // construct the require method
const pkg = require("./package.json");
console.log(electron);
// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV !== "development" ? "./" : "/",
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
