import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'
import shadow from 'leaflet/dist/images/marker-shadow.png'
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, Sprout } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { settingsAPI } from '@/services/api'
import { useTranslation } from 'react-i18next'
import { FadeUp, SlideIn, StaggerList } from '@/components/Animate'

export default function Contact() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [contactDetails, setContactDetails] = useState({
    address: 'Main Road, Penur, District: Parbhani, State, PIN: 431511',
    phone:   '+91 98233 32198',
    email:   'info@krushisevakendra.com'
  })
  const [formData, setFormData] = useState({ name:'', phone:'', email:'', subject:'', message:'' })
  const { toast } = useToast()

  L.Icon.Default.mergeOptions({ iconRetinaUrl: iconRetina, iconUrl: icon, shadowUrl: shadow })

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true)
        const res = await settingsAPI.getBusinessProfile()
        if (res.data.success) {
          const b = res.data.data
          setContactDetails({
            address: b.address       || 'Main Road, Penur, District: Parbhani, State, PIN: 431511',
            phone:   b.contactNumber || '+91 98233 32198',
            email:   b.email         || 'info@krushisevakendra.com'
          })
        }
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetchContactInfo()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." })
    setFormData({ name:'', phone:'', email:'', subject:'', message:'' })
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="pub-loading-ring" />
    </div>
  )

  const contactInfo = [
    { icon: MapPin,   title: t('visit_us'),       details: [contactDetails.address],               color: 'bg-primary/10 text-primary'              },
    { icon: Phone,    title: t('call_us'),         details: [contactDetails.phone, 'Mon-Sat: 8AM-7PM'], color: 'bg-green-500/10 text-green-600'      },
    { icon: Mail,     title: t('email_us'),        details: [contactDetails.email, 'Response within 24hrs'], color: 'bg-blue-500/10 text-blue-600'   },
    { icon: Clock,    title: t('working_hours'),   details: ['Mon-Sat: 8AM - 7PM','Sun: 9AM - 5PM'],color: 'bg-accent/10 text-accent-foreground'   },
  ]

  return (
    <div className="container px-4 py-8">

      {/* Header */}
      <FadeUp className="text-center mb-16">
        <Badge variant="outline" className="mb-4 border-primary text-primary px-4 py-1 uppercase font-black text-[10px] tracking-widest">{t('support_center')}</Badge>
        <h1 className="text-lg md:text-2xl font-black mb-4 tracking-tighter uppercase leading-none">
          {t('contact')} <span className="text-primary">{t('the_experts')}</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm font-bold italic uppercase tracking-wider leading-relaxed">{t('contact_desc')}</p>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Left — contact info */}
        <SlideIn direction="left">
          <div>
            <h2 className="text-2xl font-semibold mb-6">{t('get_in_touch')}</h2>
            <StaggerList className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12" stagger={75}>
              {contactInfo.map((info, i) => {
                const Icon = info.icon
                return (
                  <div key={i} className="pub-lift rounded-[2rem] overflow-hidden bg-card border border-border/50 group cursor-default">
                    <div className="pt-8 px-8 pb-3">
                      <div className="flex flex-col items-center text-center gap-4">
                        <div className={`h-14 w-14 rounded-2xl ${info.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                          <Icon className="h-7 w-7" />
                        </div>
                        <h3 className="text-base font-black uppercase tracking-tight">{info.title}</h3>
                      </div>
                    </div>
                    <div className="px-6 pb-6 text-center">
                      {info.details.map((d, idx) => (
                        <p key={idx} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic mb-1">{d}</p>
                      ))}
                    </div>
                  </div>
                )
              })}
            </StaggerList>

            {/* Why Contact Us */}
            <FadeUp delay={200}>
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sprout className="h-5 w-5 text-primary" />
                  <h3 className="font-bold">{t('why_contact_us')}</h3>
                </div>
                <div className="space-y-3">
                  {[t('expert_guidance_selection'), t('bulk_order_discounts'), t('custom_farming_solutions'), t('technical_support')].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                      <p className="text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </SlideIn>

        {/* Right — form */}
        <SlideIn direction="right">
          <div className="pub-lift rounded-2xl bg-card border border-border/50 p-7">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">{t('send_us_message')}</h3>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-6">{t('fill_out_form')}</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('full_name')} *</Label>
                  <Input id="name" name="name" placeholder={t('full_name')} value={formData.name} onChange={handleChange} required className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('phone_number')} *</Label>
                  <Input id="phone" name="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} required className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('email_address')}</Label>
                <Input id="email" name="email" type="email" placeholder="your.email@example.com" value={formData.email} onChange={handleChange} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">{t('subject')} *</Label>
                <Input id="subject" name="subject" placeholder={t('subject')} value={formData.subject} onChange={handleChange} required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">{t('message')} *</Label>
                <Textarea id="message" name="message" placeholder={t('message')} rows={5} value={formData.message} onChange={handleChange} required className="rounded-xl resize-none" />
              </div>
              <Button type="submit" className="pub-btn w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-sm shadow-lg">
                <Send className="h-4 w-4 mr-2" />{t('send_message')}
              </Button>
            </form>
          </div>
        </SlideIn>
      </div>

      {/* Map */}
      <FadeUp className="mt-14">
        <h2 className="text-2xl font-semibold mb-6 text-center">{t('find_us')}</h2>
        <div className="rounded-3xl overflow-hidden border border-border/50 shadow-lg">
          <iframe
            title="Krushi Seva Kendra Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.9308!2d77.0977631!3d19.051437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4cf9baec8d8c1%3A0x7f5d2514a8a207c1!2s34P2%2BGG%20Penur%2C%20Maharashtra%20431511!5e0!3m2!1sen!2sin!4v1690030665432!5m2!1sen!2sin"
            width="100%" height="320"
            style={{ border: 0, display: 'block' }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </FadeUp>
    </div>
  )
}
