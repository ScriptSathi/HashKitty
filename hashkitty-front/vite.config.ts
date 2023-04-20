import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig( {
   plugins: [svgr(), react(), splitVendorChunkPlugin()],
   build: {
      rollupOptions: {
         output: {
            manualChunks: {
               '@mui/material': ['@mui/material'],
            }
         }
      }
   },
})
