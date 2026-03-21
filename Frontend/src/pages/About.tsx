import { Badge } from '@/components/ui/badge'
import { Users, Award, Clock, MapPin, Sprout, Shield, Target, Heart, Loader2 } from 'lucide-react'
import owner from '@/assets/owner.jpeg'
import accountant from '@/assets/accountant.jpeg'
import { useEffect, useState } from 'react'
import { dashboardAPI, settingsAPI } from '@/services/api'
import { useTranslation } from 'react-i18next'
import { FadeUp, SlideIn, ScaleIn, StaggerList, CountUp } from '@/components/Animate'

export default function About() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [productCount, setProductCount] = useState(200)
  const [businessName, setBusinessName] = useState('Krushi Seva Kendra')
  const [ownerName, setOwnerName] = useState('Sudam Wankhede')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [dashboardRes, profileRes] = await Promise.all([
          dashboardAPI.getDashboardData(),
          settingsAPI.getBusinessProfile()
        ])
        if (dashboardRes.data.success) setProductCount(dashboardRes.data.data.totals.totalProducts || 200)
        if (profileRes.data.success) {
          const b = profileRes.data.data
          setBusinessName(b.name)
          if (b.owner?.name) setOwnerName(b.owner.name)
        }
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="pub-loading-ring" />
    </div>
  )

  const values = [
    { icon: Shield, title: t('quality_assurance'),   description: t('qa_desc') },
    { icon: Heart,  title: t('farmer_first'),         description: t('ff_desc') },
    { icon: Target, title: t('sustainable_farming'),  description: t('sf_desc') },
    { icon: Users,  title: t('expert_support'),       description: t('expert_support_desc') },
  ]

  const team = [
    { name: ownerName,          role: 'Owner & Founder',           experience: 'Agriculture expert',       description: 'Agricultural engineer with expertise in crop management and sustainable farming practices.', image: owner },
    { name: 'Mangesh Wankhede', role: 'Agricultural Consultant',   experience: '8+ years in Agriculture',  description: 'Postgraduate in Agricultural Sciences, provides technical guidance to farmers.',           image: 'https://ui-avatars.com/api/?name=Mangesh+Wankhede&background=random' },
    { name: 'Deepak Wankhede',  role: 'Billing & Inventory Expert',experience: 'Trainee Accountant',       description: 'Handles billing, inventory management, and customer service with precision.',              image: accountant },
  ]

  const whyUs = [
    { icon: Award,  title: t('certified_products'), desc: t('certified_products_desc') },
    { icon: Clock,  title: t('quick_delivery'),     desc: t('quick_delivery_desc')     },
    { icon: MapPin, title: t('wide_coverage'),      desc: t('wide_coverage_desc')      },
    { icon: Users,  title: t('expert_support'),     desc: t('expert_consultation_desc')},
  ]

  return (
    <div className="container px-4 py-8">

      {/* Header */}
      <FadeUp className="text-center mb-16">
        <Badge variant="outline" className="mb-4 border-primary text-primary px-4 py-1 uppercase font-black text-[10px] tracking-widest">{t('our_legacy')}</Badge>
        <h1 className="text-lg md:text-2xl font-black mb-6 tracking-tighter uppercase leading-none">
          {t('about_span')} <span className="pub-shimmer">{businessName}</span>
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-sm font-bold italic uppercase tracking-wider leading-relaxed">{t('legacy_desc')}</p>
      </FadeUp>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { end:5,            suffix:'+', label: t('years_exp') },
          { end:1000,         suffix:'+', label: t('happy_farmers') },
          { end:productCount, suffix:'+', label: t('products_avail') },
          { end:20,           suffix:'+', label: t('areas_served') },
        ].map((s, i) => (
          <ScaleIn key={i} delay={i * 90}>
            <div className="pub-lift text-center rounded-[2rem] bg-card border border-border/50 py-8 px-4 group cursor-default">
              <div className="text-3xl md:text-4xl font-black text-primary mb-2 tracking-tight group-hover:scale-110 transition-transform">
                <CountUp end={s.end} suffix={s.suffix} duration={1600} delay={i * 100} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</p>
            </div>
          </ScaleIn>
        ))}
      </div>

      {/* Our Story */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <SlideIn direction="left">
            <h2 className="text-2xl font-bold mb-6">{t('our_story')}</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>{t('story_p1', { businessName })}</p>
              <p>{t('story_p2', { ownerName })}</p>
              <p>{t('story_p3')}</p>
            </div>
          </SlideIn>
          <SlideIn direction="right">
            <div className="pub-lift bg-primary/5 border border-primary/20 rounded-3xl p-10 text-center">
              <div className="pub-float-anim inline-block" style={{ animation: 'pub-float 5.5s ease-in-out infinite' }}>
                <Sprout className="h-16 w-16 text-primary mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('our_mission')}</h3>
              <p className="text-muted-foreground">{t('mission_desc')}</p>
            </div>
          </SlideIn>
        </div>
      </section>

      {/* Values */}
      <section className="mb-24">
        <FadeUp className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary/70 px-4 py-1 uppercase font-black text-[10px] tracking-widest">{t('our_principles')}</Badge>
          <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter">{t('core_values')}</h2>
        </FadeUp>
        <StaggerList className="grid grid-cols-1 md:grid-cols-2 gap-8" stagger={100}>
          {values.map((value, i) => {
            const Icon = value.icon
            return (
              <div key={i} className="pub-lift rounded-[2.5rem] bg-card border border-border/50 p-8 group cursor-default">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/30">
                    <Icon className="h-8 w-8 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-primary transition-colors">{value.title}</h3>
                    <p className="text-xs text-muted-foreground italic uppercase tracking-wider leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </StaggerList>
      </section>

      {/* Team */}
      <section className="mb-24">
        <FadeUp className="text-center mb-16">
          <Badge className="bg-primary text-white px-4 py-1 uppercase font-black text-[10px] tracking-widest border-none">{t('the_experts')}</Badge>
          <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter mt-4">{t('meet_our_team')}</h2>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <ScaleIn key={i} delay={i * 100}>
              <div className="pub-lift text-center rounded-[2.5rem] overflow-hidden bg-card border border-border/50 group cursor-default">
                <div className="pt-8 px-8">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-r from-primary to-accent p-1 mx-auto mb-6 transition-transform duration-500 group-hover:scale-110">
                    <img src={member.image} className="h-full w-full rounded-full object-cover border-4 border-card" alt={member.name} />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight">{member.name}</h3>
                  <p className="font-black uppercase text-[10px] tracking-[0.2em] text-primary mt-2">{member.role}</p>
                  <Badge variant="secondary" className="mt-3 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest border-none">{member.experience}</Badge>
                </div>
                <div className="pb-8 px-8 mt-4">
                  <p className="text-muted-foreground text-[11px] italic uppercase tracking-wider leading-relaxed line-clamp-3">{member.description}</p>
                </div>
              </div>
            </ScaleIn>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <FadeUp>
        <section className="pub-lift bg-muted/30 rounded-3xl p-10">
          <h2 className="text-2xl font-bold text-center mb-10">{t('why_choose_business', { businessName })}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map((w, i) => (
              <div key={i} className="text-center group cursor-default">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary">
                  <w.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold mb-2">{w.title}</h3>
                <p className="text-sm text-muted-foreground">{w.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </FadeUp>
    </div>
  )
}
