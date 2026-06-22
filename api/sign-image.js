// Returns a short-lived signed URL for an order image in the (private)
// order-images bucket. Admin-only: the caller's Supabase JWT is verified and
// checked against ADMIN_EMAIL, then the URL is minted with the service role.
// This lets the admin view customer photos without the bucket being public.
const { createClient } = require('@supabase/supabase-js');

const BUCKET = 'order-images';
const EXPIRES_SECONDS = 300; // 5 minutes — long enough to view, short enough to be safe

// Accept either a bare storage path or a full stored URL, and reduce it to the
// object path. Only the two expected prefixes are allowed, and any traversal is
// rejected.
function normalizePath(input) {
  let v = String(input == null ? '' : input).trim();
  if (!v) return null;
  const marker = '/order-images/';
  const idx = v.indexOf(marker);
  if (idx !== -1) v = v.slice(idx + marker.length);
  v = v.replace(/^\/+/, '');
  if (v.includes('..')) return null;
  if (!/^(previews|originals)\/[A-Za-z0-9._\-\/]+$/.test(v)) return null;
  return v;
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return res.status(503).json({ error: 'Storage not configured.' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const token = authHeader.split(' ')[1];

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || user.email !== adminEmail) {
    return res.status(403).json({ error: 'Access denied.' });
  }

  const path = normalizePath(req.query && req.query.path);
  if (!path) {
    return res.status(400).json({ error: 'Invalid image path.' });
  }

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, EXPIRES_SECONDS);

  if (error || !data || !data.signedUrl) {
    console.error('sign-image: createSignedUrl failed:', error && error.message);
    return res.status(404).json({ error: 'Image not available.' });
  }

  return res.status(200).json({ url: data.signedUrl });
};
