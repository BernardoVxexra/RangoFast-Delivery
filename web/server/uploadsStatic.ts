// Serve os arquivos salvos por photoStorage.ts em /uploads/<arquivo>.
// Middleware no formato connect (req, res, next), compatível tanto com o
// plugin de dev do Vite quanto com o Express do servidor de produção.
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

const MIME_BY_EXTENSION: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

export function serveUploads(uploadsDir: string) {
  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const requestedPath = (req.url ?? '').split('?')[0];
    const filename = path.basename(requestedPath);
    const filePath = path.join(uploadsDir, filename);

    if (filename !== requestedPath.replace(/^\/+/, '')) {
      res.statusCode = 400;
      res.end();
      return;
    }

    try {
      await stat(filePath);
    } catch {
      next();
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    res.setHeader('Content-Type', MIME_BY_EXTENSION[extension] ?? 'application/octet-stream');
    // Evita que o navegador tente "adivinhar" o tipo real do arquivo a
    // partir do conteúdo — relevante porque o conteúdo vem de upload do
    // usuário.
    res.setHeader('X-Content-Type-Options', 'nosniff');
    createReadStream(filePath).pipe(res);
  };
}
