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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
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
            <Badge className="mb-6 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 text-sm uppercase tracking-wider shadow-lg">
              Welcome to Krushi Seva Kendra
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
              Cultivating <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-300">
                Better Tomorrows
              </span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed drop-shadow-md">
              Empowering farmers with premium quality agricultural inputs, expert guidance,
              and sustainable solutions for maximum yield.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full transition-all hover:scale-105 shadow-xl hover:shadow-green-500/30 font-semibold"
              >
                <Link to="/products">
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-full transition-all hover:scale-105 font-semibold"
              >
                <Link to="/contact">Contact Experts</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 container mx-auto px-4 -mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-none shadow-xl bg-white/95 backdrop-blur hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-2xl overflow-hidden"
              >
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center mb-6 text-green-600 shadow-inner">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                Shop by Category
              </h2>
              <div className="h-1 w-20 bg-green-500 rounded-full mb-4"></div>
              <p className="text-gray-600 text-lg">
                Find exactly what you need for your farm
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex text-green-700 hover:text-green-800 hover:bg-green-50">
              <Link to="/products">View All Categories <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link key={category.id} to={`/products?category=${category.name}`} className="group">
                <div className="relative overflow-hidden rounded-3xl aspect-[4/5] mb-4 shadow-md group-hover:shadow-xl transition-all">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <img
                    src={getCategoryImage(index)}
                    alt={category.name}
                    className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                    <div className="h-1 w-0 group-hover:w-12 bg-green-500 rounded-full transition-all duration-300"></div>
                    <p className="text-white/80 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {category._count?.products || 0} Products
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-green-600 text-green-600 px-4 py-1">Featured Items</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
              Best Selling Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover our most popular agricultural solutions trusted by farmers across the region
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="h-full w-full object-contain mix-blend-multiply p-4 transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 z-10">
                    <Badge
                      className={`${product.currentStock > 10
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                        } text-white border-none shadow-md px-3 py-1`}
                    >
                      {product.currentStock > 10 ? "In Stock" : "Low Stock"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">{product.category?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-700">
                        ₹{product.sellingPrice}
                      </p>
                      <p className="text-xs text-gray-400">per {product.unit}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-6 line-clamp-2 min-h-[40px]">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-green-600 font-medium">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Quality Assured
                    </div>
                    <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white transition-colors rounded-full px-6">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button asChild size="lg" className="bg-green-600 text-white hover:bg-green-700 px-10 py-6 rounded-full text-lg shadow-lg hover:shadow-green-500/30">
              <Link to="/products">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-[#0a2e1d] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-green-500 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] opacity-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 font-medium text-sm mb-6">
                Why Choose Us
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Comprehensive <br /> <span className="text-green-400">Agricultural Services</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                We go beyond just selling products. Our team of experts is dedicated to
                providing you with the knowledge, modern tools, and support you need to succeed in modern farming.
              </p>

              <div className="space-y-6">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <div key={index} className="flex items-start space-x-6 bg-white/5 p-6 rounded-2xl hover:bg-white/10 transition-all border border-white/5 hover:border-green-500/30">
                      <div className={`flex-shrink-0 h-14 w-14 rounded-2xl ${service.bgColor} flex items-center justify-center shadow-lg`}>
                        <Icon className={`h-7 w-7 ${service.color}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-white">{service.title}</h3>
                        <p className="text-gray-300">{service.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-green-500/30 rounded-3xl blur-2xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop"
                alt="Farmer in field"
                className="relative rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 border-4 border-white/10"
              />

              {/* Floating Stat Card */}
              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl max-w-xs animate-bounce-slow hidden md:block">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full text-green-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Happy Farmers</p>
                    <p className="text-2xl font-bold text-gray-900">5,000+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-green-700 to-emerald-800 rounded-[2.5rem] p-8 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-white opacity-5 rounded-full blur-[100px]"></div>

            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-6xl font-extrabold text-white mb-8 leading-tight">
                Ready to Transform <br /> Your Farming?
              </h2>
              <p className="text-xl text-green-100 mb-12 max-w-2xl mx-auto">
                Join thousands of satisfied farmers who trust Krushi Seva Kendra for
                their agricultural needs. Experience quality and reliability.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button asChild size="lg" className="bg-white text-green-800 hover:bg-gray-100 px-10 py-7 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 font-bold">
                  <Link to="/products">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 px-10 py-7 text-lg rounded-full backdrop-blur-sm font-semibold"
                >
                  <Link to="/contact">Get Expert Advice</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
