import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Package } from 'lucide-react';

const ProductCard = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
        if (!response.ok) throw new Error('Failed to load products');
        const data = await response.json();
        setProducts(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    // Optional: show toast here
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-emerald-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading fresh products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg">Oops! Something went wrong.</p>
        <p className="text-sm text-gray-500 mt-2">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">No products yet</h3>
        <p className="text-gray-500 mt-2">New winter specials coming soon!</p>
      </div>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-amber-50/50 via-white to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section Header - Warm & Trustworthy */}
        <div className="text-center mb-16">
          <p className="text-emerald-700 font-semibold tracking-wider text-sm uppercase mb-3">
            Handmade with Love • Since 1999
          </p>
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Our Winter Specials
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pure saani & kachariyu made fresh in Dhasa — just like grandmother used to make
          </p>
          <div className="mt-6 flex justify-center">
            <div className="w-32 h-1 bg-gradient-to-r from-emerald-600 to-amber-600 rounded-full"></div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                  src={product.img_url || "/api/placeholder/400/400"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />

                {/* Discount Badge */}
                {product.originalPrice && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to wishlist logic
                  }}
                  className="absolute top-4 right-4 p-2.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50"
                >
                  <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                </button>

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full bg-white text-emerald-700 font-semibold py-3 rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-3">
                <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < 4.8 ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(128)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <del className="text-gray-500">₹{product.originalPrice}</del>
                  )}
                </div>

                {/* Subtle Badge */}
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  Fresh batch • Made today
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Optional CTA */}
        <div className="text-center mt-16">
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-700 text-white font-semibold rounded-full hover:bg-emerald-800 transition-colors shadow-lg hover:shadow-xl"
          >
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductCard;