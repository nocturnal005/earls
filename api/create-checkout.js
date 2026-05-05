module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return res.status(503).json({ error: 'Payment system is not configured yet. Please try again later.' });
  }

  try {
    const stripe = require('stripe')(stripeKey);
    const { items, customerEmail, orderSummary } = req.body;

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.name,
          description: item.description || ''
        },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: 1
    }));

    const host = req.headers.host;
    const protocol = host.includes('localhost') ? 'http' : 'https';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail || undefined,
      success_url: `${protocol}://${host}/frame-my-photo.html?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${protocol}://${host}/frame-my-photo.html?payment=cancelled`,
      metadata: {
        order_summary: JSON.stringify(orderSummary).substring(0, 500)
      }
    });

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
