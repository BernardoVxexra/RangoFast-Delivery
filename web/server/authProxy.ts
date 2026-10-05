// Repasse de login reusado em dois lugares: pelo plugin de dev do Vite
// (vite.config.ts) e pelo servidor de produção (server/index.ts). Existir
// como função pura, baseada em Request/Response padrão Web, evita ter duas
// implementações do mesmo repasse de cookie que podem divergir.
const AUTH_API_URL = process.env.AUTH_API_URL || 'https://login-p26w.onrender.com/fatec/login/v1';

export async function forwardToAuthApi(request: Request, path: string): Promise<Response> {
  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  const cookie = request.headers.get('cookie');
  if (contentType) headers.set('content-type', contentType);
  if (cookie) headers.set('cookie', cookie);

  const body = await request.text();

  try {
    const upstream = await fetch(`${AUTH_API_URL}${path}`, {
      method: request.method,
      headers,
      body: body || undefined,
    });

    const responseHeaders = new Headers();
    const upstreamType = upstream.headers.get('content-type');
    if (upstreamType) responseHeaders.set('content-type', upstreamType);
    // Repassa o cookie da sessão para o navegador. A API não define Domain
    // no Set-Cookie, então o cookie fica automaticamente associado a
    // qualquer host que o navegador tenha chamado direto (localhost em dev,
    // o domínio de produção depois do deploy) — sem reescrever nada.
    for (const setCookie of upstream.headers.getSetCookie()) {
      responseHeaders.append('set-cookie', setCookie);
    }

    return new Response(await upstream.arrayBuffer(), {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json({ message: 'API de login indisponível.' }, { status: 502 });
  }
}
