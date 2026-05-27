import { toast } from 'sonner';

const DEFAULT_TITLE = 'Thank you for your message!';
const DEFAULT_DESCRIPTION = 'Your email app is ready. Please tap Send there, and we will reply as soon as possible.';

const showBrowserNotification = async (title, description) => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  const notify = () => {
    new Notification(title, {
      body: description,
      icon: '/images/home-customized-gift-bouquet.png'
    });
  };

  if (Notification.permission === 'granted') {
    notify();
    return;
  }

  if (Notification.permission === 'default' && window.isSecureContext) {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      notify();
    }
  }
};

export const showGmailThankYou = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION
} = {}) => {
  toast.success(title, {
    description,
    duration: 10000
  });

  showBrowserNotification(title, description).catch(() => {});
};

export const openGmailWithThankYou = (emailLink, feedbackOptions) => {
  showGmailThankYou(feedbackOptions);

  if (emailLink.startsWith('mailto:')) {
    window.setTimeout(() => {
      window.location.href = emailLink;
    }, 350);
  } else {
    window.open(emailLink, '_blank', 'noopener,noreferrer');
  }
};
