import { Github, Instagram, Linkedin, Twitter, Mail, MapPin, Phone, Globe, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-600' },
  { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
  { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-600' },
  { name: 'GitHub', icon: Github, href: '#', color: 'hover:text-gray-900' }
];

const contactInfo = [
  { 
    icon: Mail, 
    text: 'hello@stylero.com', 
    href: 'mailto:hello@stylero.com',
    color: 'group-hover:text-indigo-600'
  },
  { 
    icon: Phone, 
    text: '+1 (555) 123-4567', 
    href: 'tel:+15551234567',
    color: 'group-hover:text-green-600'
  },
  { 
    icon: Globe, 
    text: 'San Francisco, CA', 
    href: '#',
    color: 'group-hover:text-blue-600'
  }
];

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-white to-gray-50/50 border-t overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGMzLjE4IDAgNi4xNzUtLjgyNCA4Ljc3MS0yLjI3MSAyLjU5Ni0xLjQ0NyA0Ljc1NC0zLjYwNSA2LjIwMS02LjIwMUMzNS4xNzYgNDEuODI1IDM2IDM4LjgyOSAzNiAzNnMtLjgyNC02LjE3NS0yLjI3MS04Ljc3MWMtMS40NDctMi41OTYtMy42MDUtNC43NTQtNi4yMDEtNi4yMDFDMjUuODI1IDE4LjgyNCAyMi44MjkgMTggMTkuNSAxOHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-5" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/5 to-indigo-100/10" />
      </div>
      <div className="responsive-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Snapp</h3>
              <p className="text-gray-600/90 mb-4">
                Discover and shop similar fashion styles instantly with our AI-powered platform
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Contact Us</h4>
            <ul className="space-y-4">
              {contactInfo.map((item) => (
                <li key={item.text}>
                  <a
                    href={item.href}
                    className="group flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <span className={`p-2 bg-gray-50 rounded-full transition-colors ${item.color}`}>
                      <item.icon className="w-4 h-4" />
                    </span>
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {item.text}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href} 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 bg-gray-50/80 backdrop-blur-sm rounded-full text-gray-600 ${social.color} hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500/90">
              © {new Date().getFullYear()} Snapp. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-500/90 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-50/10 to-transparent blur-lg" />
              <a href="#" className="group flex items-center gap-1 hover:text-gray-900 transition-colors">
                Privacy Policy
                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
              </a>
              <a href="#" className="group flex items-center gap-1 hover:text-gray-900 transition-colors">
                Terms of Service
                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
              </a>
              <a href="#" className="group flex items-center gap-1 hover:text-gray-900 transition-colors">
                Contact
                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="group flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Newsletter
                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;