import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import tailwindcss from '@tailwindcss/vite'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(),tailwindcss(),],
    resolve: {
        alias: {
            "@": resolve(__dirname, "src")
        }
    },
    server:{
        port: 80,
        proxy:{
            '/api': {
                target: 'http://192.168.110.3:6002',
                changeOrigin: true,//是否跨域
                rewrite: (p) => p.replace(/^\/api/, '/api')//重写路径
            }
        }
    }
})
