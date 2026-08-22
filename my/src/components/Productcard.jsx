import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Package, ArrowRight, Flame } from 'lucide-react';

const ProductCard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState({});

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load');
        return r.json();
      })
      .then((d) => setProducts(d || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block w-10 h-10 border-4 border-zinc-200 border-t-green-600 rounded-full animate-spin mb-4" />
          <p className="text-zinc-500 font-medium">Loading fresh products…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Package className="w-14 h-14 mx-auto text-zinc-300 mb-4" />
          <p className="text-zinc-500">Could not load products. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Package className="w-14 h-14 mx-auto text-zinc-300 mb-4" />
          <h3 className="text-zinc-700 font-semibold text-lg">New arrivals coming soon</h3>
          <p className="text-zinc-400 text-sm mt-1">Check back for seasonal specials.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-3">
              <Flame size={11} />
              Handmade with Love · Since 1999
            </span>
            <h2
              className="text-zinc-900 font-bold leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(26px, 3.5vw, 40px)" }}
            >
              Our Products
            </h2>
            <p className="text-zinc-500 text-sm mt-1.5">
              Pure spices &amp; saani made fresh in Dhasa — just like grandmother's recipe
            </p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900 transition-colors flex-shrink-0 group"
          >
            View all products
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product, i) => (
            <div
              key={product._id}
              className="group bg-white border border-zinc-100 rounded-2xl overflow-hidden hover:border-green-200 hover:shadow-xl transition-all duration-400 cursor-pointer"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              {/* Image */}
              <div className="relative aspect-square bg-zinc-50 overflow-hidden">
                <img
                  src={product.img_url || '/api/placeholder/400/400'}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                {product.originalPrice && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
                {i < 3 && !product.originalPrice && (
                  <span className="absolute top-3 left-3 bg-green-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                    Fresh
                  </span>
                )}

                {/* Wishlist */}
                <button
                  onClick={(e) => { e.stopPropagation(); setLiked((p) => ({ ...p, [product._id]: !p[product._id] })); }}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                >
                  <Heart
                    size={15}
                    className={liked[product._id] ? 'fill-red-500 text-red-500' : 'text-zinc-400'}
                  />
                </button>

                {/* Quick add */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-4 py-5 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
                    className="w-full flex items-center justify-center gap-2 bg-white text-green-700 font-semibold text-sm py-2.5 rounded-xl hover:bg-green-50 transition-colors"
                  >
                    <ShoppingBag size={15} />
                    Quick View
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2.5">
                <h3 className="font-semibold text-zinc-900 text-sm leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">
                  {product.name}
                </h3>

                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      size={12}
                      className={j < 5 ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}
                    />
                  ))}
                  <span className="text-xs text-zinc-400 ml-1">(128)</span>
                </div>

                {/* Price row */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-zinc-900">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-zinc-400 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
                    className="w-8 h-8 flex items-center justify-center bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>

                {/* Freshness line */}
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-green-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Fresh batch · Made in Dhasa
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-all duration-200 hover:-translate-y-0.5 shadow-lg hover:shadow-green-200"
          >
            <ShoppingBag size={18} />
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductCard;
