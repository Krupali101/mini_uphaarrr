import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getGmailLink } from '@/utils/contactUtils';
import { showGmailThankYou } from '@/utils/gmailFeedback';

function Footer() {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Custom Orders', path: '/custom-orders' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-8">
          <div>
            <span className="text-2xl md:text-3xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
              Mini_Uphaarrr
            </span>
            <p className="mt-3 md:mt-4 text-xs md:text-sm leading-relaxed max-w-prose">
              Handmade with love, customized just for you. Creating unique gifts and surprise creations designed with creativity, elegance, and love.
            </p>
          </div>

          <div>
            <span className="text-base md:text-lg font-semibold mb-3 md:mb-4 block">Quick Links</span>
            <nav className="grid grid-cols-2 gap-x-5 gap-y-2 md:flex md:flex-col">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm hover:text-primary transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <span className="text-base md:text-lg font-semibold mb-3 md:mb-4 block">Connect With Us</span>
            <div className="flex flex-col gap-2.5 md:gap-3">
              <a
                href="https://www.instagram.com/mini_.uphaarrr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full justify-start min-w-0 h-10 text-sm transition-all duration-200 active:scale-[0.98]">
                  <Instagram className="w-4 h-4 mr-2 shrink-0" />
                  <span className="truncate">@mini_.uphaarrr</span>
                </Button>
              </a>
              <a
                href={getGmailLink('Mini_Uphaarrr Inquiry', 'Hi Mini_Uphaarrr,\n\nI would like to get in touch with you.\n\nThank you!')}
                onClick={() => showGmailThankYou({
                  title: 'Thank you for reaching out!',
                  description: 'Your email app is ready. Please tap Send there, and we will reply soon.'
                })}
              >
                <Button variant="outline" className="w-full justify-start min-w-0 h-10 text-sm transition-all duration-200 active:scale-[0.98]">
                  <Mail className="w-4 h-4 mr-2 shrink-0" />
                  <span className="truncate">officialminiuphaarrr@gmail.com</span>
                </Button>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-7 md:mt-8 pt-5 md:pt-8 border-t border-border/50 flex justify-center text-center">
          <p className="text-xs md:text-sm">
            © 2026 Mini_Uphaarrr. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
