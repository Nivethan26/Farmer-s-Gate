import { Link } from 'react-router-dom';
import { Sprout, Users, Target, Award, Globe, Heart, ArrowRight, CheckCircle, Leaf, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const About = () => {
  const missionStats = [
    { number: '5000+', label: 'Farmers Connected' },
    { number: '25000+', label: 'Happy Customers' },
    { number: '100+', label: 'Cities Covered' },
    { number: '98%', label: 'Satisfaction Rate' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Farmer First',
      description: 'We prioritize the welfare and prosperity of our farming community above all else.'
    },
    {
      icon: Target,
      title: 'Sustainability',
      description: 'Promoting eco-friendly farming practices and sustainable agricultural methods.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building strong connections between farmers, buyers, and local communities.'
    },
    {
      icon: Award,
      title: 'Quality',
      description: 'Ensuring only the highest quality produce reaches our customers.'
    },
    {
      icon: Globe,
      title: 'Innovation',
      description: 'Leveraging technology to transform traditional agricultural practices.'
    },
    {
      icon: CheckCircle,
      title: 'Transparency',
      description: 'Maintaining complete transparency in pricing and transactions.'
    }
  ];

  const team = [
    {
      name: 'Saman Perera',
      role: 'Founder & CEO',
      image: '',
      description: 'Agricultural entrepreneur with 15+ years in farming technology'
    },
    {
      name: 'Nimali Fernando',
      role: 'Head of Operations',
      image: '',
      description: 'Former agricultural officer with deep community connections'
    },
    {
      name: 'Kamal Rajapaksa',
      role: 'Technology Lead',
      image: '',
      description: 'Tech innovator passionate about agricultural transformation'
    },
    {
      name: 'Anoma Silva',
      role: 'Farmer Relations',
      image: '',
      description: 'Agricultural scientist dedicated to farmer empowerment'
    }
  ];

  const milestones = [
    { year: '2020', event: 'AgriLink Lanka Founded', description: 'Started with a vision to connect farmers directly with buyers' },
    { year: '2021', event: 'First 1000 Farmers', description: 'Reached milestone of 1000 registered farmers across Sri Lanka' },
    { year: '2022', event: 'Mobile App Launch', description: 'Launched our mobile application for better accessibility' },
    { year: '2023', event: 'National Expansion', description: 'Expanded services to cover all provinces in Sri Lanka' },
    { year: '2024', event: 'Award Recognition', description: 'Received National Agricultural Innovation Award' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-emerald-50 font-inter">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-emerald-700/10">
          <div className="absolute top-10 left-10 animate-float">
            <Leaf className="h-16 w-16 text-green-300/40" />
          </div>
          <div className="absolute bottom-10 right-10 animate-float-delayed">
            <Sun className="h-20 w-20 text-amber-300/30" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative">
          <Badge className="mb-6 bg-green-100 text-green-700 border-0 px-4 py-2">
            Our Story
          </Badge>
          <h1 className="mb-6 font-poppins text-4xl md:text-6xl font-bold text-gray-900">
            Growing Together, <span className="bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">Building Futures</span>
          </h1>
          <p className="mb-8 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            AgriLink Lanka was born from a simple vision: to create a sustainable ecosystem where 
            Sri Lankan farmers get fair prices and consumers get fresh, quality produce directly from the source.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Get In Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/catalog">
              <Button size="lg" variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
                Explore Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4 text-green-600 border-green-200 bg-green-50">
                Our Mission
              </Badge>
              <h2 className="mb-6 font-poppins text-3xl md:text-4xl font-bold text-gray-900">
                Revolutionizing Sri Lankan Agriculture
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We're on a mission to transform the agricultural landscape of Sri Lanka by creating 
                direct connections between farmers and buyers, eliminating middlemen, and ensuring 
                fair compensation for hardworking farmers.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Through technology and community, we're building a sustainable future where 
                agriculture thrives and everyone has access to fresh, quality produce.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {missionStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-2xl">
                <Sprout className="h-12 w-12 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-lg leading-relaxed">
                  To create a self-sustaining agricultural ecosystem where every farmer in Sri Lanka 
                  has direct market access, receives fair prices, and can focus on what they do best - 
                  growing quality produce for the nation.
                </p>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-400 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-amber-600 border-amber-200 bg-amber-50">
              Our Values
            </Badge>
            <h2 className="mb-4 font-poppins text-3xl md:text-4xl font-bold text-gray-900">
              What We Stand For
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our core values guide everything we do and every decision we make
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <Card 
                key={index}
                className="group border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
              >
                <CardContent className="p-8 text-center">
                  <div className="inline-flex rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-4 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-4 font-poppins text-xl font-semibold text-gray-900">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200 bg-blue-50">
              Our Team
            </Badge>
            <h2 className="mb-4 font-poppins text-3xl md:text-4xl font-bold text-gray-900">
              Meet The Dream Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate individuals dedicated to transforming Sri Lankan agriculture
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <Card 
                key={index}
                className="group border-0 bg-gradient-to-br from-gray-50 to-white shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 text-center"
              >
                <CardContent className="p-6">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="font-poppins text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-green-600 text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-green-600 border-green-200 bg-green-50">
              Our Journey
            </Badge>
            <h2 className="mb-4 font-poppins text-3xl md:text-4xl font-bold text-gray-900">
              Milestones & Achievements
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start mb-12 last:mb-0">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-6">
                  {milestone.year}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.event}</h3>
                  <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 font-poppins text-3xl md:text-4xl font-bold">
            Join Our Agricultural Revolution
          </h2>
          <p className="mb-8 text-xl text-white/90 max-w-2xl mx-auto">
            Whether you're a farmer looking to reach more customers or a buyer seeking fresh produce, 
            we have a place for you in our growing community.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="bg-white text-green-700 hover:bg-white/90">
                Join Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-green-700 hover:bg-white/10">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;