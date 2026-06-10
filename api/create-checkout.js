const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return res.status(503).json({ error: 'Payment system is not configured yet. Please try again later.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    const stripe = require('stripe')(stripeKey);
    const { items, customerEmail, orderSummary, shippingMethod, totals } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order.' });
    }

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.name,
          description: item.description || '',
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    const host = req.headers.host;
    const protocol = host.includes('localhost') ? 'http' : 'https';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail || undefined,
      success_url: `${protocol}://${host}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${protocol}://${host}/frame-my-photo.html?payment=cancelled`,
      shipping_address_collection: undefined,
      metadata: {
        order_summary: JSON.stringify(orderSummary).substring(0, 500),
        customer_phone: orderSummary?.customer?.phone || '',
        shipping_address: orderSummary?.shipping ? `${orderSummary.shipping.address}, ${orderSummary.shipping.city}, ${orderSummary.shipping.postcode}` : '',
      },
    });

    // Save order to Supabase
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const customer = orderSummary?.customer || {};
      const shipping = orderSummary?.shipping || {};

      await supabase.from('orders').insert({
        stripe_session_id: session.id,
        status: 'new',
        customer_email: customer.email || customerEmail || null,
        customer_phone: customer.phone || null,
        customer_first_name: customer.firstName || null,
        customer_last_name: customer.lastName || null,
        shipping_address: shipping.address || null,
        shipping_apt: shipping.apt || null,
        shipping_city: shipping.city || null,
        shipping_postcode: shipping.postcode || null,
        shipping_method: shippingMethod || 'standard',
        items: orderSummary?.items || [],
        subtotal: totals?.subtotal || 0,
        shipping_cost: totals?.shippingCost || 0,
        vat: totals?.vat || 0,
        total: totals?.total || 0,
      });
    }

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
