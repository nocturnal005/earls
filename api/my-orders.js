// Returns the logged-in customer's own orders. The customer's Supabase JWT is
// verified server-side, then orders are filtered to their email only — so a
// customer can never see anyone else's orders. Mirrors the admin endpoint
// pattern but scoped strictly to self.
const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return res.status(503).json({ error: 'Database not configured.' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const token = authHeader.split(' ')[1];

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user || !user.email) {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }

  // Only this customer's orders, and never incomplete (pending_payment) ones.
  const { data, error } = await supabase
    .from('orders')
    .select('id, created_at, items, status, total, shipping_method')
    .eq('customer_email', user.email)
    .neq('status', 'pending_payment')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
};
