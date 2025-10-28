import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import white from "../img/white.jpeg";
import black from "../img/black.jpeg";
import Eachprod from "./pages/Eachprod";


const Productcard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch({'${import.meta.env.VITE_API_URL}/products'});
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched products:', data);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const openPage = (product) => {
    setSelectedProduct(product);
    navigate('/', { state: { productId: product._id } });
  };

  const imageMap = {
    white,
    black,
  };

  if (loading) {
    return (
      <div className="products-loading-container">
        <div className="products-loading-content">
          <div className="products-spinner"></div>
          <p className="products-loading-text">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error-container">
        <div className="products-error-card">
          <div className="products-error-icon">⚠</div>
          <h3 className="products-error-title">Error Loading Products</h3>
          <p className="products-error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-wrapper">
      <div className="products-container">
        {/* Header Section */}
        <div className="products-header">
          <h2 className="products-main-title">Our Products</h2>
          <p className="products-subtitle">
            Discover our curated collection of premium products designed for you
          </p>
          <div className="products-divider"></div>
        </div>

        {products.length === 0 ? (
          <div className="products-empty">
            <div className="products-empty-icon">📦</div>
            <p className="products-empty-text">No products available at the moment</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product, index) => (
              <div
                key={product._id || index}
                className={`product-card-modern ${hoveredCard === index ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="product-card-inner">
                  {/* Image Container */}
                  <div className="product-image-container">
                    <img
                      src={imageMap[product.img_url] || black}
                      alt={product.name}
                      className="product-image-modern"
                    />
                    <div className="product-overlay"></div>
                    
                    {/* Quick action badge */}
                    <div className="product-favorite-badge">
                      <span>❤️</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="product-content-modern">
                    <h3 className="product-title-modern">
                      {product.name || "Unnamed Product"}
                    </h3>
                    
                    <div className="product-price-container">
                      <span className="product-price-modern">
                        ₹{product.price || 0}
                      </span>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => openPage(product)}
                      className="product-order-button"
                    >
                      Order Now
                    </button>
                  </div>

                  {/* Decorative element */}
                  <div className="product-glow"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Your modal component */}
      {/* <Eachprod selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} /> */}
    </div>
  );
};

export default Productcard;