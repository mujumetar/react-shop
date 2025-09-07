import React from 'react' 
const Service = () => {
    return (
        <>
            <section className="popular-section" data-aos="fade-up" data-aos-duration="1000">
                <div className="container">
                    <h2 className="section-title">Most popular</h2>
                    <p className="text-center mb-5">Do not even be covered unless used the end of month.</p>
                    <div className="row">
                        <div className="col-md-3 col-sm-6 mb-4">
                            <div className="popular-product">
                                <i className="fas fa-carrot"></i>
                                <h3>Fresh Vegetables</h3>
                                <p>Locally sourced, organic vegetables delivered daily.</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 mb-4">
                            <div className="popular-product">
                                <i className="fas fa-cheese"></i>
                                <h3>Artisan Cheese</h3>
                                <p>Handcrafted cheeses from local dairy farms.</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 mb-4">
                            <div className="popular-product">
                                <i className="fas fa-bread-slice"></i>
                                <h3>Bakery Goods</h3>
                                <p>Freshly baked bread and pastries every morning.</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 mb-4">
                            <div className="popular-product">
                                <i className="fas fa-wine-bottle"></i>
                                <h3>Wine Selection</h3>
                                <p>Curated selection of fine wines from around the world.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Service