import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Store, TrendingUp, Users, CheckCircle, Leaf, Package, ArrowRight, Sprout, HandCoins, Heart, Shield, Clock, Award, Star, Quote, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
// Keep local images as fallback
import heroPaddyField from '@/assets/hero-paddy-field.jpg';
import freshProduce from '@/assets/fresh-produce.jpg';
import {Navbar} from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useEffect, useState } from 'react';
const Index = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-play implementation
  useEffect(() => {
    const autoplay = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 4);
    }, 5000);

    return () => clearInterval(autoplay);
  }, []);

  // Unique farmer and agriculture product related images
  const heroImages = [
    {
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&q=80',
      alt: 'Fresh organic vegetables at farmer market',
      gradient: 'from-black/70 via-black/35 to-transparent'
    },
    {
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80',
      alt: 'Farmer harvesting rice in paddy field',
      gradient: 'from-black/70 via-black/35 to-transparent'
    },
    {
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80',
      alt: 'Fresh fruits and vegetables display',
      gradient: 'from-black/70 via-black/35 to-transparent'
    },
    {
      image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1920&q=80',
      alt: 'Organic farm with fresh produce',
      gradient: 'from-black/70 via-black/35 to-transparent'
    }
  ];

  const features = [
    {
      icon: Store,
      title: 'Direct from Farmers',
      description: 'Connect directly with local farmers for the freshest produce'
    },
    {
      icon: TrendingUp,
      title: 'Fair Pricing',
      description: 'Transparent pricing that benefits both farmers and buyers'
    },
    {
      icon: Package,
      title: 'Quality Assured',
      description: 'All products are verified for quality and freshness'
    }
  ];

  const categories = [
    { name: 'Vegetables', count: '150+ items', color: 'bg-emerald-500', emoji: '🥬', icon: Leaf },
    { name: 'Fruits', count: '80+ items', color: 'bg-orange-500', emoji: '🍎', icon: Sprout },
    { name: 'Rice & Grains', count: '40+ items', color: 'bg-amber-500', emoji: '🌾', icon: Package },
    { name: 'Spices', count: '60+ items', color: 'bg-red-500', emoji: '🌶️', icon: Sparkles }
  ];

  const testimonials = [
    {
      name: 'Nimal Perera',
      role: 'Farmer, Kandy',
      text: 'AgriLink helped me reach more customers and get better prices for my harvest.'
    },
    {
      name: 'Amara Silva',
      role: 'Restaurant Owner, Colombo',
      text: 'Fresh produce delivered daily. The quality is exceptional and prices are fair.'
    }
  ];

  return (
    <div className="min-h-screen bg-background font-inter">
    <Navbar />
      {/* Hero Section with Image Slider and Static Text */}
      <section className="relative h-[70vh] min-h-[500px] md:h-[85vh] overflow-hidden">
        {/* Background Image Slider */}
        {heroImages.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              currentImageIndex === index ? 'opacity-100 z-0' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image with Zoom Animation */}
            <img 
              src={item.image}
              alt={item.alt}
              className="absolute inset-0 w-full h-full object-cover animate-subtle-zoom"
              loading="eager"
            />
            {/* Gradient Overlay - Darker on left for better text contrast, transparent on right for image visibility */}
            <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient}`} />
            {/* Additional darker overlay just behind text area */}
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-black/30 to-transparent" />
          </div>
        ))}

        {/* Static Content Overlay */}
        <div className="container relative mx-auto flex h-full items-center px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-3xl animate-fade-in">
            {/* Badge */}
            <div className="mb-3 md:mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 md:px-4 md:py-2 backdrop-blur-sm">
              <Leaf className="h-3 w-3 md:h-4 md:w-4 text-green-300" />
              <span className="text-xs md:text-sm font-medium text-white">100% Organic & Fresh</span>
            </div>
            
            {/* Main Heading - Static */}
            <h1 className="mb-3 md:mb-4 font-poppins text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-2xl">
              Connecting Farmers with Smart Buyers
            </h1>
            
            {/* Subtitle - Static */}
            <p className="mb-6 md:mb-8 text-base sm:text-lg md:text-xl text-white/95 font-light max-w-2xl drop-shadow-lg">
              Fresh from the Field — Fair Prices, Quality Assured
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/signup')}
                className="group bg-white text-primary hover:bg-white/90 font-semibold text-sm sm:text-base px-5 sm:px-6 py-5 sm:py-6 shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
              >
                <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Buy Fresh Produce
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                size="lg" 
                onClick={() => navigate('/signup')}
                variant="outline" 
                className="group border-2 border-white bg-white/10 text-white hover:bg-white hover:text-primary backdrop-blur-sm font-semibold text-sm sm:text-base px-5 sm:px-6 py-5 sm:py-6 shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Store className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Sell Your Harvest
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            {/* Stats */}
            <div className="mt-8 md:mt-12 grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl">
              <div className="text-center sm:text-left">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-0.5 md:mb-1">500+</div>
                <div className="text-[10px] sm:text-xs md:text-sm text-white/80 leading-tight">Active Farmers</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-0.5 md:mb-1">2000+</div>
                <div className="text-[10px] sm:text-xs md:text-sm text-white/80 leading-tight">Happy Buyers</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-0.5 md:mb-1">100%</div>
                <div className="text-[10px] sm:text-xs md:text-sm text-white/80 leading-tight">Organic</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block z-10">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-scroll"></div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-8 md:py-12 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-green-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-6 md:mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-full mb-4 font-semibold text-sm shadow-lg">
              <Zap className="h-4 w-4" />
              Simple Process
            </div>
            <h2 className="font-poppins text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">How It Works</h2>
            <p className="text-gray-600 text-base md:text-xl max-w-2xl mx-auto font-medium">Get started in three easy steps</p>
          </div>
          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-2xl md:max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all" />
                
                {/* Step number badge - top right */}
                <div className="absolute top-3 right-3 md:top-5 md:right-5 z-10">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-sm md:text-lg font-bold text-white">{index + 1}</span>
                  </div>
                </div>

                <CardContent className="p-5 md:p-7 relative">
                  {/* Icon container */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4 md:mb-5">
                      {/* Icon glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                      <div className="relative rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-3 md:p-4 shadow-xl group-hover:shadow-2xl transition-all group-hover:scale-110 duration-300">
                        <feature.icon className="h-6 w-6 md:h-10 md:w-10 text-white" />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-poppins text-base md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 text-gray-900 group-hover:text-green-600 transition-colors">
                      {feature.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-xs md:text-sm lg:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
                
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 md:py-12 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 right-10 w-32 h-32 bg-orange-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-amber-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-6 md:mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-5 py-2.5 rounded-full mb-4 font-semibold text-sm shadow-lg">
              <Package className="h-4 w-4" />
              Wide Selection
            </div>
            <h2 className="font-poppins text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-orange-700 to-amber-700 bg-clip-text text-transparent">Product Categories</h2>
            <p className="text-gray-600 text-base md:text-xl font-medium">Browse our fresh, organic products</p>
          </div>
          <div className="grid gap-4 md:gap-5 grid-cols-2 md:grid-cols-4 max-w-2xl md:max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <Card key={index} className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <CardContent className="p-4 md:p-6 relative text-center">
                  {/* Emoji container with color background */}
                  <div className={`mb-3 md:mb-4 mx-auto inline-flex items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl ${category.color} shadow-lg group-hover:shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-3`}>
                    <span className="text-2xl md:text-4xl">{category.emoji}</span>
                  </div>
                  
                  {/* Category name */}
                  <h3 className="mb-1 md:mb-2 font-poppins text-sm md:text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{category.name}</h3>
                  
                  {/* Item count */}
                  <p className="text-gray-600 text-xs md:text-sm font-semibold mb-2 md:mb-3">{category.count}</p>
                  
                  {/* Arrow indicator */}
                  <div className="flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-orange-600 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2" />
                  </div>
                </CardContent>
                
                {/* Bottom gradient accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-foreground px-4 py-2 rounded-full mb-3 font-medium text-sm">
              <Heart className="h-4 w-4" />
              Customer Stories
            </div>
            <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-2">What People Say</h2>
            <p className="text-muted-foreground text-base md:text-lg">Trusted by farmers and buyers across Sri Lanka</p>
          </div>
          <div className="grid gap-4 md:gap-6 md:grid-cols-2 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-accent/30 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-primary to-secondary" />
                <CardContent className="p-5 md:p-6">
                  <Quote className="h-8 w-8 md:h-10 md:w-10 text-accent/20 mb-3" />
                  <div className="flex gap-0.5 md:gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 md:h-5 md:w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 md:mb-6 text-sm md:text-base leading-relaxed text-foreground">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-base md:text-lg shadow-lg flex-shrink-0">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm md:text-base">{testimonial.name}</p>
                      <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaC0ydjJoMnYtMmgydi0yaC0yek0zMiAzOHYtMmgtMnYyaDJ6bTAtNHYyaC0ydi0yaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6 font-medium">
              <Sparkles className="h-4 w-4" />
              Join Our Community
            </div>
            <h2 className="mb-4 md:mb-6 font-poppins text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-tight">
              Ready to Get Started?
            </h2>
            <p className="mb-6 md:mb-10 text-base sm:text-lg md:text-xl text-white/95 leading-relaxed">
              Join thousands of farmers and buyers on AgriLink Lanka
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full group font-semibold text-sm md:text-base px-6 md:px-8 py-5 md:py-6 shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary font-semibold text-sm md:text-base px-6 md:px-8 py-5 md:py-6 shadow-2xl transition-all duration-300 hover:scale-105">
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="mt-8 md:mt-12 grid grid-cols-3 gap-3 sm:gap-8 text-white max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 md:mb-1">500+</div>
                <div className="text-[10px] sm:text-xs md:text-sm text-white/80 leading-tight">Active Farmers</div>
              </div>
              <div className="text-center border-x border-white/20">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 md:mb-1">2000+</div>
                <div className="text-[10px] sm:text-xs md:text-sm text-white/80 leading-tight">Happy Buyers</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 md:mb-1">100%</div>
                <div className="text-[10px] sm:text-xs md:text-sm text-white/80 leading-tight">Organic</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
