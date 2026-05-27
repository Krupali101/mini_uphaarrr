import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Instagram, Mail, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { toast } from 'sonner';
import { getContactMessageGmailLink, getGmailLink } from '@/utils/contactUtils';
import { openGmailWithThankYou } from '@/utils/gmailFeedback';

function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    openGmailWithThankYou(getContactMessageGmailLink(formData), {
      title: 'Thank you for contacting us!',
      description: 'Your email app is ready with your message, and we will get back to you soon.'
    });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: Instagram,
      title: 'Instagram',
      value: '@mini_.uphaarrr',
      link: 'https://www.instagram.com/mini_.uphaarrr',
      description: 'Follow us for updates and inspiration'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'officialminiuphaarrr@gmail.com',
      link: getGmailLink('Mini_Uphaarrr Inquiry', 'Hi Mini_Uphaarrr,\n\nI would like to get in touch with you.\n\nThank you!'),
      description: 'Send us your inquiries anytime'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - Mini_Uphaarrr</title>
        <meta name="description" content="Get in touch with Mini_Uphaarrr. Contact us via Instagram or email for custom orders and inquiries." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="py-10 md:py-14 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-6 md:mb-8"
              >
                <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                  Get in touch
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Have a question or want to place a custom order? We'd love to hear from you
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-8 max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl md:text-2xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Send us a message
                      </CardTitle>
                      <CardDescription>
                        Fill out the form and we'll get back to you soon
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                              id="name"
                              type="text"
                              placeholder="Your name"
                              value={formData.name}
                              onChange={(e) => handleChange('name', e.target.value)}
                              required
                              disabled={isSubmitting}
                              className="text-foreground placeholder:text-muted-foreground"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="your.email@example.com"
                              value={formData.email}
                              onChange={(e) => handleChange('email', e.target.value)}
                              required
                              disabled={isSubmitting}
                              className="text-foreground placeholder:text-muted-foreground"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+91 98765 43210"
                              value={formData.phone}
                              onChange={(e) => handleChange('phone', e.target.value)}
                              disabled={isSubmitting}
                              className="text-foreground placeholder:text-muted-foreground"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="subject">Subject *</Label>
                            <Input
                              id="subject"
                              type="text"
                              placeholder="How can we help?"
                              value={formData.subject}
                              onChange={(e) => handleChange('subject', e.target.value)}
                              required
                              disabled={isSubmitting}
                              className="text-foreground placeholder:text-muted-foreground"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            placeholder="Tell us how we can help you..."
                            value={formData.message}
                            onChange={(e) => handleChange('message', e.target.value)}
                            required
                            disabled={isSubmitting}
                            rows={6}
                            className="text-foreground placeholder:text-muted-foreground"
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98]"
                        >
                          {isSubmitting ? (
                            <>Opening email app...</>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Open Email App to Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="space-y-5 md:space-y-6"
                >
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                      Contact information
                    </h2>
                    <div className="space-y-3 md:space-y-4">
                      {contactMethods.map((method, index) => (
                        <Card key={index} className="hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-4 md:p-6">
                            <div className="flex items-start gap-3 md:gap-4">
                              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <method.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold mb-1">{method.title}</h3>
                                <a
                                  href={method.link}
                                  target={method.title === 'Email' ? undefined : '_blank'}
                                  rel={method.title === 'Email' ? undefined : 'noopener noreferrer'}
                                  onClick={(event) => {
                                    if (method.title === 'Email') {
                                      event.preventDefault();
                                      window.location.href = method.link;
                                    }
                                  }}
                                  className="block truncate text-primary hover:underline font-medium"
                                >
                                  {method.value}
                                </a>
                                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                  {method.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
                    <CardContent className="p-4 md:p-6">
                      <h3 className="font-semibold mb-2 md:mb-3">Quick response times</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        We typically respond to all inquiries within 24 hours. For urgent custom orders, reach out via Instagram DM for the fastest response.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default ContactPage;
