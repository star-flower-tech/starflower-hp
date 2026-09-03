const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });

const clean = (value, max = 2000) =>
  String(value || '')
    .replace(/\r/g, '')
    .trim()
    .slice(0, max);

async function handlePost(request, env) {
  if (!env.TURNSTILE_SECRET_KEY || !env.GOOGLE_APPS_SCRIPT_URL) {
    return json({ ok: false, message: '送信設定が未完了です。' }, 500);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, message: '送信内容を確認してください。' }, 400);
  }

  const token = clean(payload.turnstileToken, 4096);
  if (!token) {
    return json({ ok: false, message: '迷惑送信対策の確認に失敗しました。' }, 400);
  }

  const verifyForm = new FormData();
  verifyForm.append('secret', env.TURNSTILE_SECRET_KEY);
  verifyForm.append('response', token);
  verifyForm.append('remoteip', request.headers.get('CF-Connecting-IP') || '');

  const verifyResponse = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    body: verifyForm,
  });
  const verifyResult = await verifyResponse.json();

  if (!verifyResult.success) {
    return json({ ok: false, message: '迷惑送信対策の確認に失敗しました。' }, 400);
  }

  const inquiry = {
    submittedAt: new Date().toISOString(),
    name: clean(payload.name, 120),
    company: clean(payload.company, 160),
    email: clean(payload.email, 240),
    phone: clean(payload.phone, 80),
    category: clean(payload.category, 120),
    budget: clean(payload.budget, 120),
    timing: clean(payload.timing, 120),
    message: clean(payload.message, 4000),
    source: 'star-flower.net',
  };

  if (!inquiry.name || !inquiry.email || !inquiry.message) {
    return json({ ok: false, message: '必須項目を入力してください。' }, 400);
  }

  const saveResponse = await fetch(env.GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(inquiry),
  });

  if (!saveResponse.ok) {
    return json({ ok: false, message: '送信に失敗しました。時間をおいて再度お試しください。' }, 502);
  }

  return json({ ok: true, message: 'お問い合わせを送信しました。確認後にご連絡します。' });
}

export async function onRequest({ request, env }) {
  if (request.method === 'POST') {
    return handlePost(request, env);
  }

  return json({ ok: false, message: 'Method Not Allowed' }, 405);
}
