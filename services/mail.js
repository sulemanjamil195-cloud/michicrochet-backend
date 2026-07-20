const nodemailer = require('nodemailer');

function getTransport() {
    const host = process.env.SMTP_HOST;
    if (!host) {
        return null;
    }
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;
    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth:
            process.env.SMTP_USER && process.env.SMTP_PASS
                ? {
                      user: process.env.SMTP_USER,
                      pass: process.env.SMTP_PASS
                  }
                : undefined
    });
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/**
 * @param {{ to: string; subject: string; text: string; html?: string }} opts
 */
async function sendMail(opts) {
    const transport = getTransport();
    if (!transport) {
        throw new Error(
            'SMTP is not configured. Set SMTP_HOST (and typically SMTP_USER, SMTP_PASS, MAIL_FROM).'
        );
    }
    const from = process.env.MAIL_FROM || process.env.SMTP_USER;
    if (!from) {
        throw new Error('Set MAIL_FROM or SMTP_USER as the sender address.');
    }
    const html =
        opts.html ||
        `<p>${escapeHtml(opts.text).replace(/\n/g, '<br>')}</p>`;
    await transport.sendMail({
        from,
        to: opts.to,
        subject: opts.subject,
        text: opts.text,
        html
    });
}

module.exports = { getTransport, sendMail, escapeHtml };
