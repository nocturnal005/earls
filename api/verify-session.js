// Confirms whether a Stripe Checkout session was actually paid, so the success
// page can only claim "Order confirmed" for genuinely completed payments.

module.exports = async (req, res) => {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
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
    return res.status(200).json({
      paid,
      shippingMethod: session.metadata?.shipping_method || null,
    });
  } catch (err) {
    console.error('verify-session error:', err.message);
    return res.status(500).json({ error: 'Could not verify session.' });
  }
};
