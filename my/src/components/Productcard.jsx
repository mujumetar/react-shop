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

      {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#0099ff" fill-opacity="1" d="M0,0L30,53.3C60,107,120,213,180,224C240,235,300,149,360,144C420,139,480,213,540,224C600,235,660,181,720,154.7C780,128,840,128,900,112C960,96,1020,64,1080,74.7C1140,85,1200,139,1260,165.3C1320,192,1380,192,1410,192L1440,192L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"></path>


      </svg> */}
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
