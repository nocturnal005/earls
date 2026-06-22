// Confirms whether a Stripe Checkout session was actually paid, so the success
// page can only claim "Order confirmed" for genuinely completed payments.

const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  const stripeKey = (process.env.STRIPE_SECRET_KEY || '').trim();
  if (!stripeKey) {
    return res.status(503).json({ error: 'Payment system is not configured.' });
  }

  const sessionId = req.query && req.query.session_id;
  if (!sessionId || typeof sessionId !== 'string' || !/^cs_(live|test)_[A-Za-z0-9]{40,}$/.test(sessionId)) {
    return res.status(400).json({ error: 'Missing or invalid session_id.' });
  }

  try {
    const stripe = require('stripe')(stripeKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === 'paid';

    // Reliable backstop to the webhook. As soon as the customer lands on the
    // success page for a genuinely paid session, make sure their order is
    // visible in admin even if the webhook misfired or the original insert
    // failed:
    //   - order exists as pending_payment -> flip to 'new'
    //   - detailed row under a broken session link -> re-link and flip it
    //   - no order row at all -> rebuild a minimal order from the Stripe session
    if (paid) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: existing, error: selErr } = await supabase
          .from('orders')
          .select('id, status')
          .eq('stripe_session_id', session.id)
          .limit(1);

        if (selErr) {
          console.error('[verify-session] lookup failed:', selErr.message);
        } else if (existing && existing.length) {
          // Order already saved — flip it visible if still pending.
          if (existing[0].status === 'pending_payment') {
            const { error: upErr } = await supabase
              .from('orders')
              .update({ status: 'new' })
              .eq('id', existing[0].id);
            if (upErr) console.error('[verify-session] flip failed:', upErr.message);
          }
        } else {
          // No row linked to THIS session id. The detailed order may still
          // exist in Supabase under a broken/different session link (e.g. two
          // checkout sessions were created for the same basket). Prefer
          // re-linking that detailed row over rebuilding a thin one, so we keep
          // the full framing detail (dims/mount/spec) Supabase holds.
          const total = (session.amount_total || 0) / 100;
          const email = session.customer_details?.email || session.customer_email || null;
          let match = supabase
            .from('orders')
            .select('id')
            .eq('status', 'pending_payment')
            .eq('total', total)
            .order('created_at', { ascending: false })
            .limit(1);
          if (email) match = match.eq('customer_email', email);
          const { data: detailed } = await match;

          if (detailed && detailed.length) {
            // Re-link to the paid session and make it visible — full detail kept.
            const { error: relinkErr } = await supabase
              .from('orders')
              .update({ status: 'new', stripe_session_id: session.id })
              .eq('id', detailed[0].id);
            if (relinkErr) console.error('[verify-session] relink failed:', relinkErr.message);
          } else {
            // Nothing in Supabase to combine — reconstruct a minimal order from
            // the paid Stripe session so it can never be silently lost. Item
            // framing detail isn't in Stripe, so we store names/qty/price only.
            const li = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
            const rows = (li && li.data) || [];
            const isDelivery = (name) => /delivery/i.test(name || '');

            const items = rows
              .filter((r) => !isDelivery(r.description))
              .map((r) => ({
                name: r.description || 'Framed Print',
                qty: r.quantity || 1,
                price: r.amount_total / 100 / (r.quantity || 1),
              }));
            const deliveryRow = rows.find((r) => isDelivery(r.description));
            const shippingCost = deliveryRow ? deliveryRow.amount_total / 100 : 0;
            const subtotal = Math.round((total - shippingCost) * 100) / 100;
            const vat = Math.round((total / 6) * 100) / 100;

            const fullName = session.customer_details?.name || '';
            const [firstName, ...rest] = fullName.split(' ');

            const { error: insErr } = await supabase.from('orders').insert({
              stripe_session_id: session.id,
              status: 'new',
              customer_email: session.customer_details?.email || session.customer_email || null,
              customer_phone: session.metadata?.customer_phone || null,
              customer_first_name: firstName || null,
              customer_last_name: rest.join(' ') || null,
              shipping_address: session.metadata?.shipping_address || null,
              shipping_method: session.metadata?.shipping_method || 'standard',
              items,
              subtotal,
              shipping_cost: shippingCost,
              vat,
              total,
            });
            if (insErr) console.error('[verify-session] rebuild insert failed:', insErr.message);
          }
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
