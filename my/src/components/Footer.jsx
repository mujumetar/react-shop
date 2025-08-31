import React from 'react'

const Footer = () => {
    return (
        <>
            <footer>
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className="footer-section">
                                <h3>About Us</h3>
                                <p>Dilkhush is a modern grocery store offering high-quality products with convenient online
                                    ordering and fast delivery.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="footer-section">
                                <h3>Contact Info</h3>
                                <p><i className="fas fa-map-marker-alt"></i> 123 Fresh Street, Beverly Hills</p>
                                <p><i className="fas fa-phone"></i> (123) 456-7890</p>
                                <p><i className="fas fa-envelope"></i> info@Dilkhush.com</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="footer-section">
                                <h3>Follow Us</h3>
                                <div className="social-icons">
                                    <a href="#"><i className="fab fa-facebook"></i></a>
                                    <a href="#"><i className="fab fa-twitter"></i></a>
                                    <a href="https://www.instagram.com/dilkhush_kirana" target='__blank' className='text-decoration-none'><i className="ri-instagram-line"></i></a>
                                    <a href="#"><i className="fab fa-pinterest"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="copyright">
                        <p>&copy; 2025 Dilkhush. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer