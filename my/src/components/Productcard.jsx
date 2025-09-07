import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import white from "../img/white.jpeg";
import black from "../img/black.jpeg";
import Eachprod from "./pages/Eachprod";

const Productcard = ({ products }) => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openPage = (product) => {
    setSelectedProduct(product); // set the clicked product
  };

  const imageMap = {
    white,
    black,
  };

  return (
    <>
      <div className="container mt-4" data-aos="fade-up">
        <h2 className="section-title text-center my-3">Products</h2>
        <div className="row">
          {products.map((ele, index) => (
            <div
              className="col-lg-3 col-md-4 col-sm-4 mb-4"
              data-aos="fade-up"
              data-aos-duration="2000"
              key={ele._id || index}
            >
              <div className="product-card">
                <div className="product-image">
                  <img
                    src={imageMap[ele.img_url] || black}
                    alt={ele.name}
                    className="img-fluid"
                  />
                </div>
                <div className="product-content">
                  <h3 className="product-title">{ele.name || "Unnamed Product"}</h3>
                  <p className="product-description">₹ {ele.price || 0}</p>
                  <button
                    className="btn btn-sm btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#productModal"
                    onClick={() => openPage(ele)}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}

      </div>

        <Eachprod selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
    </>

  );
};

export default Productcard;
