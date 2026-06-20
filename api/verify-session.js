// Confirms whether a Stripe Checkout session was actually paid, so the success
// page can only claim "Order confirmed" for genuinely completed payments.

const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  const stripeKey = (process.env.STRIPE_SECRET_KEY || '').trim();
  if (!stripeKey) {
    return res.status(503).json({ error: 'Payment system is not configured.' });
  }

  const sessionId = req.query && req.query.session_id;
  if (!sessionId || typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
    return res.status(400).json({ error: 'Missing or invalid session_id.' });
  }

  try {
    const stripe = require('stripe')(stripeKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === 'paid';

    // Reliable backstop to the webhook: as soon as the customer lands on the
    // success page for a genuinely paid session, flip their order to 'new' so
    // it appears in the admin even if the Stripe webhook misfired. Matching on
    // status keeps this idempotent with the webhook.
    if (paid) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase
          .from('orders')
          .update({ status: 'new' })
          .eq('stripe_session_id', session.id)
          .eq('status', 'pending_payment')
          .select('id, status');
        if (error) {
          console.error('verify-session: failed to flip order:', error.message);
        } else {
          console.log('[verify-session] session', session.id, '— rows flipped:', data ? data.length : 0);
        }
      }
    }

    return res.status(200).json({
      paid,
      shippingMethod: session.metadata?.shipping_method || null,
    });
  } catch (err) {
    console.error('verify-session error:', err.message);
    return res.status(500).json({ error: 'Could not verify session.' });
  }
};
