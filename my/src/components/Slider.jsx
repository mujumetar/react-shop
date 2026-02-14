import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
    if (!slides.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides]);

  const fetchSlides = async () => {
    try {
      const res = await axios.get(`${API}/api/sliders`);

      const filteredSlides = res.data
        .filter((slide) => slide.isActive)
        .sort((a, b) => a.order - b.order);

      setSlides(filteredSlides);
    } catch (error) {
      console.error("Error fetching sliders:", error);
    }
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  if (!slides.length) return null;

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide._id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <div className="text-white max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                {slide.title}
              </h2>

              {slide.subtitle && (
                <p className="text-lg md:text-xl mb-6">
                  {slide.subtitle}
                </p>
              )}

              {slide.buttonText && slide.buttonLink && (
                <a
                  href={slide.buttonLink} target="__blank"
                  className="inline-block bg-primary px-6 py-3  text-black bg-white rounded-2xl hover:bg-transparent hover:text-white hover:border  hover:border-white font-semibold hover:bg-opacity-90 transition"
                >
                  {slide.buttonText}
                </a>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Left Button */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-md transition"
      >
        ❮
      </button>

      {/* Right Button */}
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-md transition"
      >
        ❯
      </button>

      {/* Indicators */}
      <div className="absolute bottom-5 w-full flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === current
                ? "bg-white scale-125"
                : "bg-white/50"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Slider;
