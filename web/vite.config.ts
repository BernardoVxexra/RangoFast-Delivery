import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// A API do guia não envia cabeçalhos CORS, então o navegador bloqueia a
// chamada direta. O proxy abaixo faz a requisição a partir do processo Node
// do Vite (sem restrição de CORS) e repassa a resposta ao navegador como se
// fosse a própria origem — solução válida apenas para desenvolvimento.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://login-p26w.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/fatec/login/v1'),
        cookieDomainRewrite: 'localhost',
        // O backend rejeita (403) qualquer Origin que não reconheça.
        // Como o proxy já contorna o CORS do navegador, repassamos a
        // requisição sem esses headers, como um cliente não-browser faria.
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });
        },
      },
    },
  },
})
