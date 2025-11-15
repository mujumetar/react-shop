import React from 'react'
import white from "../img/white.jpg"
import black from "/black.jpeg"

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
                            {/* <div className="hero-content">
                                <h1 className="text-3xl font-bold mb-4">Dilkhush Kirana Store</h1>
                                <p className="mb-2">
                                    Welcome to <strong>Dilkhush Kirana Store</strong>, your trusted shop in{" "}
                                    <strong>Dhasa, Gujarat</strong> for daily essentials, saani, and spices.
                                </p>


                            </div> */}
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src={black}
                            className="d-block w-100 carousel-image" alt="Organic vegetables" />
                        <div className="carousel-caption">
                            <div className="hero-content">
                                {/* <p className="mb-4">
                                    We are committed to delivering fresh and authentic grocery products at
                                    affordable prices with excellent service.
                                </p> */}
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