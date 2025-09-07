import React from 'react'
import white from "../img/white.jpeg"
import black from "../img/black.jpeg"

const Productcard = ({ products }) => {
    console.log(products)
    return (
        <>

            <div className="container mt-4 " data-aos="fade-up">

                <h2 className="section-title  text-center my-3">Products</h2>
                <div className="row">

                    {
                        products.map((ele, index) => (
                            <div className="col-lg-3 col-md-4 col-sm-4 mb-4 " data-aos="fade-up" data-aos-duration="2000" key={index}>
                                <div className="hidden" hidden>{ele._id}</div>
                                <div className="product-card">
                                    <div className="product-image">
                                        <img
                                            src={ele.image || black}
                                            className="img-fluid"
                                            alt={ele.title || "Product"}
                                        />
                                    </div>
                                    <div className="product-content">
                                        <h3 className="product-title">{ele.name || "Unnamed Product"}</h3>
                                        <p className="product-description">₹ {ele.price || 0}</p>
                                        <a href="#" className="btn">Order Now</a>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>


        </>
    )
}

export default Productcard