import React from 'react';
import shopimg from "../img/shop.png";

const Aboutsect = () => {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Our Shop
          </h2>
          <div className="mt-4 w-24 h-1 bg-emerald-600 mx-auto rounded-full"></div>
        </div>

        {/* Main Content - Image + Text */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Image Side */}
          <div className="order-2  lg:order-1">
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 lg:aspect-w-16 lg:aspect-h-12 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={shopimg}
                  alt="Dilkhush Kirana Store - Dhasa, Gujarat"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Optional overlay badge */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-full shadow-lg">
                <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <span className="text-emerald-600">Location</span> Dhasa Junction, Gujarat
                </p>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                About <span className="text-emerald-600">Dilkhush Kirana Store</span>
              </h1>
            </div>

            <div className="space-y-5 text-lg text-gray-700 leading-relaxed">
              <p>
                Welcome to <strong>Dilkhush Kirana Store</strong> — your trusted neighborhood grocery partner in <strong>Dhasa, Gujarat</strong> since 1999.
              </p>
              <p>
                We take pride in offering the finest quality <strong>homemade saani, kachariyu, spices, and daily essentials</strong> — all made with pure ingredients, traditional recipes, and a whole lot of love.
              </p>
              <p>
                From winter-special Black & White Saani to fresh spices and premium groceries, everything you see here is sourced and crafted with care — because we believe quality should never be compromised.
              </p>
              <p className="text-gray-800 font-medium">
                Our promise: Fresh. Authentic. Affordable. Always.
              </p>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">25 Years</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">25+ Years</p>
                  <p className="text-sm text-gray-600">Serving Dhasa</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">100% Natural</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Pure Ingredients</p>
                  <p className="text-sm text-gray-600">No additives</p>
                </div>
              </div>
              
            </div>
            <div className="pt-8">
              <p className="text-2xl font-semibold text-gray-900">
                Dilkhush isn’t just a name — it’s a promise.
              </p>
              <p className="text-lg text-emerald-700 mt-2">
                Thank you for being part of our family story.
              </p>
            </div>
          </div>
          
        </div>
         
      </div>

      
    </section>
  );
};

export default Aboutsect;