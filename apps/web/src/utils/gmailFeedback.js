import { toast } from 'sonner';

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

export const showGmailThankYou = ({ title, description }) => {
  toast.success(title, {
    description,
    duration: 10000
  });

  showBrowserNotification(title, description).catch(() => {});
};

export const openGmailWithThankYou = (emailLink, feedbackOptions) => {
  if (emailLink.startsWith('mailto:')) {
    window.location.href = emailLink;
  } else {
    window.open(emailLink, '_blank', 'noopener,noreferrer');
    showGmailThankYou(feedbackOptions);
  }
};
