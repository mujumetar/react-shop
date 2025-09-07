import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import white from "../img/white.jpeg";
import black from "../img/black.jpeg";

const Productcard = ({ products }) => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openPage = (product) => {
    setSelectedProduct(product); // set the clicked product
  };

  return (
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
                  src={ele.image || black}
                  className="img-fluid"
                  alt={ele.name || "Product"}
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
      <div
        className="modal modal-fullscreen fade"
        id="productModal"
        tabIndex="1"
        z-3
        aria-hidden="true"
      >
        <div className="modal-dialog modal-fullscreen-sm-down">
          <div className="modal-content">
            {selectedProduct ? (
              <>
                <div className="modal-header">
                  <h5 className="modal-title">{selectedProduct.name}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-lg-6 col-md-12 d-flex justify-content-center align-items-center">
                      <img
                        src={selectedProduct.image || white}
                        alt={selectedProduct.name}
                        className="img-fluid"
                      />
                    </div>
                    <div className="col-lg-6 col-md-12">
                      <p className="fw-bold">Price: ₹ {selectedProduct.price}</p>
                      <p>{selectedProduct.description || "No description available"}</p>

                      {/* Example dropdown */}
                      <select className="form-select my-2">
                        <option value="default">Choose Variant</option>
                        <option value="dryfruit">{selectedProduct.name} Dryfruit</option>
                        <option value="plain">{selectedProduct.name} Plain</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" className="btn btn-success">
                    Add to Cart
                  </button>
                </div>
              </>
            ) : (
              <div className="p-4">Loading...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productcard;
