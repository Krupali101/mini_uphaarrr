export const sendEmailViaHorizons = async (emailData) => {
  const recipient = emailData.recipientEmail;
  const subject = emailData.subject || 'Mini_Uphaarrr inquiry';
  const body = emailData.body || '';

  if (!recipient) {
    throw new Error('Recipient email address is missing.');
  }

  const response = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: emailData.senderName || 'Website visitor',
      email: emailData.senderEmail,
      _replyto: emailData.senderEmail,
      _subject: subject,
      message: body,
      _captcha: 'false',
      _template: 'table',
    }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || 'Failed to send email. Please try again later.');
  }

  return result;
};
