import { toast } from 'sonner';

const PENDING_FEEDBACK_KEY = 'mini_uphaarrr_pending_email_feedback';
const FEEDBACK_RETURN_WINDOW_MS = 10 * 60 * 1000;
const GMAIL_WEB_ORIGIN = 'https://mail.google.com';

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

const getPendingFeedback = () => {
  try {
    const pendingFeedback = window.sessionStorage.getItem(PENDING_FEEDBACK_KEY);
    return pendingFeedback ? JSON.parse(pendingFeedback) : null;
  } catch {
    return null;
  }
};

const setPendingFeedback = (pendingFeedback) => {
  try {
    window.sessionStorage.setItem(PENDING_FEEDBACK_KEY, JSON.stringify(pendingFeedback));
  } catch {}
};

const clearPendingFeedback = () => {
  try {
    window.sessionStorage.removeItem(PENDING_FEEDBACK_KEY);
  } catch {}
};

const isPendingFeedbackExpired = (pendingFeedback) => {
  return !pendingFeedback || Date.now() - pendingFeedback.openedAt > FEEDBACK_RETURN_WINDOW_MS;
};

const showPendingFeedbackIfReady = () => {
  if (typeof window === 'undefined') {
    return;
  }

  const pendingFeedback = getPendingFeedback();

  if (isPendingFeedbackExpired(pendingFeedback)) {
    clearPendingFeedback();
    return;
  }

  if (!pendingFeedback.hasLeftApp || Date.now() - pendingFeedback.openedAt < 500) {
    return;
  }

  clearPendingFeedback();
  window.setTimeout(() => {
    showGmailThankYou(pendingFeedback.feedbackOptions);
  }, 250);
};

const markEmailAppOpened = (feedbackOptions) => {
  setPendingFeedback({
    feedbackOptions,
    openedAt: Date.now(),
    hasLeftApp: false
  });
};

const markEmailAppLeft = () => {
  const pendingFeedback = getPendingFeedback();

  if (isPendingFeedbackExpired(pendingFeedback)) {
    clearPendingFeedback();
    return;
  }

  setPendingFeedback({
    ...pendingFeedback,
    hasLeftApp: true
  });
};

let hasArmedReturnFeedback = false;

const armReturnFeedback = () => {
  if (typeof window === 'undefined' || hasArmedReturnFeedback) {
    return;
  }

  hasArmedReturnFeedback = true;

  window.addEventListener('blur', markEmailAppLeft);
  window.addEventListener('pagehide', markEmailAppLeft);
  window.addEventListener('focus', showPendingFeedbackIfReady);
  window.addEventListener('pageshow', showPendingFeedbackIfReady);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      markEmailAppLeft();
      return;
    }

    showPendingFeedbackIfReady();
  });

  window.setTimeout(showPendingFeedbackIfReady, 300);
};

const getGmailComposeParams = (emailLink) => {
  try {
    const url = new URL(emailLink);

    if (url.origin !== GMAIL_WEB_ORIGIN) {
      return null;
    }

    return {
      to: url.searchParams.get('to') || '',
      subject: url.searchParams.get('su') || '',
      body: url.searchParams.get('body') || ''
    };
  } catch {
    return null;
  }
};

const openGmailAppOrFallback = (emailLink) => {
  if (typeof window === 'undefined') {
    return;
  }

  const composeParams = getGmailComposeParams(emailLink);
  const userAgent = window.navigator.userAgent || '';
  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

  if (!composeParams || (!isAndroid && !isIOS)) {
    window.open(emailLink, '_blank', 'noopener,noreferrer');
    return;
  }

  const query = `to=${encodeURIComponent(composeParams.to)}&subject=${encodeURIComponent(composeParams.subject)}&body=${encodeURIComponent(composeParams.body)}`;

  if (isAndroid) {
    window.location.href = `intent://co?${query}#Intent;scheme=googlegmail;package=com.google.android.gm;S.browser_fallback_url=${encodeURIComponent(emailLink)};end`;
    return;
  }

  window.location.href = `googlegmail://co?${query}`;

  window.setTimeout(() => {
    if (!document.hidden) {
      window.location.href = emailLink;
    }
  }, 1200);
};

export const openGmailWithThankYou = (emailLink, feedbackOptions) => {
  armReturnFeedback();
  markEmailAppOpened(feedbackOptions);

  if (emailLink.startsWith('mailto:')) {
    window.setTimeout(() => {
      window.location.href = emailLink;
    }, 100);
  } else {
    openGmailAppOrFallback(emailLink);
  }
};

armReturnFeedback();
