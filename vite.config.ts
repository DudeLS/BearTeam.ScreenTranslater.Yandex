import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "dist",
        sourcemap: false,
        rollupOptions: {
            input: {
                popup: resolve(__dirname, "src/popup/popup.tsx"),
                options: resolve(__dirname, "src/options/options.tsx"),
                content: resolve(__dirname, "src/content/content.ts"),
                offscreen: resolve(__dirname, "src/offscreen/offscreen.ts"),
                background: resolve(__dirname, "src/background/background.ts"),
            },
            output: {
                entryFileNames: "[name].js",
                chunkFileNames: "[name].[hash].js",
                assetFileNames: "[name].[ext]",
            },
        },
    },
});
