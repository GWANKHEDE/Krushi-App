import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { Sprout, Shield, Recycle, Users, Leaf, Zap, ArrowRight, CheckCircle, Phone } from "lucide-react"
import hero1 from "@/assets/hero1.webp"
import hero2 from "@/assets/hero2.webp"
import hero3 from "@/assets/hero3.webp"
import hero4 from "@/assets/hero4.webp"
import cottonImg  from "@/assets/cotton.webp"
import soyaImg    from "@/assets/soya.webp"
import ureaImg    from "@/assets/uera.avif"
import dapImg     from "@/assets/DAP.png"
import potashImg  from "@/assets/potash.jfif"
import calarisImg from "@/assets/calaris.jpg"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { productsAPI, categoriesAPI, Product, Category } from "@/services/api"
import { FadeUp, SlideIn, ScaleIn, StaggerList, CountUp } from "@/components/Animate"

export default function Home() {
  const [products,   setProducts]   = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading,    setLoading]    = useState(true)
  const [slide,      setSlide]      = useState(0)
  const { t } = useTranslation()
  const heroImages = [hero1, hero2, hero3, hero4]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [pRes, cRes] = await Promise.all([
          productsAPI.getAllProducts({ limit: 6 }),
          categoriesAPI.getAllCategories(),
        ])
        if (pRes.data.success) setProducts(pRes.data.data.products)
        if (cRes.data.success) setCategories(cRes.data.data.categories.slice(0, 4))
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetchData()
    const iv = setInterval(() => {
      setSlide(prev => {
        const next = (prev + 1) % heroImages.length
        const el = document.getElementById("hero-track")
        if (el) el.scrollTo({ left: next * el.offsetWidth, behavior: "smooth" })
        return next
      })
    }, 5000)
    return () => clearInterval(iv)
  }, [])

  const goTo = (i: number) => {
    const el = document.getElementById("hero-track")
    if (el) el.scrollTo({ left: i * el.offsetWidth, behavior: "smooth" })
    setSlide(i)
  }

  const getProductImage = (product: Product) => {
    const n = product.name.toLowerCase()
    if (n.includes("cotton"))                        return cottonImg
    if (n.includes("soya") || n.includes("bean"))    return soyaImg
    if (n.includes("urea"))                          return ureaImg
    if (n.includes("dap"))                           return dapImg
    if (n.includes("potash"))                        return potashImg
    if (n.includes("calaris") || n.includes("sync")) return calarisImg
    const imgs = [
      "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=600&auto=format&fit=crop",
    ]
    return imgs[product.name.length % imgs.length]
  }

  const getCategoryImage = (i: number) => [
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&auto=format&fit=crop",
  ][i % 4]

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <div className="pub-loading-ring" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading…</p>
    </div>
  )

  const newArrivals = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  const features = [
    { icon: Sprout, title: t("quality_products"),  desc: "Certified seeds, fertilizers & more" },
    { icon: Shield, title: t("trusted_brands"),    desc: "Only genuine, tested products" },
    { icon: Recycle,title: t("eco_friendly"),      desc: "Sustainable farming solutions" },
    { icon: Users,  title: t("expert_support"),    desc: "Free guidance for every farmer" },
  ]

  const trustItems = [
    "🌾 5000+ Farmers Served","✅ 100% Genuine Products","📞 Expert Support",
    "🏆 10+ Years Experience","🚜 Marathwada's Trusted Store","🌱 Eco-Friendly Options","💰 Best Prices Guaranteed",
  ]

  return (
    <div className="min-h-screen bg-background font-sans">

      {/* HERO */}
      <section className="pub-hero">
        <div id="hero-track" className="pub-hero__track">
          {heroImages.map((img, i) => (
            <div key={i} className="pub-hero__slide">
              <div className="pub-hero__bg" style={{ backgroundImage: `url(${img})` }} />
              <div className="pub-hero__overlay" />
            </div>
          ))}
        </div>
        <div className="pub-hero__content">
          <div className="pub-hero__inner">
            <div className="pub-hero__badge">
              <Badge className="bg-primary/90 text-white px-4 py-1.5 text-xs uppercase tracking-widest border-none shadow-lg backdrop-blur-sm">
                <Sprout className="h-3.5 w-3.5 mr-1.5 inline" />{t("welcome_to_business")}
              </Badge>
            </div>
            <h1 className="pub-hero__title">
              {t("cultivating")}<br /><span className="pub-shimmer">{t("better_tomorrows")}</span>
            </h1>
            <p className="pub-hero__sub">{t("hero_desc")}</p>
            <div className="pub-hero__btns">
              <Button asChild size="lg" className="pub-btn bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 px-7 text-sm font-bold shadow-xl shadow-primary/30">
                <Link to="/products">{t("explore_products")} <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="pub-btn bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 rounded-2xl h-12 px-7 text-sm font-bold">
                <Link to="/contact"><Phone className="mr-2 h-4 w-4" />{t("contact_experts")}</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="pub-hero__dots">
          {heroImages.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`pub-hero__dot ${i === slide ? "pub-hero__dot--active" : ""}`}
              style={{ width: i === slide ? 24 : 7 }} />
          ))}
        </div>
        <button className="pub-hero__arrow pub-hero__arrow--left" onClick={() => goTo((slide - 1 + heroImages.length) % heroImages.length)}>‹</button>
        <button className="pub-hero__arrow pub-hero__arrow--right" onClick={() => goTo((slide + 1) % heroImages.length)}>›</button>
        <div className="pub-hero__fade-bottom" />
      </section>

      {/* TRUST STRIP */}
      <section className="py-3 border-y border-border/50 bg-muted/30 overflow-hidden">
        <div className="pub-marquee-track">
          {[0, 1].map(ri => (
            <div key={ri} className="pub-marquee-inner">
              {trustItems.map((item, i) => <span key={i}>{item}</span>)}
            </div>
          ))}
        </div>
      </section>

      {/* OFFER BANNER */}
      <section className="py-12 container mx-auto px-4">
        <FadeUp>
          <div className="pub-offer">
            <div className="pub-offer__dot-grid" /><div className="pub-offer__glow-a" /><div className="pub-offer__glow-b" />
            <div className="pub-offer__body">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20 text-yellow-300 text-xs font-bold uppercase tracking-wider">
                  <Zap className="h-3.5 w-3.5 animate-pulse fill-current" />{t("exclusive_offer")}
                </div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">{t("save_percent")}</h2>
                <p className="text-white/70 text-sm leading-relaxed">{t("maximize_efficiency")}</p>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button asChild size="default" className="pub-btn bg-yellow-400 text-primary hover:bg-yellow-300 rounded-xl h-11 px-6 font-bold shadow-xl">
                    <Link to="/products?category=Fertilizers">{t("claim_now")}</Link>
                  </Button>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">{t("ends_in")}</span>
                    <div className="flex gap-2 text-base font-black tabular-nums">
                      {["02d","14h","45m"].map(v => <span key={v} className="pub-offer__timer-box">{v}</span>)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <img src={ureaImg} alt="Offer product" className="pub-offer__product-img" />
              </div>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* FEATURES */}
      <section className="py-16 container mx-auto px-4">
        <FadeUp className="text-center mb-10">
          <Badge variant="outline" className="mb-3 border-primary text-primary px-4 py-1 uppercase text-[10px] font-black tracking-widest">Why Krushi Kendra</Badge>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">Built for <span className="pub-shimmer">Farmers</span></h2>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <ScaleIn key={i} delay={i * 80}>
              <div className="pub-feature-card">
                <div className="pub-feature-icon"><f.icon className="h-7 w-7" /></div>
                <h3 className="text-base font-black text-foreground uppercase tracking-tight mb-2">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </ScaleIn>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="pub-stats">
        <div className="pub-stats__dot-grid" /><div className="pub-stats__glow" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { end:5000, suffix:"+", label:"Happy Farmers" },
              { end:10,   suffix:"+", label:"Years Experience" },
              { end:200,  suffix:"+", label:"Products Available" },
              { end:20,   suffix:"+", label:"Areas Served" },
            ].map((s, i) => (
              <FadeUp key={i} delay={i * 100}>
                <div className="pub-stat-item">
                  <p className="pub-stat-num"><CountUp end={s.end} suffix={s.suffix} duration={1600} delay={i * 120} /></p>
                  <p className="pub-stat-label">{s.label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <FadeUp className="flex justify-between items-end mb-12">
            <div>
              <Badge variant="outline" className="mb-3 border-primary text-primary px-4 py-1 uppercase text-[10px] font-black tracking-widest">Collections</Badge>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase leading-none">{t("shop_by_category")}</h2>
              <div className="h-1 w-16 bg-primary rounded-full mt-3" />
            </div>
            <Button variant="ghost" asChild className="hidden md:flex text-primary font-bold text-sm">
              <Link to="/products">View All <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <SlideIn key={cat.id} delay={i * 90} direction={i % 2 === 0 ? "left" : "right"}>
                <Link to={`/products?category=${cat.name}`} className="pub-cat-card">
                  <div className="pub-cat-overlay" />
                  <img src={getCategoryImage(i)} alt={cat.name} />
                  <div className="pub-cat-info">
                    <p className="pub-cat-name">{cat.name}</p>
                    <div className="pub-cat-bar" />
                    <p className="pub-cat-count">{cat._count?.products || 0} products</p>
                  </div>
                </Link>
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <FadeUp className="text-center mb-14">
            <Badge className="bg-accent text-accent-foreground px-4 py-1 uppercase text-[10px] font-black tracking-widest border-none mb-3">Just In</Badge>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase">{t("new_arrivals")}</h2>
          </FadeUp>
          <StaggerList className="grid grid-cols-1 md:grid-cols-2 gap-5" stagger={80}>
            {newArrivals.map(product => (
              <div key={product.id} className="pub-arrival-card">
                <Badge className="absolute top-3 left-3 z-10 bg-primary text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border-none">New</Badge>
                <div className="pub-arrival-card__img"><img src={getProductImage(product)} alt={product.name} /></div>
                <div className="flex-1 pl-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-0.5">{product.category?.name}</p>
                  <h3 className="text-sm font-black uppercase tracking-tight line-clamp-1 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-black">₹{product.sellingPrice}</p>
                    <Button asChild size="sm" variant="ghost" className="h-8 rounded-xl px-3 text-[11px] font-bold text-primary hover:bg-primary/10">
                      <Link to="/products">{t("buy_now")}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </StaggerList>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4">
          <FadeUp className="flex flex-col md:flex-row justify-between items-center mb-14 gap-4">
            <div className="text-center md:text-left">
              <Badge variant="outline" className="mb-3 border-primary/30 text-primary/70 px-4 py-1 uppercase text-[10px] font-black tracking-widest">Trending</Badge>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase">{t("best_sellers")}</h2>
            </div>
            <Button asChild size="default" className="pub-btn bg-primary text-white hover:bg-primary/90 rounded-full px-6 h-10 text-sm font-bold shadow-lg">
              <Link to="/products">Shop All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {products.slice(0, 3).map((product, i) => (
              <ScaleIn key={product.id} delay={i * 100}>
                <div className="pub-product-card">
                  <div className="pub-product-card__img-wrap aspect-[4/3] bg-muted/30 relative">
                    <img src={getProductImage(product)} alt={product.name} className="mix-blend-multiply dark:mix-blend-normal p-8" />
                    <div className="absolute top-5 right-5 z-10">
                      <Badge className={`shadow px-3 py-0.5 rounded-full text-[10px] font-bold border-none ${product.currentStock > 10 ? "bg-green-500 text-white" : "bg-destructive text-white"}`}>
                        {product.currentStock > 10 ? t("available") : t("limited")}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-7">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-black uppercase tracking-tight line-clamp-1 mb-0.5">{product.name}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{product.category?.name}</p>
                      </div>
                      <div className="text-right ml-3 shrink-0">
                        <p className="text-xl font-black text-primary">₹{product.sellingPrice}</p>
                        <p className="text-[9px] text-muted-foreground">per {product.unit}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-6 line-clamp-2 leading-relaxed">{product.description}</p>
                    <div className="flex items-center justify-between pt-5 border-t border-border/50">
                      <div className="flex items-center gap-1.5 text-xs text-green-600 font-bold">
                        <CheckCircle className="h-3.5 w-3.5" /> {t("authentic")}
                      </div>
                      <Button size="sm" asChild className="pub-btn bg-primary hover:bg-primary/90 text-white rounded-xl px-5 h-9 text-xs font-bold">
                        <Link to="/products">{t("view")}</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </ScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="pub-services">
        <div className="pub-services__glow-a" /><div className="pub-services__glow-b" /><div className="pub-services__dot-grid" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <SlideIn direction="left">
              <div className="space-y-7">
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-xs font-bold uppercase tracking-widest">{t("why_choose_us")}</div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">{t("comprehensive_agri_services")}</h2>
                <p className="text-white/75 text-sm leading-relaxed">{t("agri_services_desc")}</p>
                <div className="space-y-4">
                  {[
                    { icon: Leaf, title: t("organic_solutions"),  desc: t("organic_solutions_desc"), bg:"bg-green-100", col:"text-green-700" },
                    { icon: Zap,  title: t("modern_equipment"),   desc: t("modern_equipment_desc"),  bg:"bg-blue-100",  col:"text-blue-700"  },
                  ].map((s, i) => (
                    <div key={i} className="pub-service-item">
                      <div className={`pub-service-icon ${s.bg}`}><s.icon className={`h-5 w-5 ${s.col}`} /></div>
                      <div>
                        <h3 className="font-black text-base uppercase tracking-tight mb-1">{s.title}</h3>
                        <p className="text-white/65 text-sm">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SlideIn>
            <SlideIn direction="right">
              <div className="relative">
                <div className="pub-services__img-wrap">
                  <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop" alt="Farm" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <ScaleIn delay={350}>
                  <div className="pub-floating-stat">
                    <div className="bg-primary/10 p-2.5 rounded-xl text-primary"><Users className="h-5 w-5" /></div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Happy Farmers</p>
                      <p className="text-xl font-black tracking-tight">5,000+</p>
                    </div>
                  </div>
                </ScaleIn>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 container mx-auto px-4">
        <FadeUp>
          <div className="pub-cta">
            <div className="pub-cta__glow" /><div className="pub-cta__dot-grid" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-6">{t("ready_to_transform")}</h2>
              <p className="text-white/75 text-base leading-relaxed mb-10 max-w-xl mx-auto">{t("join_thousands")}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="pub-btn bg-white text-primary hover:bg-white/90 rounded-full h-12 px-10 text-sm font-bold shadow-xl">
                  <Link to="/products">{t("shop_now")} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="pub-btn bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-full h-12 px-10 text-sm font-bold backdrop-blur-sm">
                  <Link to="/contact">{t("get_expert_advice")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  )
}
