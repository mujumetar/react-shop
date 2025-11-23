import React, { useState, useEffect } from 'react';
import { Menu, X, Truck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from "../assets/logo2.jpg";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname.toLowerCase();
  const isActive = (path) => currentPath === path || currentPath.includes(path);

  const handleNav = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <style jsx>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .logo-gradient {
          background: linear-gradient(90deg, #1e40af, #3b82f6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .nav-link-hover {
          position: relative;
        }
        .nav-link-hover::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -6px;
          left: 50%;
          background: #3b82f6;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        .nav-link-hover:hover::after {
          width: 70%;
        }
        .track-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          transition: all 0.3s ease;
        }
        .track-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.35);
        }
      `}</style>

      {/* Main Header - Always Visible */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg'
          : 'bg-white/90 backdrop-blur-md'
        }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleNav('/')}
          >
            <div className='flex items-end'>
              <img src={logo} alt="Dilkhush" className='w-20 h-10 rounded-xl ' />
              <p className="text-xs text-gray-500 -mt-1 w-full text-end font-bold font-primary">.Shop</p>
            </div>
          </div>

          {/* Desktop Menu - Hidden on Mobile */}
          <nav className="hidden lg:flex items-center space-x-10">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNav(item.path)}
                className={`text-gray-700 font-medium text-lg transition-all duration-300 nav-link-hover ${isActive(item.path) ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
                  }`}
              >
                {item.name}
              </button>
            ))}

            <button
              onClick={() => handleNav('/track-order')}
              className="track-btn text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg"
            >
              <Truck size={20} />
              Track Order
            </button>
          </nav>

          {/* Mobile Menu Toggle - Only Visible on Mobile */}
          <button
            className="lg:hidden text-gray-800 z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu - Slides Down */}
      <div className={`fixed top-0 left-0 right-0 bg-white shadow-2xl z-40 lg:hidden transition-all duration-500 ease-out ${mobileMenuOpen
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0 pointer-events-none'
        }`}>
        <div className="px-6 py-6 pt-20"> {/* pt-20 to avoid header overlap */}
          <nav className="space-y-y-4">
            {navItems.map((item, i) => (
              <button
                key={item.name}
                onClick={() => handleNav(item.path)}
                className={`block my-2 w-full text-left text-2xl font-medium py-4 px-6 rounded-xl transition-all ${isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
                style={{ animation: mobileMenuOpen ? `fadeInUp 0.5s ease-out ${i * 0.1}s both` : '' }}
              >
                {item.name}
              </button>
            ))}

            <button
              onClick={() => handleNav('/track-order')}
              className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xl font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 track-btn"
            >
              <Truck size={24} />
              Track Order
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;