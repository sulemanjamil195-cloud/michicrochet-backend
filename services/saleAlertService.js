const validator = require('validator');
const saleAlertRepository = require('../repositories/saleAlertRepository');
const { sendMail } = require('./mail');

function badRequest(message) {
    const err = new Error(message);
    err.status = 400;
    return err;
}

function notFound(message = 'Not found') {
    const err = new Error(message);
    err.status = 404;
    return err;
}

async function subscribe(rawEmail) {
    if (!rawEmail || !validator.isEmail(String(rawEmail).trim())) {
        throw badRequest('A valid email is required');
    }
    const email = String(rawEmail).trim().toLowerCase();
    const [subscriber, created] = await saleAlertRepository.findOrCreateByEmail(email);
    return {
        status: created ? 201 : 200,
        message: created ? 'Subscribed to sale alerts' : 'Already subscribed',
        subscriber,
    };
}

async function getSubscribers() {
    return saleAlertRepository.findAll();
}

async function getSubscriberById(id) {
    const subscriber = await saleAlertRepository.findById(id);
    if (!subscriber) throw notFound();
    return subscriber;
}

async function updateSubscriber(id, email) {
    if (email !== undefined && !validator.isEmail(String(email).trim())) {
        throw badRequest('Invalid email');
    }
    try {
        const updated = await saleAlertRepository.updateById(
            id,
            email !== undefined ? { email: String(email).trim().toLowerCase() } : {}
        );
        if (!updated) throw notFound();
        return updated;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            const conflict = new Error('That email is already subscribed');
            conflict.status = 409;
            throw conflict;
        }
        throw error;
    }
}

async function deleteSubscriber(id) {
    const deleted = await saleAlertRepository.deleteById(id);
    if (!deleted) throw notFound();
}

async function notifySale({ subject, message, html }) {
    const finalSubject = (subject && String(subject).trim()) || 'Sale — Michicrochet';
    const finalMessage = (message && String(message).trim()) || 'We are running a sale! Visit the shop to see the deals.';
    const htmlOverride = html && String(html).trim() ? String(html).trim() : undefined;

    const rows = await saleAlertRepository.findAllEmails();
    const emails = [...new Set(rows.map((r) => r.email).filter(Boolean))];

    if (emails.length === 0) {
        return { message: 'No subscribers to notify', sent: 0, total: 0, failed: [] };
    }

    const failed = [];
    let sent = 0;
    for (const to of emails) {
        try {
            await sendMail({ to, subject: finalSubject, text: finalMessage, html: htmlOverride });
            sent += 1;
        } catch (err) {
            failed.push({ email: to, error: err.message || 'Send failed' });
        }
    }

    return { message: `Sent ${sent} of ${emails.length} notifications`, sent, total: emails.length, failed };
}

module.exports = {
    subscribe,
    getSubscribers,
    getSubscriberById,
    updateSubscriber,
    deleteSubscriber,
    notifySale,
};
