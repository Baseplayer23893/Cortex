const FAPI_BASE = process.env.CLERK_FAPI_URL;
const FAPI_HOST = new URL(FAPI_BASE).host;
const CLERK_COOKIE_RE = /^(__clerk|__session|__client)/;

function getBody(req) {
  return new Promise((resolve) => {
    if (req.method === 'GET' || req.method === 'HEAD') return resolve();
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => resolve(raw || undefined));
  });
}

module.exports = async (req, res) => {
  if (!FAPI_BASE) {
    return res.status(500).json({ error: 'CLERK_FAPI_URL is not set' });
  }

  const parsed = new URL(req.url, 'http://localhost');
  const subpath = parsed.searchParams.get('clerk_path') || '';
  const qp = new URLSearchParams(parsed.search);
  qp.delete('clerk_path');
  const qs = qp.toString();
  const url = new URL(subpath + (qs ? '?' + qs : ''), FAPI_BASE);

  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (['connection', 'forwarded', 'x-forwarded-host', 'content-length', 'transfer-encoding'].includes(key)) continue;
    headers[key] = Array.isArray(value) ? value.join(', ') : value;
  }

  headers['host'] = FAPI_HOST;
  headers['x-forwarded-proto'] = 'https';

  try {
    const body = await getBody(req);
    const response = await fetch(url.toString(), {
      method: req.method,
      headers,
      body,
    });

    for (const [key, value] of response.headers.entries()) {
      const lower = key.toLowerCase();
      if (['content-encoding', 'content-length', 'transfer-encoding'].includes(lower)) continue;
      if (lower === 'set-cookie') {
        const name = value.split('=')[0];
        if (/^(_cf|__cf)/.test(name)) continue;
        if (CLERK_COOKIE_RE.test(name)) {
          res.appendHeader(key, value.replace(/;\s*domain=[^;]+/gi, ''));
        } else {
          res.appendHeader(key, value);
        }
        continue;
      }
      res.setHeader(key, value);
    }

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    res.status(500).json({ error: 'Proxy error', message: err.message });
  }
};
