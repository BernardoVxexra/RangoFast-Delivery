import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { forwardToAuthApi } from './server/authProxy.js'

// Substitui o proxy padrão do Vite (http-proxy-middleware) por um
// middleware próprio que reusa a mesma função de produção
// (server/authProxy.ts) — uma única implementação entende "remove
// Origin/Referer, repassa Set-Cookie", em vez de duas que podem divergir.
function authProxyPlugin(): Plugin {
  return {
    name: 'rangofast-auth-proxy',
    configureServer(server) {
      // server.middlewares é uma instância do connect: montar em '/api'
      // já remove esse prefixo de req.url dentro do handler.
      server.middlewares.use('/api', async (req, res) => {
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const body = Buffer.concat(chunks);

        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers) as [string, string | string[] | undefined][]) {
          if (typeof value === 'string') headers.set(key, value);
          else if (Array.isArray(value)) headers.set(key, value.join(', '));
        }

        const method = req.method ?? 'POST';
        const hasBody = method !== 'GET' && method !== 'HEAD' && body.length > 0;

        const request = new Request(`http://localhost${req.url}`, {
          method,
          headers,
          body: hasBody ? body : undefined,
        });

        const response = await forwardToAuthApi(request, req.url ?? '/');

        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        res.end(Buffer.from(await response.arrayBuffer()));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), authProxyPlugin()],
})
