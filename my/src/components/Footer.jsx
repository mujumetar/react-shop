import React from 'react';
import { ShoppingBasket, MapPin, Phone, Mail, ArrowRight, Instagram, Heart, InstagramIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo2.jpg"
const Footer = () => {
  const navigate = useNavigate();

  const handleQuickLink = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms & Conditions', path: '/terms-conditions' },
  ];

  return (
    <footer className=" border-t  relative overflow-hidden">
      {/* Subtle background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96  translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {/* <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
              <Heart/>
              </div> */}
             <img src={logo} alt="" className='w-20 h-10'/>
            </div>
            <p className="text-gray-600 text-start leading-relaxed text-sm md:text-base">
              Your trusted modern grocery store offering premium quality products with seamless online ordering and lightning-fast delivery to your doorstep.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://www.instagram.com/dilkhush_kirana" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:border-pink-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
              >
                <InstagramIcon className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="flex items-center text-lg font-bold text-gray-800">
              <div className="w-1 h-6 bg-emerald-500 rounded mr-3" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleQuickLink(link.path)}
                    className="flex items-center text-gray-600 hover:text-emerald-600 text-sm font-medium transition-all duration-200 hover:pl-4 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 ml-[-16px] group-hover:ml-0 mr-2 text-emerald-500 transition-all" />
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 flex flex-col">
            <h4 className="flex items-center text-lg font-bold text-gray-800">
              <div className="w-1 h-6 bg-emerald-500 rounded mr-3" />
              Get In Touch
            </h4>
            
            {/* Location */}
            <div className="flex items-start space-x-4 p-3 bg-emerald-50/50 rounded-lg hover:bg-emerald-50 transition-colors">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium text-start">Location</p>
                <p className="text-gray-800 font-medium">Dhasa Jn.</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-4 p-3 bg-blue-50/50 rounded-lg hover:bg-blue-50 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium text-start">Phone</p>
                <div className="space-y-1">
                  <a href="tel:9723089786" className="text-gray-800 font-medium block hover:text-blue-600 transition-colors">+91 9723089786</a>
                  <a href="tel:9033332365" className="text-gray-800 font-medium block hover:text-blue-600 transition-colors">+91 9033332365</a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4 p-3 bg-purple-50/50 rounded-lg hover:bg-purple-50 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium text-start">Email</p>
                <a href="mailto:mustakmetar82@gmail.com" className="text-gray-800 font-medium hover:text-purple-600 transition-colors">mustakmetar82@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm text-center md:text-left">
              © 2025 Dilkhush. All rights reserved. Made with <span className="text-red-500">♥</span>
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <button onClick={() => handleQuickLink('/privacy-policy')} className="hover:text-emerald-600 transition-colors">Privacy Policy</button>
              <span className="text-gray-300">|</span>
              <button onClick={() => handleQuickLink('/terms-conditions')} className="hover:text-emerald-600 transition-colors">Terms of Service</button>
              <span className="text-gray-300">|</span>
              <button onClick={() => handleQuickLink('/refund-policy')} className="hover:text-emerald-600 transition-colors">Refund Policy</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;