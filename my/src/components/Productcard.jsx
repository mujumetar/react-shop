import React from 'react'
import white from "../img/white.jpeg"
import black from "../img/black.jpeg"

const Productcard = () => {
    return (
        <>

            <div className="container mt-4 ">

                <h2 className="section-title-x text-white text-center my-3">Products</h2>
                <div className="row">

                    <div className="col-lg-3 col-md-4 col-sm-4 mb-4">
                        <div className="product-card">
                            <div className="product-image">
                                <img src={white} className='img-fluid'
                                    alt="Breakfast collection" />
                            </div>
                            <div className="product-content">
                                <h3 className="product-title">White Sani ( Kachariya )</h3>
                                <p className="product-description">₹ 430</p>
                                <a href="#" className="btn">Order Now</a>
                            </div>
                        </div>

                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-4 mb-4">
                        <div className="product-card">
                            <div className="product-image">
                                <img src={black} className='img-fluid'
                                    alt="Breakfast collection" />
                            </div>
                            <div className="product-content">
                                <h3 className="product-title">Black Sani ( Kachariya )</h3>
                                <p className="product-description">₹ 450</p>
                                <a href="#" className="btn">Order Now</a>
                            </div>
                        </div>

                    </div>


                </div>
            </div>


        </>
    )
}

export default Productcard