
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// The componentTagger import is now conditional to avoid build issues
const componentTagger = process.env.NODE_ENV === 'development' 
  ? () => import('lovable-tagger').then(mod => mod.componentTagger())
  : null;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger,
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Ensure we have reasonable chunk sizes
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
}));
