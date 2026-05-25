const nodemailer = require('nodemailer');

const toEmail = process.env.TO_EMAIL || 'officialminiuphaarrr@gmail.com';

const sendJson = (res, statusCode, body) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendJson(res, 405, { message: 'Method not allowed.' });
    return;
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    sendJson(res, 500, {
      message: 'Email service is not configured. Add SMTP_USER and SMTP_PASS environment variables.',
    });
    return;
  }

  let data;

  try {
    data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    sendJson(res, 400, { message: 'Invalid request body.' });
    return;
  }

  const senderName = String(data?.senderName || '').trim();
  const senderEmail = String(data?.senderEmail || '').trim();
  const subject = String(data?.subject || 'Mini_Uphaarrr website inquiry').trim();
  const message = String(data?.message || '').trim();

  if (!senderName || !senderEmail || !message) {
    sendJson(res, 400, { message: 'Name, email, and message are required.' });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Mini_Uphaarrr Website" <${process.env.SMTP_USER}>`,
      replyTo: `"${senderName}" <${senderEmail}>`,
      to: toEmail,
      subject,
      text: message,
    });

    sendJson(res, 200, { ok: true });
  } catch (error) {
    sendJson(res, 500, {
      message: error.message || 'Failed to send email.',
    });
  }
};
