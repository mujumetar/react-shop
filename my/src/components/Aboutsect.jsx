import React from 'react'

const Aboutsect = () => {
    return (
        <>
            <section className="restaurant-section">
                <div className="container">
                    <h2 className="section-title">Shop</h2>
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="restaurant-image">
                                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
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