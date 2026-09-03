export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname.endsWith('.pages.dev')) {
    url.hostname = 'star-flower.net';
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 302);
  }

  return context.next();
}
