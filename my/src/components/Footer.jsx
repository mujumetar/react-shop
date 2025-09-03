import React from 'react'

const Footer = () => {
    return (
        <>
            <footer className='bg-white text-dark shadow'>
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
                                <p><i className="fas fa-map-marker-alt"></i> Dhasa Jn.</p>
                                <p><a href="tel:9723089786"><i className="fas fa-phone"></i>+91 9723089786</a></p>
                                <p><a href="tel:9033332365"><i className="fas fa-phone"></i>+91 9033332365</a></p>

                                <p><i className="fas fa-envelope"></i> <a href="mailto:mustakmetar82@gmail.com">mustakmetar82@gmail.com</a></p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="footer-section">
                                <h3>Follow Us</h3>
                                <div className="social-icons">

                                    <a href="https://www.instagram.com/dilkhush_kirana" target='__blank' className='text-decoration-none'><i className="ri-instagram-line text-dark"></i></a>

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