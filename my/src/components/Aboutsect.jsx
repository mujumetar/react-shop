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
                                    alt="Restaurant interior" className="img-fluid rounded shadow"/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="restaurant-text">
                                <h2>We go through and buy operation, have built it.</h2>
                                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati animi officia cum nostrum soluta necessitatibus iste dolore maiores nam inventore?</p>
                                <a href="#" className="btn">View Menu</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Aboutsect    