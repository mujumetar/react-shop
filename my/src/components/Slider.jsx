import React from 'react'

const Slider = () => {
    return (
        <>
            <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" aria-current="true"
                        aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
                            className="d-block w-100 carousel-image" alt="Fresh produce" />
                        <div className="carousel-caption">
                            <div className="hero-content">
                                <h1>A different kind of grocery store</h1>
                                <p>Order any goods from our store online and we'll deliver within 24 hours.</p>
                               <div className="container">
                                    <div className="row">
                                        <div className="col-lg-6  col-sm-12 p-0 m-0">
                                            <div className="price-tag">$9.99</div>

                                        </div>

                                        <div className="col-lg-6  col-sm-12 p-0 m-0">
                                            <a href="#" className="btn">Order Now</a>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                            className="d-block w-100 carousel-image" alt="Organic vegetables" />
                        <div className="carousel-caption">
                            <div className="hero-content">
                                <h1>Fresh Organic Produce</h1>
                                <p>Locally sourced organic vegetables and fruits delivered daily to your doorstep.</p>
                             <div className="container">
                                    <div className="row">
                                        <div className="col-lg-6  col-sm-12 p-0 m-0">
                                            <div className="price-tag">$9.99</div>

                                        </div>

                                        <div className="col-lg-6  col-sm-12 p-0 m-0">
                                            <a href="#" className="btn">Order Now</a>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                            className="d-block w-100 carousel-image" alt="Dairy products" />
                        <div className="carousel-caption">
                            <div className="hero-content">
                                <h1>Premium Dairy & Cheese</h1>
                                <p>Artisan cheese and dairy products from local farms.</p>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-6  col-sm-12 p-0 m-0">
                                            <div className="price-tag">$9.99</div>

                                        </div>

                                        <div className="col-lg-6  col-sm-12 p-0 m-0">
                                            <a href="#" className="btn">Order Now</a>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </>
    )
}

export default Slider