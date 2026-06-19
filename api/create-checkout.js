const { createClient } = require('@supabase/supabase-js');
const { priceOrder } = require('./_pricing');

function clampStr(v, max) {
  return (typeof v === 'string' ? v : '').slice(0, max);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Trim to tolerate stray whitespace/newlines from pasting the key into env vars
  // (a trailing newline corrupts the Authorization header -> StripeConnectionError).
  const stripeKey = (process.env.STRIPE_SECRET_KEY || '').trim();
  if (!stripeKey) {
    return res.status(503).json({ error: 'Payment system is not configured yet. Please try again later.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const webhookConfigured = !!process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const stripe = require('stripe')(stripeKey);
    const { lines, customerEmail, customer, shipping, shippingMethod } = req.body || {};

    if (!Array.isArray(lines) || lines.length === 0) {
      return res.status(400).json({ error: 'No items in order.' });
    }

    // Authoritative server-side pricing. Client-supplied prices are ignored.
    const priced = priceOrder(lines, shippingMethod);
    if (priced.error) {
      return res.status(400).json({ error: priced.error });
    }

    const lineItems = lines.map((item, idx) => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: clampStr(item.name, 200) || 'Framed Print',
          description: clampStr(item.description, 300) || undefined,
        },
        unit_amount: Math.round(priced.lines[idx].unit * 100),
      },
      quantity: priced.lines[idx].qty,
    }));

    // Delivery as its own line. Item prices and delivery are VAT-inclusive,
    // so there is no separate VAT line (VAT is contained within the totals).
    lineItems.push({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: shippingMethod === 'express' ? 'Express Delivery' : 'Standard Delivery',
          description: shippingMethod === 'express' ? '3-5 working days' : '10-12 working days',
        },
        unit_amount: Math.round(priced.delivery * 100),
      },
      quantity: 1,
    });

    const host = req.headers.host;
    const protocol = host.includes('localhost') ? 'http' : 'https';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail || undefined,
      success_url: `${protocol}://${host}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${protocol}://${host}/frame-my-photo.html?payment=cancelled`,
      metadata: {
        customer_phone: customer?.phone || '',
        shipping_address: shipping ? `${shipping.address || ''}, ${shipping.city || ''}, ${shipping.postcode || ''}` : '',
        shipping_method: shippingMethod || 'standard',
        order_total: String(priced.total),
      },
    });

    // Persist the order. Prices come from the server-side calc, not the client.
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const cust = customer || {};
      const ship = shipping || {};

      const items = lines.map((item, idx) => ({
        name: clampStr(item.name, 200),
        dims: item.dims || null,
        mount: item.mount || null,
        qty: priced.lines[idx].qty,
        price: priced.lines[idx].unit,
        spec: item.spec || null,
      }));

      // When the Stripe webhook is configured (production), save as
      // 'pending_payment' so api/stripe-webhook.js can confirm it to 'new' only
      // after payment — abandoned/failed checkouts never reach the framer's
      // queue. When it is NOT configured (testing), save directly as 'new' so
      // orders show immediately without a webhook. This switches automatically
      // the moment STRIPE_WEBHOOK_SECRET is set in the environment.
      await supabase.from('orders').insert({
        stripe_session_id: session.id,
        status: webhookConfigured ? 'pending_payment' : 'new',
        customer_email: cust.email || customerEmail || null,
        customer_phone: cust.phone || null,
        customer_first_name: cust.firstName || null,
        customer_last_name: cust.lastName || null,
        shipping_address: ship.address || null,
        shipping_apt: ship.apt || null,
        shipping_city: ship.city || null,
        shipping_postcode: ship.postcode || null,
        shipping_method: shippingMethod || 'standard',
        items,
        subtotal: priced.subtotal,
        shipping_cost: priced.delivery,
        vat: priced.vat,
        total: priced.total,
      });
    }

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (err) {
    // Capture the precise cause (auth vs connection vs request, plus the
    // underlying network error) instead of the generic Stripe message.
    console.error('Stripe checkout error:', JSON.stringify({
      message: err && err.message,
      type: err && err.type,
      code: err && err.code,
      statusCode: err && err.statusCode,
      detail: err && err.detail && (err.detail.message || err.detail.code || String(err.detail)),
    }));
    res.status(500).json({ error: 'We couldn’t start the payment. Please try again in a moment.' });
  }
};
