import { defineConfig } from 'vite';

export default defineConfig({
  base: '/console/', // Use your GitHub repository name here
  build: {
    outDir: 'dist', // Optional: Ensure output goes to the 'dist' folder
  },
});
