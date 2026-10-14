import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === "true" ? "/just-like-rabbits/" : "/",
  server: { strictPort: true },
  build: { target: "es2023" },
});
