import React from 'react'
import white from "../img/white.jpeg"
import black from "../img/black.jpeg"

const Productcard = ({prods}) => {
console.log(prods)
    return (
        <>

            <div className="container mt-4 ">

                <h2 className="section-title  text-center my-3">Products</h2>
                <div className="row">
{/* 
                    {
                            prods.map((ele, index) => (
                        <div className="col-lg-3 col-md-4 col-sm-4 mb-4" key={index}>
                                <div className="product-card">
                                    <div className="product-image">
                                        <img
                                            src={ele.image || black}
                                            className="img-fluid"
                                            alt={ele.title || "Product"}
                                        />
                                    </div>
                                    <div className="product-content">
                                        <h3 className="product-title">{ele.title || "Unnamed Product"}</h3>
                                        <p className="product-description">₹ {ele.price || 0}</p>
                                        <a href="#" className="btn">Order Now</a>
                                    </div>
                                </div>
                            </div>
                            ))
                    } */}




                </div>
            </div>


        </>
    )
}

export default Productcard