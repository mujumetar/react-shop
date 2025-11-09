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

import React, { useState, useEffect } from 'react'
import { Truck, Menu, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const Navbars = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // FIXED: PROPER BODY LOCK + CLEANUP
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
        return () => document.body.classList.remove('menu-open');
    }, [mobileMenuOpen]);

    const getActiveLink = () => {
        const path = location.pathname;
        if (path === '/' || path === '/home') return 'home';
        if (path.startsWith('/Products')) return 'products';
        if (path.startsWith('/about')) return 'about';
        if (path.startsWith('/contact')) return 'contact';
        if (path.startsWith('/track-order')) return 'track';
        return 'home';
    };

    const activeLink = getActiveLink();

    // FIXED: INSTANT CLOSE + BODY CLASS REMOVE
    const handleNavClick = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
        window.scrollTo(0, 0);
        document.body.classList.remove('menu-open'); // Force remove
    };

    return (
        <>
            <style>{`
                /* YOUR FULL STYLES + FINAL FIXES */
                @keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes slideInUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

                .modern-navbar {
                    background: #ffffff;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border-bottom: 1px solid transparent;
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                }
                .modern-navbar.scrolled {
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border-bottom-color: #e5e7eb;
                    backdrop-filter: blur(10px);
                    background: rgba(255, 255, 255, 0.95);
                }
                .navbar-container { display: flex; align-items: center; justify-content: space-between; padding: 0 1rem; }

                /* BRAND */
                .navbar-brand-modern { display: flex; align-items: center; gap: 12px; text-decoration: none; }
                .brand-name { font-size: 1.5rem; font-weight: 700; background: linear-gradient(135deg, #059669 0%, #2563eb 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .brand-tagline { font-size: 0.75rem; color: #6b7280; }

                /* DESKTOP */
                .nav-menu-desktop { display: flex; gap: 8px; list-style: none; margin: 0; padding: 0; }
                .nav-link-modern { padding: 10px 18px; border-radius: 10px; font-weight: 500; color: #4b5563; text-decoration: none; transition: all 0.4s; }
                .nav-link-modern:hover { background: #f0fdf4; color: #059669; }
                .nav-link-modern.active { background: #d1fae5; color: #059669; }

                /* MOBILE MENU */
                .mobile-menu-toggle { display: none; background: none; border: none; padding: 8px; border-radius: 10px; cursor: pointer; }
                .mobile-menu-toggle:hover { background: #f3f4f6; }

                .nav-menu-mobile {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100vw; height: 100vh;
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(12px);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    transform: translateY(-100%);
                    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 1001;
                    opacity: 0;
                    visibility: hidden;
                }
                .nav-menu-mobile.open {
                    transform: translateY(0);
                    opacity: 1;
                    visibility: visible;
                }

                .mobile-menu-header {
                    position: absolute;
                    top: 20px; left: 20px; right: 20px;
                    display: flex; justify-content: space-between; align-items: center;
                }
                .mobile-close-btn {
                    background: #f3f4f6; border: none; padding: 12px; border-radius: 12px; cursor: pointer;
                }
                .mobile-close-btn:hover { background: #ef4444; color: white; }

                .mobile-nav-list {
                    list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 20px; text-align: center;
                }
                .mobile-nav-link {
                    font-size: 1.8rem; font-weight: 600; color: #1f2937; text-decoration: none; padding: 16px 24px; border-radius: 16px; transition: all 0.4s;
                }
                .mobile-nav-link:hover, .mobile-nav-link.active {
                    color: #059669; background: rgba(16, 185, 129, 0.1); transform: scale(1.05);
                }

                .mobile-overlay {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(8px);
                    z-index: 1000; opacity: 0; visibility: hidden; transition: all 0.4s;
                }
                .mobile-overlay.open { opacity: 1; visibility: visible; }

                /* RESPONSIVE */
                @media (max-width: 767.98px) {
                    .nav-menu-desktop { display: none; }
                    .mobile-menu-toggle { display: block; }
                }
                @media (max-width: 576px) {
                    .mobile-nav-link { font-size: 1.5rem; }
                    .brand-tagline { display: none; }
                }

                /* FINAL FIX: NO SCROLL + NO JUMP */
                html, body { overflow-x: hidden !important; }
                body.menu-open {
                    overflow: hidden !important;
                    position: fixed !important;
                    width: 100% !important;
                    height: 100% !important;
                    top: 0; left: 0;
                }
            `}</style>

            <header className={`modern-navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <div className="navbar-container">
                        <a href="/" className="navbar-brand-modern" onClick={(e) => { e.preventDefault(); handleNavClick('/'); }}>
                            <div className="brand-text">
                                <h1 className="brand-name">Dilkhush</h1>
                                <p className="brand-tagline">Fresh & Quality</p>
                            </div>
                        </a>

                        <ul className="nav-menu-desktop">
                            <li><a href="/" className={`nav-link-modern ${activeLink === 'home' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/'); }}>Home</a></li>
                            <li><a href="/Products" className={`nav-link-modern ${activeLink === 'products' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/Products'); }}>Products</a></li>
                            <li><a href="/about" className={`nav-link-modern ${activeLink === 'about' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/about'); }}>About</a></li>
                            <li><a href="/contact" className={`nav-link-modern ${activeLink === 'contact' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/contact'); }}>Contact</a></li>
                            <li><a href="/track-order" className={`track-order-btn ${activeLink === 'track' ? 'active-btn' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/track-order'); }}>
                                <Truck size={18} /> Track Order
                            </a></li>
                        </ul>

                        <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(true)}>
                            <Menu size={24} />
                        </button>
                    </div>
                </div>

                <div className={`mobile-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)} />
                <nav className={`nav-menu-mobile ${mobileMenuOpen ? 'open' : ''}`}>
                    <div className="mobile-menu-header">
                        <h3 className="brand-name">Dilkhush</h3>
                        <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>
                            <X size={28} />
                        </button>
                    </div>
                    <ul className="mobile-nav-list">
                        <li><a href="/" className={`mobile-nav-link ${activeLink === 'home' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/'); }}>Home</a></li>
                        <li><a href="/Products" className={`mobile-nav-link ${activeLink === 'products' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/Products'); }}>Products</a></li>
                        <li><a href="/about" className={`mobile-nav-link ${activeLink === 'about' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/about'); }}>About</a></li>
                        <li><a href="/contact" className={`mobile-nav-link ${activeLink === 'contact' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/contact'); }}>Contact</a></li>
                        <li><a href="/track-order" className={`mobile-nav-link ${activeLink === 'track' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/track-order'); }}>
                            <Truck size={32} style={{ marginRight: 12 }} /> Track Order
                        </a></li>
                    </ul>
                </nav>
            </header>
        </>
    )
}

export default Navbars