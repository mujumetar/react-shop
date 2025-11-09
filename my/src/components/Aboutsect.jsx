import React from 'react'
import shopimg from "../img/shop.png"

const Aboutsect = () => {
    return (
        <>
            <section className="restaurant-section" data-aos="fade-up" data-aos-duration="1000">
                <div className="container">
                    <h2 className="section-title">Shop</h2>
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="restaurant-image">
                                <img src={shopimg}
                                    alt="Restaurant interior" className="img-fluid rounded shadow" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="restaurant-text">
                                <div className="p-6 font-sans text-gray-800">
                                    <h1 className="text-3xl font-bold mb-4">About Us</h1>
                                    <p>
                                        Welcome to <strong>Dilkhush Kirana Store</strong>, your local grocery
                                        partner in <strong>Dhasa, Gujarat</strong>. We specialize in high-quality{" "}
                                        <strong>saani and spices</strong> along with all your daily essentials.
                                    </p>
                                    <p className="mt-2">
                                        Our mission is to provide fresh, authentic, and affordable grocery items
                                        while building long-term trust with our customers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Aboutsect    