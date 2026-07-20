const checkoutRepository = require('../repositories/checkoutRepository');
const { getStripe } = require('./stripe');

function badRequest(message) {
    const err = new Error(message);
    err.status = 400;
    return err;
}

function notFound(message = 'Order not found') {
    const err = new Error(message);
    err.status = 404;
    return err;
}

function forbidden(message = 'Forbidden') {
    const err = new Error(message);
    err.status = 403;
    return err;
}

/** Verifies the Stripe signature, then confirms the matching order if payment succeeded. */
async function handleStripeWebhook(rawBody, signature) {
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripe || !webhookSecret) {
        const err = new Error('Stripe webhook is not configured');
        err.status = 500;
        throw err;
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
        err.status = 400;
        err.message = `Webhook Error: ${err.message}`;
        throw err;
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        if (orderId) {
            const order = await checkoutRepository.findById(orderId);
            if (order && order.status === 'pending') {
                const paymentRef =
                    typeof session.payment_intent === 'string'
                        ? session.payment_intent
                        : session.payment_intent?.id ?? session.id;
                await checkoutRepository.markConfirmed(orderId, paymentRef);
            }
        }
    }

    return { received: true };
}

async function createCheckoutSession(userId, { orderId, successUrl, cancelUrl }) {
    if (!process.env.STRIPE_SECRET_KEY) {
        const err = new Error('Stripe is not configured');
        err.status = 503;
        throw err;
    }

    const parsedOrderId = Number(orderId);
    if (!Number.isInteger(parsedOrderId) || parsedOrderId < 1) {
        throw badRequest('orderId must be a positive integer');
    }

    const frontend = process.env.FRONTEND_URL;
    if (!successUrl && !frontend) {
        throw badRequest('Provide successUrl or set FRONTEND_URL for default redirect URLs');
    }

    const order = await checkoutRepository.findById(parsedOrderId);
    if (!order) throw notFound();
    if (order.userId !== userId) throw forbidden();
    if (order.status !== 'pending') throw badRequest('Order is not payable in its current state');

    const amountCents = Math.round(Number(order.totalPrice) * 100);
    if (!Number.isFinite(amountCents) || amountCents < 50) {
        throw badRequest('Order total is invalid for checkout');
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: (process.env.STRIPE_CURRENCY || 'usd').toLowerCase(),
                    unit_amount: amountCents,
                    product_data: { name: `Order #${order.id}` },
                },
                quantity: 1,
            },
        ],
        success_url:
            successUrl || `${frontend.replace(/\/$/, '')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${frontend.replace(/\/$/, '')}/checkout/cancel`,
        metadata: { orderId: String(order.id), userId: String(order.userId) },
    });

    return { url: session.url, sessionId: session.id };
}

module.exports = { handleStripeWebhook, createCheckoutSession };
