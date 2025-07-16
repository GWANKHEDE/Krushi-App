import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Sprout,
  Shield,
  Truck,
  Users,
  Leaf,
  Zap,
  ArrowRight,
  Star,
  CheckCircle,
} from "lucide-react";
import agricultureHero from "@/assets/agriculture-hero.jpg";
import hero1 from "@/assets/hero1.webp";
import hero2 from "@/assets/hero2.webp";
import hero3 from "@/assets/hero3.webp";
import hero4 from "@/assets/hero4.webp";

import { mockProducts } from "@/data/mockData";
import { useEffect, useState } from "react";

export default function Home() {
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
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick delivery to your farm within 24 hours",
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
      color: "success",
    },
    {
      icon: Zap,
      title: "Modern Equipment",
      description: "Latest farming tools and machinery for efficient farming",
      color: "info",
    },
  ];

  // Get featured products (first 3)
  const featuredProducts = mockProducts.slice(0, 3);

  const heroImages = [hero1, hero2, hero3, hero4];
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % heroImages.length);
    }, 3000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[80vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImages[slide]})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Empowering Farmers with
            <span className="text-accent block">
              Quality Agricultural Solutions
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Your one-stop destination for premium fertilizers, seeds, tools, and
            expert guidance to maximize your crop yields and farming success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90"
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
              className="bg-white/10 border-white text-white hover:bg-white/20"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Why Choose Wankhede Krushi Seva Kendra?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We are committed to supporting farmers with the best agricultural
              products and services
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground">
              Discover our top-quality agricultural products
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>{product.brand}</CardDescription>
                    </div>
                    <Badge
                      variant={product.stock > 10 ? "default" : "destructive"}
                    >
                      {product.stock > 10 ? "In Stock" : "Low Stock"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Price:
                      </span>
                      <span className="font-semibold">
                        ₹{product.price}/{product.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Available:
                      </span>
                      <span>
                        {product.stock} {product.unit}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success mr-2" />
                      Authentic & Quality Assured
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground">
              Comprehensive agricultural solutions for modern farming
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div
                        className={`h-12 w-12 rounded-full flex items-center justify-center ${
                          service.color === "success"
                            ? "bg-success/10"
                            : "bg-info/10"
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 ${
                            service.color === "success"
                              ? "text-success"
                              : "text-info"
                          }`}
                        />
                      </div>
                      <div>
                        <CardTitle>{service.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied farmers who trust Krushi Seva Kendra for
            their agricultural needs. Get started today and experience the
            difference quality makes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/products">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-black hover:bg-white/10"
            >
              <Link to="/contact">Get Expert Advice</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
