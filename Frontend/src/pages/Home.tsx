import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Sprout,
  Shield,
  Recycle,
  Users,
  Leaf,
  Zap,
  ArrowRight,
  CheckCircle,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import hero1 from "@/assets/hero1.webp";
import hero2 from "@/assets/hero2.webp";
import hero3 from "@/assets/hero3.webp";
import hero4 from "@/assets/hero4.webp";

// Product Images
import cottonImg from "@/assets/cotton.webp";
import soyaImg from "@/assets/soya.webp";
import ureaImg from "@/assets/uera.avif";
import dapImg from "@/assets/DAP.png";
import potashImg from "@/assets/potash.jfif";
import calarisImg from "@/assets/calaris.jpg";

import { useEffect, useState } from "react";
import { productsAPI, categoriesAPI, Product, Category } from "@/services/api";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);

  const heroImages = [hero1, hero2, hero3, hero4];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          productsAPI.getAllProducts({ limit: 6 }), // Increased limit to show more variety if possible
          categoriesAPI.getAllCategories(),
        ]);

        if (productsRes.data.success) {
          setProducts(productsRes.data.data.products);
        }
        if (categoriesRes.data.success) {
          setCategories(categoriesRes.data.data.categories.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Sprout,
      title: "Quality Products",
      description: "Premium fertilizers, seeds, and tools for better yields",
    },
    {
      icon: Shield,
      title: "Trusted Brands",
      description: "Authentic products from certified manufacturers",
    },
    {
      icon: Recycle,
      title: "Eco-Friendly",
      description: "Sustainable and environmentally friendly farming solutions",
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Agricultural experts to guide your farming journey",
    },
  ];

  const services = [
    {
      icon: Leaf,
      title: "Organic Solutions",
      description: "Eco-friendly farming products for sustainable agriculture",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Zap,
      title: "Modern Equipment",
      description: "Latest farming tools and machinery for efficient farming",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ];

  // Helper to get product image based on name or fallback
  const getProductImage = (product: Product) => {
    const name = product.name.toLowerCase();
    if (name.includes("cotton")) return cottonImg;
    if (name.includes("soya") || name.includes("bean")) return soyaImg;
    if (name.includes("urea")) return ureaImg;
    if (name.includes("dap")) return dapImg;
    if (name.includes("potash")) return potashImg;
    if (name.includes("calaris") || name.includes("sync")) return calarisImg;

    // Fallbacks
    const images = [
      "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622383563227-044011358d42?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=1000&auto=format&fit=crop",
    ];
    // Use SKU or ID to consistently pick a random image
    const index = name.length + (product.sku?.length || 0);
    return images[index % images.length];
  };

  const getCategoryImage = (index: number) => {
    const images = [
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=1000&auto=format&fit=crop",
    ];
    return images[index % images.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const newArrivals = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

  return (
    <div className="min-h-screen bg-background font-sans transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-[85vh] overflow-hidden">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === slide ? "opacity-100" : "opacity-0"
              }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-[10000ms]"
              style={{ backgroundImage: `url(${img})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </div>
        ))}

        <div className="relative z-10 h-full container mx-auto px-4 flex flex-col justify-center items-start">
          <div className="max-w-3xl animate-fade-in-up">
            <Badge className="mb-6 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 text-sm uppercase tracking-wider shadow-lg border-none">
              Welcome to Krushi Seva Kendra
            </Badge>
            <h1 className="text-lg md:text-2xl font-black text-white mb-4 leading-tight drop-shadow-lg uppercase tracking-tight">
              Cultivating <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Better Tomorrows
              </span>
            </h1>
            <p className="text-base text-gray-200 mb-6 max-w-xl leading-relaxed drop-shadow-md font-medium">
              Empowering farmers with premium quality agricultural inputs, expert guidance,
              and sustainable solutions for maximum yield.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="default"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 h-8 text-xs rounded-xl transition-all hover:scale-[1.02] shadow-lg hover:shadow-primary/20 font-bold uppercase tracking-widest"
              >
                <Link to="/products">
                  Explore Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="default"
                className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 px-6 h-8 text-xs rounded-xl transition-all hover:scale-[1.02] font-bold uppercase tracking-widest"
              >
                <Link to="/contact">Contact Experts</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Banner - E-commerce Style */}
      <section className="py-12 container mx-auto px-4 relative z-20">
        <div className="bg-gradient-to-br from-primary via-primary to-emerald-900 rounded-[1.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-strong border border-white/10 group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-[80px] group-hover:bg-white/20 transition-colors"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-[9px] font-black uppercase tracking-widest text-yellow-400">
                <Zap className="h-3.5 w-3.5 animate-pulse fill-current" /> Exclusive Seasonal Offer
              </div>
              <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter leading-none mb-2">
                Save <span className="text-yellow-400">25%</span> on <br className="hidden md:block" /> Fertilizer Bundles
              </h2>
              <p className="text-white/70 font-bold text-[10px] md:text-xs italic uppercase tracking-widest leading-relaxed">
                Maximize harvest efficiency with premium crop nutrition.
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <Button asChild size="default" className="bg-yellow-400 text-primary hover:bg-yellow-500 rounded-xl h-8 px-5 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-95">
                  <Link to="/products?category=Fertilizers">Claim Now</Link>
                </Button>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-black tracking-widest opacity-60 mb-0.5">Ends in</span>
                  <div className="flex gap-2 text-sm font-black tracking-tighter tabular-nums">
                    <span className="bg-black/20 px-2 py-0.5 rounded-lg">02d</span>
                    <span className="bg-black/20 px-2 py-0.5 rounded-lg">14h</span>
                    <span className="bg-black/20 px-2 py-0.5 rounded-lg">45m</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px]"></div>
              <img
                src={ureaImg}
                alt="Offer Product"
                className="h-48 md:h-56 object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)] transform -rotate-6 group-hover:rotate-0 transition-transform duration-1000 ease-out"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-none shadow-soft bg-card hover:bg-accent/5 hover:shadow-strong hover:-translate-y-2 transition-all duration-300 rounded-[2rem] overflow-hidden group"
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary shadow-inner group-hover:scale-110 transition-transform">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-black text-foreground uppercase tracking-tight mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-xs font-bold italic">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <Badge variant="outline" className="mb-4 border-primary text-primary px-4 py-1 uppercase font-black text-[10px] tracking-widest">Collections</Badge>
              <h2 className="text-lg md:text-2xl font-black text-foreground mb-4 tracking-tighter uppercase leading-none">
                Shop by Category
              </h2>
              <div className="h-1.5 w-20 bg-primary rounded-full mb-4"></div>
              <p className="text-muted-foreground text-sm font-bold italic uppercase tracking-wider">
                Find exactly what you need for your farm
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex text-primary hover:text-primary hover:bg-primary/5 font-black uppercase tracking-widest text-xs">
              <Link to="/products">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link key={category.id} to={`/products?category=${category.name}`} className="group">
                <div className="relative overflow-hidden rounded-[2.5rem] aspect-[4/5] mb-4 shadow-soft group-hover:shadow-strong transition-all">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                  <img
                    src={getCategoryImage(index)}
                    alt={category.name}
                    className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">{category.name}</h3>
                    <div className="h-1 w-0 group-hover:w-16 bg-primary rounded-full transition-all duration-500"></div>
                    <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {category._count?.products || 0} Products available
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals - E-commerce Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <Badge className="bg-accent text-accent-foreground px-4 py-1 uppercase font-black text-[10px] tracking-widest border-none">Just In</Badge>
            <h2 className="text-lg md:text-2xl font-black text-foreground tracking-tighter uppercase leading-none">
              New Arrivals
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm font-bold italic uppercase tracking-wider">
              Explore the latest agricultural innovations added to our inventory this week
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {newArrivals.map((product) => (
              <Card
                key={product.id}
                className="group flex flex-row items-center overflow-hidden border-none shadow-soft hover:shadow-strong transition-all duration-500 bg-card rounded-[1.5rem] relative p-6 h-40"
              >
                <div className="absolute top-3 left-3 z-30">
                  <Badge className="bg-primary text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border-none shadow-lg">New Arrival</Badge>
                </div>

                <div className="w-1/3 h-full relative overflow-hidden rounded-xl bg-muted/30">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="h-full w-full object-contain p-2 transform group-hover:scale-110 transition-transform duration-700 mix-blend-multiply dark:mix-blend-normal"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="w-2/3 pl-8 flex flex-col justify-center gap-2">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-primary/60">{product.category?.name}</p>
                    <h3 className="text-sm font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-lg font-black text-foreground tabular-nums tracking-tighter">
                      ₹{product.sellingPrice}
                    </p>
                    <Button asChild size="sm" variant="ghost" className="h-8 rounded-lg px-3 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10">
                      <Link to="/products">Buy Now</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <div className="text-center md:text-left">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary/70 px-4 py-1 uppercase font-black text-[10px] tracking-widest">Trending</Badge>
              <h2 className="text-lg md:text-2xl font-black text-foreground tracking-tighter uppercase leading-none">
                Best Sellers
              </h2>
            </div>
            <Button asChild size="default" className="bg-primary text-white hover:bg-primary/90 px-6 h-8 rounded-full text-xs shadow-lg font-black uppercase tracking-widest transition-all hover:scale-105">
              <Link to="/products">
                Shop All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden border-none shadow-soft hover:shadow-strong transition-all duration-300 bg-card rounded-[2.5rem]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal dark:opacity-80 p-8 transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 right-6 z-10">
                    <Badge
                      className={`${product.currentStock > 10
                        ? "bg-success text-success-foreground"
                        : "bg-destructive text-destructive-foreground"
                        } shadow-lg px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-none`}
                    >
                      {product.currentStock > 10 ? "Available" : "Limited"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-lg font-black text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1 uppercase tracking-tight">
                        {product.name}
                      </h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{product.category?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-primary tabular-nums tracking-tighter">
                        ₹{product.sellingPrice}
                      </p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">per {product.unit}</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-[11px] font-bold italic mb-8 line-clamp-2 min-h-[35px] leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-muted">
                    <div className="flex items-center text-[10px] text-success font-black uppercase tracking-widest">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Authentic
                    </div>
                    <Button size="sm" asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 h-9 font-black uppercase tracking-widest text-[10px]">
                      <Link to="/products">View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white rounded-full blur-[150px] opacity-10"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-accent rounded-full blur-[150px] opacity-15"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white font-black text-[10px] uppercase tracking-[0.2em]">
                Why Choose Us
              </div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none">
                Comprehensive <br /> <span className="text-yellow-400">Agri Services</span>
              </h2>
              <p className="text-white/80 text-sm font-bold italic leading-relaxed">
                We go beyond just selling products. Our team is dedicated to
                providing the knowledge and modern tools you need to succeed.
              </p>

              <div className="space-y-4">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <div key={index} className="flex items-start space-x-6 bg-white/5 p-4 rounded-[1.5rem] hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 group">
                      <div className={`flex-shrink-0 h-12 w-12 rounded-xl ${service.bgColor} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-6 w-6 ${service.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-md font-black mb-1 uppercase tracking-tight">{service.title}</h3>
                        <p className="text-white/70 text-xs font-bold italic">{service.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-4 bg-white/10 rounded-[3rem] blur-3xl transform rotate-3 scale-105"></div>
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/10 group">
                <img
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop"
                  alt="Farmer in field"
                  className="w-full transform group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-2xl shadow-strong border border-primary/5 hidden md:block">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[8px] font-black uppercase tracking-widest mb-0.5">Happy Farmers</p>
                    <p className="text-lg font-black text-foreground tracking-tighter tabular-nums leading-none">5,000+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="bg-gradient-to-br from-primary via-primary to-emerald-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-strong">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white opacity-10 rounded-full blur-[120px]"></div>

          <div className="relative z-10 max-w-4xl mx-auto space-y-10">
            <h2 className="text-lg md:text-2xl font-black text-white mb-8 leading-none tracking-tighter uppercase">
              Ready to Transform <br /> Your Farming?
            </h2>
            <p className="text-base md:text-lg text-white/80 mb-12 max-w-2xl mx-auto font-bold italic leading-relaxed">
              Join thousands of satisfied farmers who trust Krushi Seva Kendra for
              their agricultural needs. Experience quality and reliability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="default" className="bg-white text-primary hover:bg-gray-100 px-8 h-8 text-sm rounded-full shadow-lg hover:scale-105 transition-all font-black uppercase tracking-widest">
                <Link to="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="default"
                className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 px-8 h-8 text-sm rounded-full backdrop-blur-sm font-black uppercase tracking-widest"
              >
                <Link to="/contact">Get Expert Advice</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
