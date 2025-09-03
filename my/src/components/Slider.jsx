import React from 'react'
import white from "../img/white.jpeg"
import black from "../img/black.jpeg"

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
                        <img src={white}
                            className="d-block w-100 carousel-image" alt="Fresh produce" />
                        <div className="carousel-caption">
                            <div className="hero-content">
                                <h1>A different kind of grocery store</h1>
                                <p>Order any goods from our store online and we'll deliver within 24 hours.</p>
                               
                            </div>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src={black}
                            className="d-block w-100 carousel-image" alt="Organic vegetables" />
                        <div className="carousel-caption">
                            <div className="hero-content">
                                <h1>Fresh Organic Produce</h1>
                                <p>Locally sourced organic vegetables and fruits delivered daily to your doorstep.</p>
                            

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