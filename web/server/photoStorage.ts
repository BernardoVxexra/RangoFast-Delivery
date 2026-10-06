// Salva o comprovante de entrega em disco em vez de embutir o base64 no
// pedido mockado (localStorage ficaria enorme). Reusado pelo plugin de dev
// do Vite (vite.config.ts) e pelo servidor de produção (server/index.ts),
// mesmo padrão de authProxy.ts.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDir = path.resolve(__dirname, 'uploads');

const DATA_URI_PATTERN = /^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

// Confere a assinatura real dos bytes, não só o que o cliente declarou no
// content-type da data URI (um client malicioso pode mentir a extensão).
function matchesImageSignature(extension: string, buffer: Buffer): boolean {
  if (extension === 'jpeg' || extension === 'jpg') {
    return buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
  }
  if (extension === 'png') {
    return buffer
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (extension === 'webp') {
    return (
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP'
    );
  }
  return false;
}

function sanitizeCode(code: string): string {
  const safe = code.replace(/[^a-zA-Z0-9-]/g, '');
  return safe || 'pedido';
}

// O backend de login (docs/GUIA_TECNICO.md) não expõe endpoint de validação
// de sessão nem logout, então só dá para checar a PRESENÇA do cookie de
// sessão (`access_token`, HttpOnly) — não sua validade. Ainda assim fecha o
// endpoint para quem nunca passou pelo login real, em vez de ficar 100%
// aberto. Checar se o usuário autenticado é quem está de fato entregando o
// pedido exigiria um backend de pedidos real, que não existe neste projeto
// (os pedidos vivem só no localStorage/AsyncStorage do cliente).
function hasSessionCookie(request: Request): boolean {
  const cookie = request.headers.get('cookie') ?? '';
  return /(?:^|;\s*)access_token=/.test(cookie);
}

export async function saveDeliveryPhoto(code: string, dataUri: string): Promise<string> {
  const match = DATA_URI_PATTERN.exec(dataUri);
  if (!match) {
    throw new Error('Formato de imagem inválido.');
  }
  const [, extension, base64] = match;
  const buffer = Buffer.from(base64, 'base64');

  if (buffer.length === 0 || buffer.length > MAX_PHOTO_BYTES) {
    throw new Error('Tamanho de imagem inválido.');
  }
  if (!matchesImageSignature(extension, buffer)) {
    throw new Error('Conteúdo não corresponde a uma imagem válida.');
  }

  await mkdir(uploadsDir, { recursive: true });
  const filename = `${sanitizeCode(code)}-${Date.now()}.${extension}`;
  await writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function handleDeliveryPhotoUpload(request: Request): Promise<Response> {
  if (!hasSessionCookie(request)) {
    return Response.json({ message: 'Não autenticado.' }, { status: 401 });
  }
  try {
    const payload = (await request.json()) as { code?: unknown; dataUri?: unknown };
    if (typeof payload.code !== 'string' || typeof payload.dataUri !== 'string') {
      return Response.json({ message: 'Dados inválidos.' }, { status: 400 });
    }
    const url = await saveDeliveryPhoto(payload.code, payload.dataUri);
    return Response.json({ url });
  } catch {
    return Response.json({ message: 'Não foi possível salvar a foto.' }, { status: 400 });
  }
}
