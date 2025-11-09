import React from 'react'
import { ShoppingBasket, MapPin, Phone, Mail, ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react'

const Footer = () => {
    return (
        <>
            <style>{`
                .footer-modern {
                    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
                    border-top: 1px solid #e9ecef;
                    position: relative;
                    overflow: hidden;
                }
                
                .footer-modern::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 400px;
                    height: 400px;
                    background: rgba(16, 185, 129, 0.05);
                    border-radius: 50%;
                    filter: blur(60px);
                }
                
                .footer-modern::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 400px;
                    height: 400px;
                    background: rgba(59, 130, 246, 0.05);
                    border-radius: 50%;
                    filter: blur(60px);
                }
                
                .footer-content {
                    position: relative;
                    z-index: 10;
                }
                
                .brand-logo {
                    width: 45px;
                    height: 45px;
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);
                }
                
                .brand-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #059669 0%, #2563eb 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin: 0;
                }
                
                .footer-description {
                    color: #6b7280;
                    line-height: 1.7;
                }
                
                .social-icon {
                    width: 45px;
                    height: 45px;
                    background: #ffffff;
                    border: 2px solid #e5e7eb;
                    border-radius: 10px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    color: #4b5563;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                
                .social-icon:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                }
                
                .social-icon.instagram:hover {
                    background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
                    border-color: #ec4899;
                    color: #ffffff;
                }
                
                .social-icon.facebook:hover {
                    background: #2563eb;
                    border-color: #2563eb;
                    color: #ffffff;
                }
                
                .social-icon.twitter:hover {
                    background: #60a5fa;
                    border-color: #60a5fa;
                    color: #ffffff;
                }
                
                // .section-title {
                //     font-size: 1.25rem;
                //     font-weight: 700;
                //     color: #1f2937;
                //     display: flex;
                //     align-items: center;
                //     margin-bottom: 1.5rem;
                // }
                
                .title-accent {
                    width: 4px;
                    height: 24px;
                    background: #10b981;
                    border-radius: 10px;
                    margin-right: 12px;
                }
                
                .quick-link {
                    color: #6b7280;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    padding: 8px 0;
                    transition: all 0.2s ease;
                    position: relative;
                }
                
                .quick-link:hover {
                    color: #059669;
                    padding-left: 8px;
                }
                
                .quick-link .arrow-icon {
                    opacity: 0;
                    margin-left: -20px;
                    transition: all 0.2s ease;
                    color: #10b981;
                }
                
                .quick-link:hover .arrow-icon {
                    opacity: 1;
                    margin-left: 0;
                    margin-right: 8px;
                }
                
                .contact-item {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                }
                
                .contact-icon {
                    width: 45px;
                    height: 45px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    margin-right: 12px;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                
                .contact-icon.location {
                    background: #d1fae5;
                    border: 1px solid #a7f3d0;
                    color: #059669;
                }
                
                .contact-icon.phone {
                    background: #dbeafe;
                    border: 1px solid #bfdbfe;
                    color: #2563eb;
                }
                
                .contact-icon.email {
                    background: #e9d5ff;
                    border: 1px solid #d8b4fe;
                    color: #7c3aed;
                }
                
                .contact-item:hover .contact-icon {
                    background: #10b981;
                    border-color: #10b981;
                    color: #ffffff;
                }
                
                .contact-label {
                    font-size: 0.875rem;
                    color: #6b7280;
                    font-weight: 500;
                    margin: 0;
                }
                
                .contact-value {
                    color: #1f2937;
                    font-weight: 500;
                    margin: 0;
                }
                
                .contact-value a {
                    color: #1f2937;
                    text-decoration: none;
                    transition: color 0.2s ease;
                }
                
                .contact-value a:hover {
                    color: #059669;
                }
                
                .footer-bottom {
                    border-top: 1px solid #e5e7eb;
                    padding-top: 2rem;
                    margin-top: 2rem;
                }
                
                .footer-bottom-text {
                    color: #6b7280;
                    font-size: 0.875rem;
                    margin: 0;
                }
                
                .footer-bottom-links {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    font-size: 0.875rem;
                }
                
                .footer-bottom-links a {
                    color: #6b7280;
                    text-decoration: none;
                    transition: color 0.2s ease;
                }
                
                .footer-bottom-links a:hover {
                    color: #059669;
                }
                
                .divider {
                    color: #d1d5db;
                }
                
               @media (max-width: 991px) {
                    .footer-modern::before,
                    .footer-modern::after {
                        width: 300px;
                        height: 300px;
                    }
                    
                    .brand-title {
                        font-size: 1.5rem;
                    }
                    
                    .section-title {
                        font-size: 1.125rem;
                    }
                }
                
                @media (max-width: 767px) {
                    .footer-modern::before,
                    .footer-modern::after {
                        width: 200px;
                        height: 200px;
                    }
                    
                    .brand-logo {
                        width: 40px;
                        height: 40px;
                    }
                    
                    .brand-title {
                        font-size: 1.375rem;
                    }
                    
                    .footer-description {
                        font-size: 0.9375rem;
                    }
                    
                    .social-icon {
                        width: 42px;
                        height: 42px;
                    }
                    
                    .section-title {
                        font-size: 1.125rem;
                        margin-bottom: 1.25rem;
                    }
                    
                    .contact-icon {
                        width: 40px;
                        height: 40px;
                    }
                    
                    .contact-item {
                        margin-bottom: 1.25rem;
                    }
                    
                    .footer-bottom {
                        padding-top: 1.5rem;
                        margin-top: 1.5rem;
                    }
                    
                    .footer-bottom-text {
                        font-size: 0.8125rem;
                    }
                    
                    .footer-bottom-links {
                        flex-wrap: wrap;
                        justify-content: center;
                        gap: 1rem;
                        font-size: 0.8125rem;
                    }
                }
                
                @media (max-width: 575px) {
                    .footer-content {
                        padding: 2rem 0 !important;
                    }
                    
                    .brand-logo {
                        width: 38px;
                        height: 38px;
                    }
                    
                    .brand-title {
                        font-size: 1.25rem;
                    }
                    
                    .footer-description {
                        font-size: 0.875rem;
                        line-height: 1.6;
                    }
                    
                    .social-icon {
                        width: 40px;
                        height: 40px;
                    }
                    
                    .section-title {
                        font-size: 1rem;
                        margin-bottom: 1rem;
                    }
                    
                    .title-accent {
                        width: 3px;
                        height: 20px;
                        margin-right: 10px;
                    }
                    
                    .quick-link {
                        font-size: 0.9375rem;
                        padding: 6px 0;
                    }
                    
                    .contact-icon {
                        width: 38px;
                        height: 38px;
                    }
                    
                    .contact-label {
                        font-size: 0.8125rem;
                    }
                    
                    .contact-value {
                        font-size: 0.9375rem;
                    }
                    
                    .footer-bottom {
                        padding-top: 1.25rem;
                        margin-top: 1.25rem;
                    }
                    
                    .footer-bottom-links {
                        gap: 0.75rem;
                        margin-top: 0.75rem;
                    }
                    
                    .footer-bottom-links .divider {
                        display: none;
                    }
                }
            `}</style>

            <footer className='footer-modern my-4'>
                <div className="container footer-content py-5">
                    <div className="row mb-4">
                        {/* About Section */}
                        <div className="col-md-4 mb-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="brand-logo">
                                    <ShoppingBasket color="white" size={22} />
                                </div>
                                <h3 className="brand-title ms-2">Dilkhush</h3>
                            </div>
                            <p className="footer-description mb-4">
                                Your trusted modern grocery store offering premium quality products with seamless online ordering and lightning-fast delivery to your doorstep.
                            </p>
                            <div className="d-flex gap-2">
                                <a
                                    href="https://www.instagram.com/dilkhush_kirana"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-icon instagram"
                                >
                                    <Instagram size={20} />
                                </a>
                                <a href="#" className="social-icon facebook">
                                    <Facebook size={20} />
                                </a>
                                <a href="#" className="social-icon twitter">
                                    <Twitter size={20} />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="col-md-4 mb-4">
                            <h3 className="section-title">
                                <span className="title-accent"></span>
                                Quick Links
                            </h3>
                            <ul className="list-unstyled">
                                {['Home', 'Shop', 'About Us', 'Contact', 'Privacy Policy', 'Terms & Conditions'].map((link, index) => (
                                    <li key={index}>
                                        <a href="#" className="quick-link">
                                            <ArrowRight size={18} className="arrow-icon" />
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="col-md-4 mb-4">
                            <h3 className="section-title">
                                <span className="title-accent"></span>
                                Get In Touch
                            </h3>

                            <div className="contact-item">
                                <div className="contact-icon location">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className="contact-label">Location</p>
                                    <p className="contact-value">Dhasa Jn.</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon phone">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="contact-label">Phone</p>
                                    <p className="contact-value">
                                        <a href="tel:9723089786">+91 9723089786</a>
                                    </p>
                                    <p className="contact-value">
                                        <a href="tel:9033332365">+91 9033332365</a>
                                    </p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon email">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="contact-label">Email</p>
                                    <p className="contact-value">
                                        <a href="mailto:mustakmetar82@gmail.com">mustakmetar82@gmail.com</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="footer-bottom">
                        <div className="row align-items-center">
                            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                                <p className="footer-bottom-text">
                                    &copy; 2025 Dilkhush. All rights reserved. Made with <span style={{ color: '#ef4444' }}>♥</span>
                                </p>
                            </div>
                            <div className="col-md-6 text-center text-md-end">
                                <div className="footer-bottom-links justify-content-center justify-content-md-end">
                                    <a href="#">Privacy Policy</a>
                                    <span className="divider">|</span>
                                    <a href="#">Terms of Service</a>
                                    <span className="divider">|</span>
                                    <a href="#">Sitemap</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer