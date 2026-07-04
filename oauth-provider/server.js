// Minimal GitHub OAuth provider for the Decap CMS admin portal.
//
// Decap CMS's `github` backend opens a popup at GET /auth, expects it to
// redirect to GitHub, then land back on GET /callback, which must exchange
// the code for an access token and hand it back to the opener window via
// postMessage using the protocol below.
//
// Required environment variables:
//   GITHUB_CLIENT_ID
//   GITHUB_CLIENT_SECRET

const http = require('http');
const crypto = require('crypto');

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  PORT = 8080,
  SCOPES = 'repo,user',
} = process.env;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  console.error('Missing GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET environment variables.');
  process.exit(1);
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  return Object.fromEntries(
    header
      .split(';')
      .map(p => p.trim())
      .filter(Boolean)
      .map(p => {
        const idx = p.indexOf('=');
        return [p.slice(0, idx), decodeURIComponent(p.slice(idx + 1))];
      })
  );
}

function htmlResponse(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(body);
}

function renderSuccess(token) {
  const payload = JSON.stringify({ token, provider: 'github' });
  return `<!doctype html>
<html><body>
<script>
(function() {
  function receiveMessage(e) {
    window.opener.postMessage(
      'authorization:github:success:' + JSON.stringify(${payload}),
      e.origin
    );
    window.close();
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
</body></html>`;
}

function renderError(message) {
  const safeMessage = JSON.stringify(message);
  return `<!doctype html>
<html><body>
<script>
(function() {
  function receiveMessage(e) {
    window.opener.postMessage(
      'authorization:github:error:' + JSON.stringify({ message: ${safeMessage} }),
      e.origin
    );
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
<p>${message}</p>
</body></html>`;
}

function handleAuth(req, res, origin) {
  const state = crypto.randomBytes(16).toString('hex');
  const redirectUri = `${origin}/callback`;

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', SCOPES);
  authUrl.searchParams.set('state', state);

  res.writeHead(302, {
    'Set-Cookie': `oauth_state=${state}; HttpOnly; Path=/; Max-Age=600; SameSite=Lax`,
    Location: authUrl.toString(),
  });
  res.end();
}

async function handleCallback(req, res, url) {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookies = parseCookies(req);

  if (!code) {
    return htmlResponse(res, 400, renderError('Missing authorization code from GitHub.'));
  }
  if (!state || state !== cookies.oauth_state) {
    return htmlResponse(res, 400, renderError('Invalid or expired OAuth state. Please try logging in again.'));
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const data = await tokenRes.json();

    if (!data.access_token) {
      return htmlResponse(res, 400, renderError(data.error_description || 'GitHub did not return an access token.'));
    }

    return htmlResponse(res, 200, renderSuccess(data.access_token));
  } catch (err) {
    console.error('OAuth callback error:', err);
    return htmlResponse(res, 500, renderError('Unexpected error exchanging the authorization code.'));
  }
}

const server = http.createServer((req, res) => {
  const origin = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;
  const url = new URL(req.url, origin);

  if (url.pathname === '/auth') return handleAuth(req, res, origin);
  if (url.pathname === '/callback') return handleCallback(req, res, url);

  if (url.pathname === '/' || url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('Decap CMS GitHub OAuth provider is running.');
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => console.log(`OAuth provider listening on port ${PORT}`));
