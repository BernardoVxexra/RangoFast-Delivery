import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { forwardToAuthApi } from './authProxy';
import { handleDeliveryPhotoUpload, uploadsDir } from './photoStorage';
import { serveUploads } from './uploadsStatic';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');
const PORT = Number(process.env.PORT) || 4173;

const app = express();

app.use('/uploads', serveUploads(uploadsDir));

app.use('/api', express.raw({ type: '*/*' }), async (req, res) => {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') headers.set(key, value);
    else if (Array.isArray(value)) headers.set(key, value.join(', '));
  }

  const method = req.method ?? 'POST';
  const hasBody = method !== 'GET' && method !== 'HEAD' && Buffer.isBuffer(req.body) && req.body.length > 0;

  const request = new Request(`http://localhost${req.url}`, {
    method,
    headers,
    body: hasBody ? req.body : undefined,
  });

  const response =
    req.url === '/delivery-photos'
      ? await handleDeliveryPhotoUpload(request)
      : await forwardToAuthApi(request, req.url);

  res.status(response.status);
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.send(Buffer.from(await response.arrayBuffer()));
});

app.use(express.static(distDir));
app.get('/*splat', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`RangoFast Web em produção na porta ${PORT}`);
});
