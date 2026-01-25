import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Award,
  Clock,
  MapPin,
  Sprout,
  Shield,
  Target,
  Heart,
  Loader2
} from 'lucide-react';
import owner from '@/assets/owner.jpeg';
import accountant from '@/assets/accountant.jpeg';
import { useEffect, useState } from 'react';
import { dashboardAPI, settingsAPI } from '@/services/api';

export default function About() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    years: '5+',
    happyFarmers: '1K+',
    products: '2K+',
    areas: '20+'
  });
  const [businessName, setBusinessName] = useState('Krushi Seva Kendra');
  const [ownerName, setOwnerName] = useState('Sudam Wankhede');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashboardRes, profileRes] = await Promise.all([
          dashboardAPI.getDashboardData(),
          settingsAPI.getBusinessProfile()
        ]);

        if (dashboardRes.data.success) {
          const data = dashboardRes.data.data;
          setStats(prev => ({
            ...prev,
            products: data.totals.totalProducts + '+',
            // We could use other stats if available, for now keeping static/mock for others
            // as the dashboard API doesn't return all these specific metrics yet
          }));
        }

        if (profileRes.data.success) {
          const business = profileRes.data.data;
          setBusinessName(business.name);
          if (business.owner?.name) {
            setOwnerName(business.owner.name);
          }
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statItems = [
    { label: 'Years of Experience', value: stats.years },
    { label: 'Happy Farmers', value: stats.happyFarmers },
    { label: 'Products Available', value: stats.products },
    { label: 'Areas Served', value: stats.areas }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'We ensure all our products meet the highest quality standards and are sourced from certified suppliers.'
    },
    {
      icon: Heart,
      title: 'Farmer First',
      description: 'Our farmers\' success is our priority. We provide personalized solutions for every farming need.'
    },
    {
      icon: Target,
      title: 'Sustainable Farming',
      description: 'We promote eco-friendly and sustainable farming practices for a better future.'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Our team of agricultural experts provides guidance and support throughout your farming journey.'
    }
  ];

  const team = [
    {
      name: ownerName,
      role: 'Owner & Founder',
      experience: 'Agriculture expert',
      description: 'Agricultural engineer with expertise in crop management and sustainable farming practices.',
      image: owner
    },
    {
      name: 'Mangesh Wankhede',
      role: 'Agricultural Consultant',
      experience: '8+ years in Agriculture Field',
      description: 'Postgraduate in Agricultural Sciences, provides technical guidance to farmers.',
      image: 'https://ui-avatars.com/api/?name=Mangesh+Wankhede&background=random' // Placeholder image
    },
    {
      name: 'Deepak Wankhede',
      role: 'Billing & Inventory Expert',
      experience: 'Trainee Accountant',
      description: 'Handles billing, inventory management, and customer service with precision.',
      image: accountant
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
        <h1 className="text-3xl font-bold mb-4">About {businessName}</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
          For over 5 years, we have been dedicated to empowering farmers with
          quality agricultural products and expert guidance, helping them
          achieve better yields and sustainable farming practices.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {statItems.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Our Story */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                {businessName} was founded in 2021 with a simple mission: to
                bridge the gap between farmers and quality agricultural
                products. What started as a small local store has grown into a
                trusted partner for thousands of farmers across the region.
              </p>
              <p>
                Our founder, {ownerName}, himself coming from a farming
                family, understood the challenges farmers face in accessing
                quality fertilizers, seeds, and tools. He envisioned a place
                where farmers could not only buy products but also receive
                expert guidance and support.
              </p>
              <p>
                Today, we continue to honor that vision by providing
                comprehensive agricultural solutions, from premium products to
                technical expertise, helping farmers achieve sustainable and
                profitable farming.
              </p>
            </div>
          </div>
          <div className="bg-muted rounded-lg p-8 text-center">
            <Sprout className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <p className="text-muted-foreground">
              To empower farmers with quality agricultural products, innovative
              solutions, and expert guidance to achieve sustainable farming
              success and food security.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Our Team */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mx-auto mb-4">
                  <img
                    src={member.image}
                    className="h-full w-full rounded-full object-cover"
                    alt={member.name}
                  />
                </div>
                <CardTitle>{member.name}</CardTitle>
                <CardDescription className="font-medium text-primary">
                  {member.role}
                </CardDescription>
                <Badge variant="secondary" className="mt-2 mx-auto">
                  {member.experience}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {member.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-muted/30 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8">
          Why Choose {businessName}?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <Award className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Certified Products</h3>
            <p className="text-sm text-muted-foreground">
              All products are certified and quality tested
            </p>
          </div>
          <div className="text-center">
            <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Quick Delivery</h3>
            <p className="text-sm text-muted-foreground">
              Fast and reliable delivery to your farm
            </p>
          </div>
          <div className="text-center">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Wide Coverage</h3>
            <p className="text-sm text-muted-foreground">
              Serving farmers across multiple districts
            </p>
          </div>
          <div className="text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Expert Support</h3>
            <p className="text-sm text-muted-foreground">
              24/7 agricultural expert consultation
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}