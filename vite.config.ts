
import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Create a properly typed async plugin loader function
async function loadComponentTagger(): Promise<Plugin> {
  if (process.env.NODE_ENV === 'development') {
    const module = await import('lovable-tagger');
    return module.componentTagger();
  }
  return {
    name: 'null-plugin',
    // Empty plugin for production
  };
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  // Load plugins based on environment
  const plugins = [react()];
  
  if (mode === 'development') {
    // Only load the tagger in development mode
    try {
      const tagger = await loadComponentTagger();
      plugins.push(tagger);
    } catch (e) {
      console.warn('Failed to load component tagger:', e);
    }
  }
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
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
  };
});
