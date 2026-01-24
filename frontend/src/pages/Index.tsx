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
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // High-quality agriculture and farming related images
  const heroImages = [
    {
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=95',
      alt: 'Rice paddy field with farmer working',
      gradient: 'from-black/70 via-black/35 to-transparent'
    },
    {
      image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1920&q=95',
      alt: 'Organic farm fresh vegetables',
      gradient: 'from-black/70 via-black/35 to-transparent'
    },
    {
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&q=95',
      alt: 'Green agricultural field landscape',
      gradient: 'from-black/70 via-black/35 to-transparent'
    },
    {
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=95',
      alt: 'Fresh produce from farm to market',
      gradient: 'from-black/70 via-black/35 to-transparent'
    },
    {
      image: 'https://images.unsplash.com/photo-1472061427342-a9b64ad6ea1c?w=1920&q=95',
      alt: 'Bountiful harvest of vegetables',
      gradient: 'from-black/70 via-black/35 to-transparent'
    },
    {
      image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1920&q=95',
      alt: 'Field of crops in agricultural landscape',
      gradient: 'from-black/70 via-black/35 to-transparent'
    },
    {
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=95',
      alt: 'Greenhouse agriculture and farming',
      gradient: 'from-black/70 via-black/35 to-transparent'
    },
    {
      image: 'https://images.unsplash.com/photo-1597934376847-072ba347626a?w=1920&q=95',
      alt: 'Agricultural field with produce',
      gradient: 'from-black/70 via-black/35 to-transparent'
    }
  ];

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const promises = heroImages.map((img) => {
        return new Promise((resolve) => {
          const image = new window.Image();
          image.onload = resolve;
          image.onerror = resolve;
          image.src = img.image;
        });
      });
      await Promise.all(promises);
      setImagesLoaded(true);
    };
    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-play implementation
  useEffect(() => {
    const autoplay = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 8);
    }, 4000);

    return () => clearInterval(autoplay);
  }, []);

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
    { name: 'Vegetables', count: '150+ items', color: 'bg-emerald-500', emoji: '🥬', image: '/images/vegetables.png' },
    { name: 'Fruits', count: '80+ items', color: 'bg-orange-500', emoji: '🍎', image: '/images/fruits.png' },
    { name: 'Rice & Grains', count: '40+ items', color: 'bg-amber-500', emoji: '🌾', image: '/images/rice.png' },
    { name: 'Spices', count: '60+ items', color: 'bg-red-500', emoji: '🌶️', image: '/images/Spices.png' }
  ];

  const testimonials = [
    {
      name: 'Nimal Perera',
      role: 'Organic Farm Owner, Kandy',
      text: 'AgriLink Lanka transformed our sales process. We now reach customers nationwide, increased revenue by 45%, and secured fair pricing for our premium harvests. The platform eliminated middlemen completely.'
    },
    {
      name: 'Amara Silva',
      role: 'Executive Chef, Colombo',
      text: 'Exceptional quality produce delivered fresh daily. Our ingredient costs decreased by 30% while maintaining premium standards. The direct farmer connection has been invaluable for our operations.'
    }
  ];

  return (
    <div className="min-h-screen bg-background font-inter">
    <Navbar />
      {/* Hero Section with Image Slider and Static Text */}
      <section className="relative overflow-hidden" style={{ height: '60vh', minHeight: '450px' }}>
        {/* Background Image Slider */}
        {heroImages.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              currentImageIndex === index ? 'opacity-100 z-0' : 'opacity-0 z-[-1]'
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
        <div className="relative mx-auto flex h-full items-center z-10" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
          <div className="max-w-4xl w-full animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm" style={{ marginBottom: '16px', gap: '8px', paddingLeft: '12px', paddingRight: '12px', paddingTop: '6px', paddingBottom: '6px' }}>
              <Leaf className="h-3 w-3 text-green-300" />
              <span className="text-xs md:text-sm font-medium text-white">100% Organic & Fresh</span>
            </div>
            
            {/* Main Heading - Static */}
            <h2 className="font-poppins text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-2xl" style={{ marginBottom: '10px' }}>
              Connecting Farmers with Smart Buyers
            </h2>
            
            {/* Subtitle - Static */}
            <p className="text-base sm:text-lg md:text-xl text-white/95 font-light max-w-2xl drop-shadow-lg leading-relaxed" style={{ marginBottom: '22px' }}>
              Fresh - Fair Price - Quality Assured
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center" style={{ gap: '8px', marginBottom: '40px' }}>
              <Button 
                size="lg" 
                onClick={() => navigate('/signup')}
                className="group bg-white text-primary hover:bg-white/90 font-semibold text-sm sm:text-base shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 rounded-xl flex items-center justify-center"
                style={{ width: '280px', height: '56px' }}
              >
                <ShoppingCart className="mr-1 h-5 w-5 sm:h-6 sm:w-6" />
                Buy Fresh Products
                <ArrowRight className="ml-1 h-5 w-3 group-hover:translate-x-0 transition-transform" />
              </Button>
              
              <Button 
                size="lg" 
                onClick={() => navigate('/signup')}
                variant="outline" 
                className="group border-2 border-white bg-white/10 text-white hover:bg-white hover:text-primary backdrop-blur-sm font-semibold text-sm sm:text-base shadow-2xl transition-all duration-300 hover:scale-100 rounded-xl flex items-center justify-center"
                style={{ width: '280px', height: '56px' }}
              >
                <Store className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                Sell Your Harvest
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 max-w-2xl" style={{ marginTop: '30px', gap: '32px' }}>
              <div className="text-left">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white" style={{ marginBottom: '4px' }}>500+</div>
                <div className="text-xs sm:text-sm md:text-base text-white/80 leading-relaxed font-medium">Active Farmers</div>
              </div>
              <div className="text-left">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white" style={{ marginBottom: '4px' }}>2000+</div>
                <div className="text-xs sm:text-sm md:text-base text-white/80 leading-relaxed font-medium">Happy Buyers</div>
              </div>
              <div className="text-left">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white" style={{ marginBottom: '4px' }}>100%</div>
                <div className="text-xs sm:text-sm md:text-base text-white/80 leading-relaxed font-medium">Organic</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute left-1/2 -translate-x-1/2 animate-bounce hidden md:block z-10" style={{ bottom: '32px' }}>
          <div className="border-2 border-white/50 rounded-full flex items-start justify-center" style={{ width: '24px', height: '40px', padding: '8px' }}>
            <div className="bg-white/50 rounded-full animate-scroll" style={{ width: '4px', height: '12px' }}></div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden" style={{ paddingTop: '35px', paddingBottom: '10px' }}>
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute bg-green-400 rounded-full blur-3xl" style={{ top: '40px', left: '40px', width: '128px', height: '128px' }}></div>
          <div className="absolute bg-emerald-400 rounded-full blur-3xl" style={{ bottom: '40px', right: '40px', width: '160px', height: '160px' }}></div>
        </div>
        
        <div className="container mx-auto relative" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
          <div className="text-center" style={{ marginBottom: '20px' }}>
           
            <h2 className="font-poppins text-3xl md:text-5xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent" style={{ marginBottom: '10px' }}>How It Works</h2>
            <p className="text-gray-600 text-base md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">Get started in three easy steps</p>
          </div>
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3" style={{ gap: '10px' }}>
            {features.map((feature, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all" />
                
                {/* Step number badge - top right */}
                <div className="absolute z-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" style={{ top: '12px', right: '12px', width: '32px', height: '32px' }}>
                  <span className="text-sm font-bold text-white">{index + 1}</span>
                </div>

                <CardContent className="relative" style={{ padding: '15px' }}>
                  {/* Icon container */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative" style={{ marginBottom: '15px' }}>
                      {/* Icon glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                      <div className="relative rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl group-hover:shadow-2xl transition-all group-hover:scale-110 duration-300" style={{ padding: '16px' }}>
                        <feature.icon className="h-7 w-7 md:h-12 md:w-12 text-white" />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-poppins text-lg md:text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors leading-tight" style={{ marginBottom: '10px' }}>
                      {feature.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
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
      <section className="bg-gradient-to-b from-white via-green-50/30 to-white relative overflow-hidden" style={{ paddingTop: '0px', paddingBottom: '34px' }}>
        {/* Animated decorative background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bg-green-400 rounded-full blur-3xl animate-pulse-slow" style={{ top: '80px', right: '80px', width: '256px', height: '256px' }}></div>
          <div className="absolute bg-emerald-400 rounded-full blur-3xl animate-pulse-slow" style={{ bottom: '80px', left: '80px', width: '320px', height: '320px', animationDelay: '1s' }}></div>
          <div className="absolute bg-lime-300 rounded-full blur-3xl animate-pulse-slow" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '288px', height: '288px', animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto relative" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
          <div className="text-center" style={{ marginBottom: '20px' }}>
            
            <h2 className="font-poppins text-3xl md:text-5xl font-bold bg-gradient-to-r from-green-700 via-emerald-700 to-green-800 bg-clip-text text-transparent animate-fade-in" style={{ marginBottom: '15px', marginTop: '15px', animationDelay: '0.1s' }}>Shop by Category</h2>
            <p className="text-gray-600 text-base md:text-xl font-medium leading-relaxed max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>Discover fresh, organic products from local farmers</p>
          </div>
          <div className="flex justify-center" style={{ marginLeft: '0px', marginRight: '18px' }}>
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '24px', width: 'fit-content' }}>
            {categories.map((category, index) => (
              <Card key={index} className="group cursor-pointer relative overflow-hidden border-2 border-green-100 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${index * 0.1}s`, width: '165px', height: '200px' }}>
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
                
                <CardContent className="relative text-center" style={{ padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  {/* Image container with enhanced effects */}
                  <div className="relative mx-auto inline-block" style={{ marginBottom: '5px' }}>
                    {/* Pulsing glow effect */}
                    <div className={`absolute inset-0 ${category.color} rounded-full blur-2xl opacity-30 group-hover:opacity-50 animate-pulse-slow`} />
                    
                    {/* Main image container */}
                    <div className={`relative rounded-3xl ${category.color} shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 flex items-center justify-center overflow-hidden`} style={{ width: '125px', height: '106px' }}>
                      {/* Image shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl z-20" />
                      
                      {/* Category Image */}
                      <img src={category.image} alt={category.name} className="w-full h-full object-cover rounded-3xl transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    
                    {/* Corner accent badges */}
                    <div className="absolute rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600" style={{ top: '-4px', right: '-4px', width: '16px', height: '16px' }}>
                      <CheckCircle className="w-full h-full text-white p-0.5" />
                    </div>
                  </div>
                  
                  {/* Category name */}
                  <h3 className="font-poppins text-lg md:text-2xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300 leading-tight" style={{ marginBottom: '10px' }}>
                    {category.name}
                  </h3>
                  
                  {/* Item count with enhanced styling */}
                  <div className="inline-flex items-center bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 group-hover:border-green-300 group-hover:from-green-100 group-hover:to-emerald-100 transition-all duration-300 rounded-full" style={{ gap: '8px', paddingLeft: '16px', paddingRight: '16px', paddingTop: '6px', paddingBottom: '6px' }}>
                    <Sprout className="h-3 w-3 text-green-600" />
                    <p className="text-gray-700 text-xs md:text-sm font-bold">{category.count}</p>
                  </div>
                </CardContent>
                
                {/* Bottom accent line with glow */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 shadow-lg shadow-green-500/50" style={{ height: '6px' }} />
                
                {/* Side accent line on hover */}
                <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-b from-green-500 to-emerald-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500" style={{ width: '2px' }} />
              </Card>
            ))}
          </div>
            </div>
          
          {/* Bottom CTA */}
          <div className="text-center" style={{ marginTop: '28px' }}>
            <Link to="/catalog" className="group inline-flex items-center text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" style={{ gap: '8px', paddingLeft: '32px', paddingRight: '32px', paddingTop: '16px', paddingBottom: '16px' }}>
              <Package className="h-5 w-5 group-hover:scale-110 transition-transform" />
              View All Products
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-b from-background to-muted/30" style={{ paddingTop: '10px', paddingBottom: '28px' }}>
        <div className="container mx-auto" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <div className="text-center" style={{ marginBottom: '25px' }}>
            <h2 className="font-poppins text-3xl md:text-5xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent" style={{ marginBottom: '16px' }}>Trusted by Industry Leaders</h2>
            <p className="text-gray-600 text-base md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">Real results from farmers and buyers transforming their businesses</p>
          </div>
          <div className="grid md:grid-cols-2 max-w-5xl mx-auto" style={{ gap: '15px' }}>
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-accent/30 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-accent via-primary to-secondary" style={{ height: '4px' }} />
                <CardContent style={{ padding: '20px' }}>
                  <Quote className="text-accent/20" style={{ marginBottom: '12px', width: '32px', height: '32px' }} />
                  <div className="flex gap-2 md:gap-4" style={{ marginBottom: '12px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm md:text-base leading-relaxed text-foreground" style={{ marginBottom: '16px' }}>"{testimonial.text}"</p>
                  <div className="flex items-center" style={{ gap: '12px' }}>
                    <div className="rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0" style={{ width: '40px', height: '40px', fontSize: '16px' }}>
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm md:text-base">{testimonial.name}</p>
                      <p className="text-xs md:text-sm text-muted-foreground flex items-center" style={{ gap: '4px' }}>
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
      <section className="relative overflow-hidden" style={{ paddingTop: '20px', paddingBottom: '28px' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaC0ydjJoMnYtMmgydi0yaC0yek0zMiAzOHYtMmgtMnYyaDJ6bTAtNHYyaC0ydi0yaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="container mx-auto text-center relative" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="font-poppins text-3xl md:text-5xl font-bold text-white leading-tight" style={{ marginBottom: '16px' }}>
              Ready to Transform Your Business?
            </h2>
            
            <div className="flex flex-col sm:flex-row justify-center items-center" style={{ gap: '12px', marginBottom: '32px' }}>
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full group font-semibold text-sm md:text-base shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 rounded-xl" style={{ padding: '16px 24px' }}>
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/catalog" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary font-semibold text-sm md:text-base shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl" style={{ padding: '16px 24px' }}>
                  Browse Products
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-3 text-white max-w-lg mx-auto" style={{ gap: '16px' }}>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ marginBottom: '2px' }}>500+</div>
                <div className="text-[10px] sm:text-xs md:text-sm text-white/80 leading-tight">Active Farmers</div>
              </div>
              <div className="text-center border-x border-white/20">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ marginBottom: '2px' }}>2000+</div>
                <div className="text-[10px] sm:text-xs md:text-sm text-white/80 leading-tight">Happy Buyers</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ marginBottom: '2px' }}>100%</div>
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
