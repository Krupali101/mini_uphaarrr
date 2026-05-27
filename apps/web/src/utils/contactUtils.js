export const getInstagramDMLink = () => {
  return 'https://ig.me/m/mini_.uphaarrr';
};

export const getGmailLink = (subject = '', body = '') => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const encodedRecipient = encodeURIComponent('officialminiuphaarrr@gmail.com');

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedRecipient}&su=${encodedSubject}&body=${encodedBody}`;
};

export const getProductOrderGmailLink = (productName = '') => {
  const subject = 'Customized Order for Mini_Uphaarrr';
  const body = `Hi Mini_Uphaarrr,\n\nI want to place a customized order for: ${productName}\n\nPlease let me know the details and pricing.\n\nThank you!`;
  return getGmailLink(subject, body);
};

export const getCustomOrderGmailLink = (formData) => {
  const subject = 'Custom Gift Request - Mini_Uphaarrr';
  const body = `Hi Mini_Uphaarrr,\n\nI would like to place a custom order with the following details:\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || 'Not provided'}\nProduct Category: ${formData.category || formData.giftType || 'Not specified'}\nBudget Range: ${formData.budget || 'Not specified'}\nCustomization Details: ${formData.customizationDetails || formData.requirements || 'Not provided'}\n\nLooking forward to your response!\n\nThank you!`;
  return getGmailLink(subject, body);
};

export const getContactMessageGmailLink = (formData) => {
  const subject = `Contact Form: ${formData.subject}`;
  const body = `Hi Mini_Uphaarrr,\n\nI would like to contact you with the following details:\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || 'Not provided'}\nSubject: ${formData.subject}\nMessage: ${formData.message}\n\nThank you!`;
  return getGmailLink(subject, body);
};
