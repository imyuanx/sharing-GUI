import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const pkg = require("./package.json");
console.log(electron);
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        entry: "./main.cjs",
      },
    }),
  ],
  server: {
    host: pkg.env.SERVER_HOST,
    port: pkg.env.SERVER_PORT,
  },
});
