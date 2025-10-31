import React from "react";
import { Link } from "react-router-dom";
import { 
  Sprout, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Heart,
  Send,
  Leaf
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/story" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" }
    ],
    support: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faq" },
      { label: "Shipping Info", href: "/shipping" }
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Refund Policy", href: "/refunds" }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook", color: "hover:text-blue-600" },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-500" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-600" },
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-700" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-t border-green-200/50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-500 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-500 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-green-400 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Floating leaves decoration */}
      <div className="absolute top-8 left-20 opacity-10 animate-float">
        <Leaf className="w-12 h-12 text-green-600 transform rotate-12" />
      </div>
      <div className="absolute top-20 right-32 opacity-10 animate-float" style={{ animationDelay: '1s' }}>
        <Leaf className="w-10 h-10 text-emerald-600 transform -rotate-45" />
      </div>

      <div className="relative container mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 rounded-2xl shadow-lg">
                  <Sprout className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                AgriLink Lanka
              </span>
            </div>
            <p className="text-green-700/80 text-sm mb-4 leading-relaxed">
              Connecting farmers with buyers across Sri Lanka. Fresh, sustainable, and direct from the source.
            </p>
            
            {/* Contact info */}
            <div className="space-y-2 text-sm text-green-700/70">
              <div className="flex items-center gap-2 group">
                <MapPin className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
                <span>Colombo, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2 group">
                <Phone className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
                <span>+94 77 123 4567</span>
              </div>
              <div className="flex items-center gap-2 group">
                <Mail className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
                <span>hello@agrilinklanka.lk</span>
              </div>
            </div>
          </div>

          {/* Company links */}
          <div>
            <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-sm text-green-700/70 hover:text-green-600 transition-colors hover:translate-x-1 inline-block transform duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
              Support
            </h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-sm text-green-700/70 hover:text-green-600 transition-colors hover:translate-x-1 inline-block transform duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-sm text-green-700/70 hover:text-green-600 transition-colors hover:translate-x-1 inline-block transform duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-green-200/50 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-green-800 mb-1 flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-5 h-5 text-green-600" />
                Subscribe to our Newsletter
              </h3>
              <p className="text-sm text-green-700/70">Get fresh updates and exclusive offers delivered to your inbox.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input 
                type="email" 
                placeholder="your@email.com" 
                className="bg-white border-green-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl"
              />
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl shadow-lg hover:shadow-xl transition-all group">
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-green-200/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-sm text-green-700/70 flex items-center gap-1">
              <span>&copy; {year} AgriLink Lanka. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
              <span>in Sri Lanka</span>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center text-green-600 ${social.color} border border-green-200/50 hover:border-green-300 transition-all hover:scale-110 hover:shadow-lg group`}
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Eco badge */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full border border-green-300/30 backdrop-blur-sm">
            <Leaf className="w-4 h-4 text-green-600 animate-pulse" />
            <span className="text-xs font-medium text-green-700">100% Eco-Friendly Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;