export const submitEmailForm = async ({
  senderName,
  senderEmail,
  subject,
  message,
}) => {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      senderName,
      senderEmail,
      subject,
      message,
    }),
  });

  const result = await response.json().catch(() => ({
    message: `Email API request failed with status ${response.status}.`,
  }));

  if (!response.ok) {
    throw new Error(result.message || 'Failed to send email.');
  }

  return result;
};
