const { createClient } = require('@supabase/supabase-js');

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(typeof c === 'string' ? Buffer.from(c) : c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    console.error('Webhook not configured: missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET');
    return res.status(503).json({ error: 'Webhook not configured.' });
  }

  const stripe = require('stripe')(stripeKey);

  let event;
  try {
    const rawBody = await readRawBody(req);
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Only mark paid sessions as live orders.
    if (session.payment_status === 'paid') {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        // Flip the pending order to 'new'. Matching on status keeps this
        // idempotent if Stripe redelivers the event.
        const { error } = await supabase
          .from('orders')
          .update({ status: 'new' })
          .eq('stripe_session_id', session.id)
          .eq('status', 'pending_payment');
        if (error) {
          console.error('Failed to mark order paid:', error.message);
          return res.status(500).json({ error: 'Failed to update order.' });
        }
      }
    }
  }

  // Acknowledge receipt so Stripe stops retrying.
  res.status(200).json({ received: true });
};

// Stripe signature verification needs the raw, unparsed request body.
// Must be set AFTER the handler assignment above (which replaces module.exports).
module.exports.config = { api: { bodyParser: false } };
