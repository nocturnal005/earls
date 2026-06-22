const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(503).json({ error: 'Database not configured.' });
  }

  // Verify auth token
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

  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: 'Missing id or status.' });
  }

  const allowed = ['new', 'in_progress', 'completed', 'shipped', 'archived', 'refunded'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select();

  if (error) {
    console.error('update-order: status update failed:', error.message);
    return res.status(500).json({ error: 'Could not update the order.' });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  return res.status(200).json(data[0]);
};
