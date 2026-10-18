import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnnouncement } from '@/lib/api';

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState([]);
  const [index, setIndex] = useState(0);
  useEffect(() => { let mounted = true; getAnnouncement().then((result) => { if (mounted) setAnnouncements(result.announcements || (result.announcement ? [result.announcement] : [])); }).catch(() => {}); return () => { mounted = false; }; }, []);
  useEffect(() => {
    if (announcements.length < 2) return undefined;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % announcements.length), 3500);
    return () => window.clearInterval(timer);
  }, [announcements.length]);
  if (!announcements.length) return null;
  const announcement = announcements[index];
  const content = <span className="block truncate px-4 text-center text-[11px] font-medium leading-4 sm:text-xs">{announcement.text}</span>;
  const linkedContent = announcement.link ? (announcement.link.startsWith('/') ? <Link to={announcement.link}>{content}</Link> : <a href={announcement.link}>{content}</a>) : content;
  return <div className="flex h-8 w-full items-center justify-center overflow-hidden bg-gradient-to-r from-[#f8c8d2] via-[#f4aebf] to-[#f8d9df] text-white sm:h-7"><div key={announcement.id} className="announcement-slide w-full">{linkedContent}</div></div>;
}
