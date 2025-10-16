import { Link } from 'react-router-dom';
import { ShoppingCart, Store, TrendingUp, Users, CheckCircle, Leaf, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import heroPaddyField from '@/assets/hero-paddy-field.jpg';

const Index = () => {
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
    { name: 'Vegetables', count: '150+ items', color: 'bg-primary' },
    { name: 'Fruits', count: '80+ items', color: 'bg-secondary' },
    { name: 'Rice & Grains', count: '40+ items', color: 'bg-accent' },
    { name: 'Spices', count: '60+ items', color: 'bg-primary' }
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
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroPaddyField})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        
        <div className="container relative mx-auto flex h-full items-center px-4">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="mb-6 font-poppins text-5xl font-bold text-white md:text-6xl">
              Connecting Sri Lankan Farmers with Smart Buyers
            </h1>
            <p className="mb-8 text-xl text-white/90">
              Fresh from the Field — Fair Prices, Quality Assured
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/catalog">
                <Button size="lg" variant="secondary" className="font-medium">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Start Buying
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
                  <Store className="mr-2 h-5 w-5" />
                  Join as Farmer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-poppins text-4xl font-bold">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="group transition-all hover:shadow-lg animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-poppins text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-poppins text-4xl font-bold">Product Categories</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <Card key={index} className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={`mb-4 h-2 w-16 rounded-full ${category.color}`} />
                  <h3 className="mb-1 font-poppins text-xl font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-poppins text-4xl font-bold">What People Say</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <p className="mb-4 italic text-foreground">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-hero py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 font-poppins text-4xl font-bold">Ready to Get Started?</h2>
          <p className="mb-8 text-xl text-white/90">Join thousands of farmers and buyers on AgriLink Lanka</p>
          <Link to="/login">
            <Button size="lg" variant="secondary">
              Sign In Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 AgriLink Lanka. Connecting farmers with buyers across Sri Lanka.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
