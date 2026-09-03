const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });

export async function onRequestGet({ env }) {
  return json({ siteKey: env.TURNSTILE_SITE_KEY || '0x4AAAAAAEYbI0p4ZAzLFo_C' });
}

export async function onRequest() {
  return json({ message: 'Method Not Allowed' }, 405);
}
