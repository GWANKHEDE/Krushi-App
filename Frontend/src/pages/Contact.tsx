import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';

import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  Sprout,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { settingsAPI } from '@/services/api';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [contactDetails, setContactDetails] = useState({
    address: 'Main Road, Penur, District: Parbhani, State, PIN: 431511',
    phone: '+91 98233 32198',
    email: 'info@krushisevakendra.com'
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina,
    iconUrl: icon,
    shadowUrl: shadow,
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        const response = await settingsAPI.getBusinessProfile();
        if (response.data.success) {
          const business = response.data.data;
          setContactDetails({
            address: business.address || 'Main Road, Penur, District: Parbhani, State, PIN: 431511',
            phone: business.contactNumber || '+91 98233 32198',
            email: business.email || 'info@krushisevakendra.com'
          });
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t('visit_us'),
      details: [contactDetails.address],
      color: 'bg-primary/10 text-primary'
    },
    {
      icon: Phone,
      title: t('call_us'),
      details: [contactDetails.phone, 'Mon-Sat: 8AM-7PM'],
      color: 'bg-success/10 text-success'
    },
    {
      icon: Mail,
      title: t('email_us'),
      details: [contactDetails.email, 'Response within 24hrs'],
      color: 'bg-info/10 text-info'
    },
    {
      icon: Clock,
      title: t('working_hours'),
      details: ['Mon-Sat: 8AM - 7PM', 'Sun: 9AM - 5PM'],
      color: 'bg-accent/10 text-accent-foreground'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      {/* Header */}
      <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
        <Badge variant="outline" className="mb-4 border-primary text-primary px-4 py-1 uppercase font-black text-[10px] tracking-widest">{t('support_center')}</Badge>
        <h1 className="text-lg md:text-2xl font-black mb-4 tracking-tighter uppercase leading-none">{t('contact')} <span className="text-primary">{t('the_experts')}</span></h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm font-bold italic uppercase tracking-wider leading-relaxed">
          {t('contact_desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">{t('get_in_touch')}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="border-none shadow-soft bg-card hover:shadow-strong transition-all rounded-[2rem] overflow-hidden group">
                  <CardHeader className="pb-3 pt-8 px-8">
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className={`h-16 w-16 rounded-2xl ${info.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-8 w-8`} />
                      </div>
                      <CardTitle className="text-lg font-black uppercase tracking-tight">{info.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 text-center">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic mb-1">
                        {detail}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Why Contact Us */}
          <Card className="bg-accent/10 border-accent/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Sprout className="h-5 w-5 text-primary" />
                <CardTitle>{t('why_contact_us')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <p className="text-sm">
                  {t('expert_guidance_selection')}
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <p className="text-sm">
                  {t('bulk_order_discounts')}
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <p className="text-sm">
                  {t('custom_farming_solutions')}
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <p className="text-sm">
                  {t('technical_support')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <CardTitle>{t('send_us_message')}</CardTitle>
              </div>
              <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 leading-relaxed">
                {t('fill_out_form')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('full_name')} *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder={t('full_name')}
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('phone_number')} *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('email_address')}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">{t('subject')} *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder={t('subject')}
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t('message')} *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={t('message')}
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full h-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center">
                  <Send className="h-4 w-4 mr-2" />
                  {t('send_message')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">{t('find_us')}</h2>
        <Card>
          <CardContent className="p-0">
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <iframe
                title="Krushi Seva Kendra Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.9308!2d77.0977631!3d19.051437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4cf9baec8d8c1%3A0x7f5d2514a8a207c1!2s34P2%2BGG%20Penur%2C%20Maharashtra%20431511!5e0!3m2!1sen!2sin!4v1690030665432!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}