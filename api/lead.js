// Serverless endpoint (Vercel) — receives the project brief form and emails it as a lead.
// Required env vars: GMAIL_USER, GMAIL_APP_PASSWORD. Optional: LEAD_TO (defaults to GMAIL_USER).
import nodemailer from 'nodemailer';

const LIMITS = { name: 120, email: 200, company: 160, timeline: 120, type: 80, budget: 40, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 20000) throw new Error('Payload too large');
  }
  return JSON.parse(raw || '{}');
}

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function clean(body) {
  const out = {};
  for (const [key, max] of Object.entries(LIMITS)) {
    out[key] = String(body[key] ?? '').trim().slice(0, max);
  }
  return out;
}

function renderHtml(lead, receivedAt) {
  const row = (label, value) => `
          <tr>
            <td style="padding:14px 0;border-bottom:1px solid #ececec;width:38%;vertical-align:top;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8a8a8a;">${label}</td>
            <td style="padding:14px 0;border-bottom:1px solid #ececec;vertical-align:top;font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#121414;">${value || '<span style="color:#b5b5b5;">Not provided</span>'}</td>
          </tr>`;

  const e = Object.fromEntries(Object.entries(lead).map(([k, v]) => [k, escapeHtml(v)]));
  const message = e.message ? e.message.replace(/\n/g, '<br/>') : '<span style="color:#b5b5b5;">No overview provided.</span>';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>New project inquiry</title></head>
<body style="margin:0;padding:0;background:#f2f2f0;">
  <div style="display:none;max-height:0;overflow:hidden;">New brief from ${e.name}${e.company ? ' · ' + e.company : ''} — ${e.type || 'Project inquiry'}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f0;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e4e4e2;">
        <!-- Header -->
        <tr><td style="background:#121414;padding:28px 36px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="font-family:Helvetica,Arial,sans-serif;font-size:22px;font-weight:800;letter-spacing:4px;color:#ffffff;">CREOVIA<span style="color:#656aff;">.</span></td>
            <td align="right" style="font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:1.5px;color:#9a9a9a;text-transform:uppercase;">New Lead</td>
          </tr></table>
        </td></tr>
        <tr><td style="height:4px;background:#656aff;font-size:0;line-height:0;">&nbsp;</td></tr>
        <!-- Intro -->
        <tr><td style="padding:36px 36px 8px;">
          <p style="margin:0 0 8px;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#656aff;">Project Brief Received</p>
          <h1 style="margin:0 0 10px;font-family:Helvetica,Arial,sans-serif;font-size:26px;line-height:1.25;color:#121414;">${e.name}${e.company ? ` <span style="color:#8a8a8a;font-weight:400;">/ ${e.company}</span>` : ''}</h1>
          <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#5a5a5a;">Submitted through the website inquiry form on ${escapeHtml(receivedAt)}.</p>
        </td></tr>
        <!-- Details -->
        <tr><td style="padding:16px 36px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row('Name', e.name)}
            ${row('Email', `<a href="mailto:${e.email}" style="color:#656aff;text-decoration:none;">${e.email}</a>`)}
            ${row('Organization / Brand', e.company)}
            ${row('Project Type', e.type)}
            ${row('Budget (USD)', e.budget)}
            ${row('Launch Timeline', e.timeline)}
          </table>
        </td></tr>
        <!-- Message -->
        <tr><td style="padding:20px 36px 8px;">
          <p style="margin:0 0 10px;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8a8a8a;">Project Overview &amp; Core Vision</p>
          <div style="background:#f7f7f5;border-left:3px solid #656aff;padding:18px 20px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#121414;">${message}</div>
        </td></tr>
        <!-- CTA -->
        <tr><td style="padding:28px 36px 36px;">
          <a href="mailto:${e.email}?subject=${encodeURIComponent('Re: Your project brief — Creovia')}" style="display:inline-block;background:#121414;color:#ffffff;font-family:'Courier New',Courier,monospace;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:14px 26px;">Reply to ${e.name.split(' ')[0] || 'client'} &rarr;</a>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:20px 36px;border-top:1px solid #ececec;background:#fafaf9;font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#a0a0a0;">
          Creovia &middot; Website lead notification &middot; Replying to this email goes straight to the client
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function renderText(lead, receivedAt) {
  return [
    'NEW PROJECT BRIEF — CREOVIA',
    `Received: ${receivedAt}`,
    '',
    `Name:        ${lead.name}`,
    `Email:       ${lead.email}`,
    `Company:     ${lead.company || '—'}`,
    `Project:     ${lead.type || '—'}`,
    `Budget:      ${lead.budget || '—'}`,
    `Timeline:    ${lead.timeline || '—'}`,
    '',
    'Project overview:',
    lead.message || '—',
  ].join('\n');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { ok: false, error: 'Method not allowed' });
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    return send(res, 400, { ok: false, error: 'Invalid request' });
  }

  // Honeypot: real visitors never fill this hidden field
  if (body.website) return send(res, 200, { ok: true });

  const lead = clean(body);
  if (!lead.name || !EMAIL_RE.test(lead.email)) {
    return send(res, 422, { ok: false, error: 'Please provide your name and a valid email.' });
  }

  const { GMAIL_USER, GMAIL_APP_PASSWORD, LEAD_TO } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error('lead: GMAIL_USER / GMAIL_APP_PASSWORD not configured');
    return send(res, 500, { ok: false, error: 'Could not send your brief right now.' });
  }

  const receivedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short',
  }) + ' IST';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: `"Creovia Website" <${GMAIL_USER}>`,
      to: LEAD_TO || GMAIL_USER,
      replyTo: `"${lead.name.replace(/"/g, '')}" <${lead.email}>`,
      subject: `New project brief — ${lead.name}${lead.company ? ` (${lead.company})` : ''}`,
      text: renderText(lead, receivedAt),
      html: renderHtml(lead, receivedAt),
    });
    return send(res, 200, { ok: true });
  } catch (err) {
    console.error('lead: send failed', err);
    return send(res, 502, { ok: false, error: 'Could not send your brief right now.' });
  }
}
