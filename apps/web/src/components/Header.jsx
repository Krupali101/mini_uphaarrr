import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

function Header() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Custom Orders', path: '/custom-orders' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
              Mini Uphaarrr
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-200 hover:text-primary ${
                  isActive(link.path)
                    ? 'text-primary font-semibold'
                    : 'text-foreground/80'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://www.instagram.com/mini_.uphaarrr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/80 hover:text-primary transition-colors duration-200"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </nav>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-all duration-200 hover:text-primary ${
                      isActive(link.path)
                        ? 'text-primary font-semibold'
                        : 'text-foreground/80'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <a
                  href="https://www.instagram.com/mini_.uphaarrr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-lg font-medium text-foreground/80 hover:text-primary transition-colors duration-200"
                >
                  <Instagram className="w-5 h-5" />
                  Follow on Instagram
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;
