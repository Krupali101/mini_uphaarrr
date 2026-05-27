import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Instagram, Mail, Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { toast } from 'sonner';
import { getCustomOrderGmailLink } from '@/utils/contactUtils';
import { openGmailWithThankYou } from '@/utils/gmailFeedback';

function CustomOrdersPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    customizationDetails: '',
    budget: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.category || !formData.customizationDetails) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    openGmailWithThankYou(getCustomOrderGmailLink(formData), {
      title: 'Thank you for your custom order request!',
      description: 'Your email app is ready with your custom gift details, and we will reply soon.'
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      category: '',
      customizationDetails: '',
      budget: ''
    });
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Custom Orders - Mini_Uphaarrr</title>
        <meta name="description" content="Create your personalized gift with Mini_Uphaarrr. Submit your custom order request online." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="py-10 md:py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-6 md:mb-12"
              >
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-4 md:mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Personalized Just for You</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                  Create your custom gift
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Share your vision with us and we'll create a unique handmade gift tailored to your special occasion
                </p>
              </motion.div>

              <div className="max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl md:text-2xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Custom order request
                      </CardTitle>
                      <CardDescription>
                        Fill in the details below and we will get back to you to finalize your order
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="category">Product Category *</Label>
                            <Select 
                              value={formData.category} 
                              onValueChange={(value) => handleChange('category', value)}
                              disabled={isSubmitting}
                              required
                            >
                              <SelectTrigger id="category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Customized Bouquets">Customized Bouquets</SelectItem>
                                <SelectItem value="Chocolate Hampers">Chocolate Hampers</SelectItem>
                                <SelectItem value="Personalized Decorations">Personalized Decorations</SelectItem>
                                <SelectItem value="Surprise Gift Boxes">Surprise Gift Boxes</SelectItem>
                                <SelectItem value="Handmade Greeting Cards">Handmade Greeting Cards</SelectItem>
                                <SelectItem value="Kinder Joy Bouquets">Kinder Joy Bouquets</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="budget">Budget Range</Label>
                            <Select 
                              value={formData.budget} 
                              onValueChange={(value) => handleChange('budget', value)}
                              disabled={isSubmitting}
                            >
                              <SelectTrigger id="budget">
                                <SelectValue placeholder="Select budget range" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                                <SelectItem value="1000-2000">₹1,000 - ₹2,000</SelectItem>
                                <SelectItem value="2000-3000">₹2,000 - ₹3,000</SelectItem>
                                <SelectItem value="3000+">₹3,000+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="customizationDetails">Customization Details *</Label>
                          <Textarea
                            id="customizationDetails"
                            placeholder="Tell us about your vision, preferred colors, themes, occasion, or any special requests..."
                            value={formData.customizationDetails}
                            onChange={(e) => handleChange('customizationDetails', e.target.value)}
                            required
                            disabled={isSubmitting}
                            rows={5}
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
                              Open Email App to Send Request
                            </>
                          )}
                        </Button>
                      </form>
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

export default CustomOrdersPage;
