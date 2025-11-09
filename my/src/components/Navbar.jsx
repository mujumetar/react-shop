// import React from 'react'
// import logo from "../img/logo2.jpg"
// import { Link } from 'react-router-dom'
// import { Truck } from 'lucide-react'


// const Navbars = () => {
//     return (
//         <>
//             <header className='py-0'>
//                 <div className="container">
//                     <nav className="navbar navbar-expand-lg navbar-light">
//                         <div className="container-fluid">
//                             <a className="navbar-brand logo" >
//                                 <i className="fas fa-shopping-basket"></i>
//                                 <img src={logo} data-aos="flip-left" data-aos-duration="3000" className='img-fluid' style={{ width: '6rem' }} alt="" />
//                             </a>
//                             <button className="navbar-toggler btn-sm border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
//                                 aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
//                                 <span className="navbar-toggler-icon btn-sm"></span>
//                             </button>
//                             <div className="collapse navbar-collapse" id="navbarNav">
//                                 <ul className="navbar-nav ms-auto">
//                                     <li className="nav-item">
//                                         <Link className="nav-link active" to='/'>Home</Link>
//                                     </li>
//                                     <li className="nav-item">
//                                         <Link className="nav-link" to="/Products"  >Products</Link>
//                                     </li>
//                                     <li className="nav-item">
//                                         <Link className="nav-link" to="/about">About</Link>
//                                     </li>

//                                     {/* <li className="nav-item">
//                                         <Link className="nav-link" to="/offers" >Offers</Link>
//                                     </li> */}

//                                     <li className="nav-item">
//                                         <Link className="nav-link" to="/contact" >Contact</Link>
//                                     </li>
//                                     <li className="nav-item">
//                                         <a href="/track-order" className="nav-link">
//                                             <Truck size={18} className="me-1" /> Track Order
//                                         </a>
//                                     </li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </nav>
//                 </div>
//             </header>


//         </>
//     )
// }

// export default Navbars
import React, { useState, useEffect } from 'react';
import { Truck, Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbars = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Auto active link
  const currentPath = location.pathname.toLowerCase();
  const activeLink = 
    currentPath === '/' || currentPath === '/home' ? 'home' :
    currentPath.includes('products') ? 'products' :
    currentPath.includes('about') ? 'about' :
    currentPath.includes('blogs') ? 'blogs' :
    currentPath.includes('contact') ? 'contact' :
    currentPath.includes('track-order') ? 'track' : 'home';

  const handleNav = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setTimeout(() => window.scrollTo(0, 0), 100);
  };

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
    return () => document.body.style.overflow = 'unset';
  }, [mobileMenuOpen]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* ALL YOUR ORIGINAL STYLING + VERTICAL DROP-DOWN MENU */}
      <style>{`
        @keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes shimmer { 0% { background-position: -100px 0; } 100% { background-position: 300px 0; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

        .modern-navbar {
          background: #ffffff;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border-bottom: 1px solid transparent;
          position: sticky;
          top: 0;
          z-index: 10000000;
          animation: slideDown 0.6s ease-out;
        }
        .modern-navbar.scrolled {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border-bottom-color: #e5e7eb;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
        }
        .navbar-container { display: flex; align-items: center; justify-content: space-between; }

        .navbar-brand-modern {
          display: flex; align-items: center; text-decoration: none; gap: 12px;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer;
          animation: fadeIn 0.8s ease-out;
        }
        .navbar-brand-modern:hover { transform: scale(1.05) rotate(-2deg); }
        .navbar-brand-modern:hover .brand-logo-img { animation: pulse 0.6s ease-in-out; }
        .brand-logo-img {
          width: 65px; height: 65px; border-radius: 12px;
          transition: all 0.4s ease; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
          object-fit: cover;
        }
        .brand-text { display: flex; flex-direction: column; }
        .brand-name {
          font-size: 1.5rem; font-weight: 700;
          background: linear-gradient(135deg, #059669 0%, #2563eb 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; line-height: 1.2; margin: 0; position: relative; overflow: hidden;
        }
        .brand-name::after {
          content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
          animation: shimmer 3s infinite;
        }
        .brand-tagline { font-size: 0.75rem; color: #6b7280; margin: 0; animation: fadeIn 1s ease-out 0.3s both; }

        .nav-menu-desktop { display: flex; align-items: center; gap: 8px; list-style: none; margin: 0; padding: 0; }
        .nav-item-modern { position: relative; animation: fadeIn 0.6s ease-out backwards; }
        .nav-item-modern:nth-child(1) { animation-delay: 0.1s; }
        .nav-item-modern:nth-child(2) { animation-delay: 0.2s; }
        .nav-item-modern:nth-child(3) { animation-delay: 0.3s; }
        .nav-item-modern:nth-child(4) { animation-delay: 0.4s; }
        .nav-item-modern:nth-child(5) { animation-delay: 0.5s; }

        .nav-link-modern {
          color: #4b5563; text-decoration: none; padding: 10px 18px; border-radius: 10px;
          font-weight: 500; font-size: 0.95rem; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex; align-items: center; gap: 6px; position: relative; cursor: pointer; overflow: hidden;
        }
        .nav-link-modern::before {
          content: ''; position: absolute; top: 50%; left: 50%; width: 0; height: 0;
          border-radius: 50%; background: rgba(16, 185, 129, 0.1);
          transition: all 0.5s ease; transform: translate(-50%, -50%);
        }
        .nav-link-modern:hover::before { width: 200%; height: 200%; }
        .nav-link-modern:hover { color: #059669; background: #f0fdf4; transform: translateY(-2px); }
        .nav-link-modern.active { color: #059669; background: #d1fae5; transform: scale(1.05); }
        .nav-link-modern.active::after {
          content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 30px; height: 3px; background: #10b981; border-radius: 10px;
        }

      .track-order-btn {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 10px;
                    font-weight: 600;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                    margin-left: 12px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }

                .track-order-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    transition: left 0.5s ease;
                }

                .track-order-btn:hover::before {
                    left: 100%;
                }
                
                .track-order-btn:hover {
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
                    color: white;
                }

                .track-order-btn:hover .truck-icon {
                    animation: bounce 0.6s ease-in-out;
                }
                
        .mobile-menu-toggle {
          display: none; background: none; border: none; color: #4b5563; cursor: pointer;
          padding: 8px; border-radius: 10px; transition: all 0.3s ease;
        }
        .mobile-menu-toggle:hover { background: #f3f4f6; }

        /* VERTICAL DROP-DOWN MENU FROM TOP */
        .nav-menu-mobile {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: auto;
          max-height: 100vh;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          padding: 5rem 1.5rem 2rem;
          transform: translateY(-100%);
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1001;
          overflow-y: auto;
          display: none;
          flex-direction: column;
          align-items: center;
        }
        .nav-menu-mobile.open {
          transform: translateY(0);
          display: flex;
          animation: slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .mobile-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100vh;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s ease;
          display: none;
        }
        .mobile-overlay.open {
          opacity: 1;
          visibility: visible;
          display: block;
        }

        .mobile-menu-header {
          position: absolute;
          top: 1rem; left: 1rem; right: 1rem;
          display: flex; justify-content: space-between; align-items: center;
          padding: 1rem 0;
          border-bottom: 2px solid #e5e7eb;
          z-index: 1002;
        }
        .mobile-close-btn {
          background: #f3f4f6; border: none; color: #4b5563; cursor: pointer;
          padding: 10px; border-radius: 12px; transition: all 0.3s ease;
        }
        .mobile-close-btn:hover {
          background: #ef4444; color: white; transform: rotate(90deg);
        }

        .mobile-nav-list {
          list-style: none; padding: 0; margin: 2rem 0 0; width: 100%; max-width: 400px;
        }
        .mobile-nav-list li {
          margin: 12px 0;
          animation: fadeIn 0.6s ease-out backwards;
        }
        .mobile-nav-list li:nth-child(1) { animation-delay: 0.1s; }
        .mobile-nav-list li:nth-child(2) { animation-delay: 0.2s; }
        .mobile-nav-list li:nth-child(3) { animation-delay: 0.3s; }
        .mobile-nav-list li:nth-child(4) { animation-delay: 0.4s; }
        .mobile-nav-list li:nth-child(5) { animation-delay: 0.5s; }

        .mobile-nav-link {
          color: #4b5563; text-decoration: none; padding: 18px 24px; border-radius: 16px;
          font-weight: 600; font-size: 1.1rem; display: block; text-align: center;
          transition: all 0.4s ease; background: #f8f9fa; box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .mobile-nav-link:hover, .mobile-nav-link.active {
          background: #d1fae5; color: #059669; transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.2);
        }

        @media (max-width: 991px) {
          .nav-menu-desktop { display: none; }
          .mobile-menu-toggle, .mobile-overlay { display: block; }
        }
        @media (max-width: 576px) {
          .brand-tagline { display: none; }
          .mobile-nav-link { padding: 20px; font-size: 1.2rem; }
        }
      `}</style>

      <header className={`modern-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-container">
            {/* Brand */}
            <a href="/" className="navbar-brand-modern" onClick={(e) => { e.preventDefault(); handleNav('/'); }}>
              {/* <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop" alt="Dilkhush Logo" className="brand-logo-img" /> */}
              {/* <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop" alt="Dilkhush Logo" className="" /> */}
              <div className="brand-text">
                <h1 className="brand-name">Dilkhush</h1>
                <p className="brand-tagline">Fresh & Quality</p>
              </div>
            </a>

            {/* Desktop Menu */}
            <ul className="nav-menu-desktop">
              <li className="nav-item-modern"><a href="/" className={`nav-link-modern ${activeLink === 'home' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNav('/'); }}>Home</a></li>
              <li className="nav-item-modern"><a href="/Products" className={`nav-link-modern ${activeLink === 'products' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNav('/Products'); }}>Products</a></li>
              <li className="nav-item-modern"><a href="/blogs" className={`nav-link-modern ${activeLink === 'blogs' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNav('/blogs'); }}>Blogs</a></li>
              <li className="nav-item-modern"><a href="/about" className={`nav-link-modern ${activeLink === 'about' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNav('/about'); }}>About</a></li>
              <li className="nav-item-modern"><a href="/contact" className={`nav-link-modern ${activeLink === 'contact' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNav('/contact'); }}>Contact</a></li>

              <li className="nav-item-modern"><a href="/track-order" className="track-order-btn" onClick={(e) => { e.preventDefault(); handleNav('/track-order'); }}><Truck className='bounce '/> Track Order</a></li>
            </ul>

            {/* Hamburger */}
            <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Overlay */}
        <div className={`mobile-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)} />

        {/* VERTICAL DROP-DOWN MENU */}
        <nav className={`nav-menu-mobile ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-header">
            <h3 className="brand-name" style={{ fontSize: '2rem' }}>Dilkhush</h3>
            <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>
              <X size={28} />
            </button>
          </div>

          <ul className="mobile-nav-list">
            <li><a href="/" className={`mobile-nav-link ${activeLink === 'home' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNav('/'); }}>Home</a></li>
            <li><a href="/Products" className={`mobile-nav-link ${activeLink === 'products' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNav('/Products'); }}>Products</a></li>
            <li><a href="/blogs" className={`mobile-nav-link ${activeLink === 'blogs' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNav('/blogs'); }}>Blogs</a></li>
            <li><a href="/about" className={`mobile-nav-link ${activeLink === 'about' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNav('/about'); }}>About</a></li>
            <li><a href="/contact" className={`mobile-nav-link ${activeLink === 'contact' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNav('/contact'); }}>Contact</a></li>
            <li><a href="/track-order" className="track-order-btn" style={{ padding: '18px 32px', fontSize: '1.1rem' }} onClick={(e) => { e.preventDefault(); handleNav('/track-order'); }}><Truck/>Track Order</a></li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Navbars;