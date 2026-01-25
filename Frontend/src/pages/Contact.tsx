import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function Contact() {
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
      title: 'Visit Us',
      details: [contactDetails.address],
      color: 'text-primary'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: [contactDetails.phone, 'Mon-Sat: 8AM-7PM'],
      color: 'text-success'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: [contactDetails.email, 'Response within 24hrs'],
      color: 'text-info'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Monday - Saturday: 8:00 AM - 7:00 PM', 'Sunday: 9:00 AM - 5:00 PM', 'Emergency: 24/7'],
      color: 'text-info'
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
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get in touch with our agricultural experts. We're here to help you
          with all your farming needs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`h-10 w-10 rounded-full bg-muted flex items-center justify-center`}
                      >
                        <Icon className={`h-5 w-5 ${info.color}`} />
                      </div>
                      <CardTitle className="text-lg">{info.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {info.details.map((detail, idx) => (
                      <p
                        key={idx}
                        className="text-sm text-muted-foreground mb-1"
                      >
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
                <CardTitle>Why Contact Us?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <p className="text-sm">
                  Expert guidance on product selection and usage
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <p className="text-sm">
                  Bulk order discounts and special pricing
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <p className="text-sm">
                  Custom farming solutions for your specific needs
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <p className="text-sm">
                  Technical support and after-sales service
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
                <CardTitle>Send us a Message</CardTitle>
              </div>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as
                possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
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
                  <Label htmlFor="email">Email Address</Label>
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
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What can we help you with?"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Please describe your inquiry in detail..."
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Find Us</h2>
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