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
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();
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
    { label: t('years_exp'), value: stats.years },
    { label: t('happy_farmers'), value: stats.happyFarmers },
    { label: t('products_avail'), value: stats.products },
    { label: t('areas_served'), value: stats.areas }
  ];

  const values = [
    {
      icon: Shield,
      title: t('quality_assurance'),
      description: t('qa_desc')
    },
    {
      icon: Heart,
      title: t('farmer_first'),
      description: t('ff_desc')
    },
    {
      icon: Target,
      title: t('sustainable_farming'),
      description: t('sf_desc')
    },
    {
      icon: Users,
      title: t('expert_support'),
      description: t('expert_support_desc')
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
      <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
        <Badge variant="outline" className="mb-4 border-primary text-primary px-4 py-1 uppercase font-black text-[10px] tracking-widest">{t('our_legacy')}</Badge>
        <h1 className="text-lg md:text-2xl font-black mb-6 tracking-tighter uppercase leading-none">{t('about_span')} <span className="text-primary">{businessName}</span></h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-sm font-bold italic uppercase tracking-wider leading-relaxed">
          {t('legacy_desc')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {statItems.map((stat, index) => (
          <Card key={index} className="text-center border-none shadow-soft bg-card rounded-[2rem] overflow-hidden group hover:shadow-strong transition-all">
            <CardContent className="pt-8 pb-6">
              <div className="text-lg md:text-2xl font-black text-primary mb-2 tracking-tighter group-hover:scale-110 transition-transform">
                {stat.value}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Our Story */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-6">{t('our_story')}</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                {t('story_p1', { businessName })}
              </p>
              <p>
                {t('story_p2', { ownerName })}
              </p>
              <p>
                {t('story_p3')}
              </p>
            </div>
          </div>
          <div className="bg-muted rounded-lg p-8 text-center">
            <Sprout className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('our_mission')}</h3>
            <p className="text-muted-foreground">
              {t('mission_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="mb-24">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary/70 px-4 py-1 uppercase font-black text-[10px] tracking-widest">{t('our_principles')}</Badge>
          <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter">{t('core_values')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index} className="border-none shadow-soft bg-card hover:bg-accent/5 hover:shadow-strong transition-all rounded-[2.5rem] p-4 group">
                <CardHeader className="flex flex-col md:flex-row items-center md:items-start gap-6 pt-8">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-lg font-black uppercase tracking-tight">{value.title}</CardTitle>
                    <CardDescription className="text-xs font-bold italic uppercase tracking-wider text-muted-foreground leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Our Team */}
      <section className="mb-24">
        <div className="text-center mb-16">
          <Badge className="bg-primary text-white px-4 py-1 uppercase font-black text-[10px] tracking-widest border-none">{t('the_experts')}</Badge>
          <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter mt-4">{t('meet_our_team')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <Card
              key={index}
              className="text-center border-none shadow-soft bg-card hover:shadow-strong hover:-translate-y-2 transition-all duration-500 rounded-[2.5rem] overflow-hidden group"
            >
              <CardHeader className="pt-8">
                <div className="h-24 w-24 rounded-full bg-gradient-to-r from-primary to-accent p-1 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-700">
                  <img
                    src={member.image}
                    className="h-full w-full rounded-full object-cover border-4 border-card"
                    alt={member.name}
                  />
                </div>
                <CardTitle className="text-xl font-black uppercase tracking-tight">{member.name}</CardTitle>
                <CardDescription className="font-black uppercase text-[10px] tracking-[0.2em] text-primary mt-2">
                  {member.role}
                </CardDescription>
                <Badge variant="secondary" className="mt-4 mx-auto bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest border-none">
                  {member.experience}
                </Badge>
              </CardHeader>
              <CardContent className="pb-8 px-8">
                <p className="text-muted-foreground text-[11px] font-bold italic uppercase tracking-wider leading-relaxed line-clamp-3">
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
          {t('why_choose_business', { businessName })}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <Award className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{t('certified_products')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('certified_products_desc')}
            </p>
          </div>
          <div className="text-center">
            <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{t('quick_delivery')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('quick_delivery_desc')}
            </p>
          </div>
          <div className="text-center">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{t('wide_coverage')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('wide_coverage_desc')}
            </p>
          </div>
          <div className="text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{t('expert_support')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('expert_consultation_desc')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}