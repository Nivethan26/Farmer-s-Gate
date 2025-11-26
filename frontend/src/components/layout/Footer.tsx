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
  Heart
} from "lucide-react";

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
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  return (
    <footer className="border-t border-emerald-100 bg-gradient-to-b from-white via-emerald-50/30 to-white">
      <div className="w-full px-6 md:px-12 py-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr]">
          {/* Company Info Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg">
                <Sprout className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-emerald-900">AgriLink Lanka</span>
            </div>
            <p className="text-base text-emerald-900/75 leading-relaxed">
              Connecting Sri Lankan farmers and mindful buyers with fair pricing, fresh harvests, and transparent trade.
            </p>

            <div className="grid gap-2.5 text-base text-emerald-900/70">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>Colombo, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>+94 77 123 4567</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>hello@agrilinklanka.lk</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-200 bg-white text-emerald-600 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-lg hover:shadow-emerald-100"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-emerald-700">Company</h4>
              <ul className="space-y-3 text-base text-emerald-900/75">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="transition-colors duration-200 hover:text-emerald-800 hover:font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-emerald-700">Support</h4>
              <ul className="space-y-3 text-base text-emerald-900/75">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="transition-colors duration-200 hover:text-emerald-800 hover:font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-emerald-700">Legal</h4>
              <ul className="space-y-3 text-base text-emerald-900/75">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="transition-colors duration-200 hover:text-emerald-800 hover:font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-10 border-t border-emerald-100 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-emerald-900/70">
            <p>&copy; {year} AgriLink Lanka. All rights reserved.</p>
            <p className="flex items-center gap-2">
              Made with
              <Heart className="h-4 w-4 text-emerald-600" />
              <span className="hidden sm:inline">for Sri Lankan farmers</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;