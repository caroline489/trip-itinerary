export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/trip-todo') {
      // 没有登入系统——有网址的人都能读写这份待办状态，这是免帐号的取舍
      if (request.method === 'GET') {
        const value = await env.TRIP_KV.get('trip-todo-state');
        return new Response(value || '{}', {
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'no-store'
          }
        });
      }

      if (request.method === 'PUT' || request.method === 'POST') {
        const body = await request.text();
        try {
          JSON.parse(body);
        } catch {
          return new Response('Invalid JSON', { status: 400 });
        }
        await env.TRIP_KV.put('trip-todo-state', body);
        return new Response(JSON.stringify({ ok: true }), {
          headers: { 'content-type': 'application/json; charset=utf-8' }
        });
      }

      return new Response('Method not allowed', { status: 405 });
    }

    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) return assetResponse;
    return env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request));
  }
};
