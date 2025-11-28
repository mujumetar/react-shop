// import React from 'react'
// import white from "../img/white.jpg"
// import black from "/black.jpeg"

// const Slider = () => {
//     return (
//         <>
//             <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
//                 <div className="carousel-indicators">
//                     <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" aria-current="true"
//                         aria-label="Slide 1"></button>
//                     <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
//                     <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
//                 </div>
//                 <div className="carousel-inner">
//                     <div className="carousel-item active">
//                         <img src={white}
//                             className="d-block w-100 carousel-image" alt="Fresh produce" />
//                         <div className="carousel-caption">
//                             {/* <div className="hero-content">
//                                 <h1 className="text-3xl font-bold mb-4">Dilkhush Kirana Store</h1>
//                                 <p className="mb-2">
//                                     Welcome to <strong>Dilkhush Kirana Store</strong>, your trusted shop in{" "}
//                                     <strong>Dhasa, Gujarat</strong> for daily essentials, saani, and spices.
//                                 </p>


//                             </div> */}
//                         </div>
//                     </div>
//                     <div className="carousel-item">
//                         <img src={black}
//                             className="d-block w-100 carousel-image" alt="Organic vegetables" />
//                         <div className="carousel-caption">
//                             <div className="hero-content">
//                                 {/* <p className="mb-4">
//                                     We are committed to delivering fresh and authentic grocery products at
//                                     affordable prices with excellent service.
//                                 </p> */}
//                             </div>
//                         </div>
//                     </div>

//                 </div>
//                 <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
//                     <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//                     <span className="visually-hidden">Previous</span>
//                 </button>
//                 <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
//                     <span className="carousel-control-next-icon" aria-hidden="true"></span>
//                     <span className="visually-hidden">Next</span>
//                 </button>
//             </div>
//         </>
//     )
// }

// export default Slider

// best design------------------------------------
// src/components/Slider.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Leaf, Heart } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: "/white.jpg",
    title: "Handcrafted with Love",
    highlight: "Dilkhush Saani",
    subtitle: "Pure sesame & jaggery · Made fresh every winter · Since 1999",
    badge: "25 Years of Trust",
    gradient: "from-amber-600 via-orange-500 to-pink-600"
  },
  {
    id: 2,
    image: "/black.jpeg",
    title: "Black Saani Kachariyu",
    highlight: "Winter Superfood",
    subtitle: "Rich in iron · Boosts immunity · Natural energy source",
    badge: "Best Seller 2024-25",
    gradient: "from-emerald-600 via-teal-500 to-cyan-600"
  },
  {
    id: 3,
    image: "/hero3.jpg",
    title: "Pure · Natural · Authentic",
    highlight: "Dilkhush Promise",
    subtitle: "No preservatives · No artificial colors · Just pure tradition",
    badge: "100% Natural",
    gradient: "from-purple-600 via-pink-500 to-rose-600"
  }
];

const Slider = () => {
  const [index, setIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-black"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        >
          <img
            src={slides[index].image}
            alt={slides[index].title}
            className="h-full w-full object-cover"
            style={{ filter: "brightness(0.7) contrast(1.2)" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlays & Particles */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <motion.div
        className="absolute inset-0 opacity-60"
        animate={{
          background: [
            "radial-gradient(circle at 20% 80%, #f59e0b40 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, #ec489940 0%, transparent 50%)",
            "radial-gradient(circle at 50% 50%, #8b5cf640 0%, transparent 50%)",
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400/30 rounded-full blur-sm"
          initial={{ x: Math.random() * window.innerWidth, y: window.innerHeight + 20 }}
          animate={{ y: -100, x: Math.random() * window.innerWidth }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative h-full flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -80 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-8 md:space-y-10 lg:space-y-12"
            >
              {/* Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20"
              >
                <Heart className="w-4 h-4 md:w-5 md:h-5 text-red-400 animate-pulse" />
                <span className="text-white font-semibold text-sm md:text-base tracking-wider">
                  {slides[index].badge}
                </span>
              </motion.div>

              {/* Main Title */}
              <h1 className="font-black text-white leading-none">
                <motion.span
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 1 }}
                  className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
                >
                  {slides[index].title}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 1, type: "spring" }}
                  className={`block bg-gradient-to-r ${slides[index].gradient} bg-clip-text text-transparent text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] leading-none`}
                  style={{
                    textShadow: "0 0 80px rgba(255,255,255,0.5)",
                    filter: "drop-shadow(0 0 30px currentColor)"
                  }}
                >
                  {slides[index].highlight}
                </motion.span>
              </h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-200 font-light max-w-4xl mx-auto leading-relaxed tracking-wide px-4"
              >
                {slides[index].subtitle}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mt-10 md:mt-16"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 md:px-12 md:py-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-2xl shadow-2xl overflow-hidden text-lg md:text-xl lg:text-2xl"
                  style={{ boxShadow: "0 20px 40px rgba(251,146,60,0.4)" }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Shop Now
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 group-hover:animate-spin" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-white/30"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8 }}
                  />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 md:px-12 md:py-6 border-2 border-white/50 backdrop-blur-xl text-white font-semibold rounded-2xl hover:bg-white/10 transition-all text-lg md:text-xl lg:text-2xl"
                >
                  <Leaf className="inline mr-2 w-5 h-5 md:w-6 md:h-6" />
                  View Collection
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-white/10 backdrop-blur-xl rounded-full hover:bg-white/20 transition-all group"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-white/10 backdrop-blur-xl rounded-full hover:bg-white/20 transition-all group"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
      </button>

      {/* Progress Dots */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-3 md:gap-4">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} className="relative">
            <motion.div
              className="w-12 md:w-16 h-1 rounded-full bg-white/30 overflow-hidden"
              animate={{
                background: i === index
                  ? `linear-gradient(90deg, #fbbf24, #f59e0b)`
                  : "rgba(255,255,255,0.3)"
              }}
            >
              {i === index && (
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-600"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 6, ease: "linear" }}
                />
              )}
            </motion.div>
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 text-white/60"
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
        </div>
      </motion.div>
    </div>
  );
};

export default Slider;

// for pc best --------------------------------------------
// import React, { useRef } from 'react';
// import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
// import { ShoppingBag, Leaf, Heart, ChevronDown } from 'lucide-react';

// const slides = [
//   {
//     id: 1,
//     image: "/white.jpg",
//     title: "Handcrafted",
//     highlight: "Dilkhush Saani",
//     subtitle: "Pure sesame & jaggery · Made fresh every winter in Dhasa",
//     badge: "25 Years of Trust · Since 1999"
//   },
//   {
//     id: 2,
//     image: "/black.jpeg",
//     title: "Black Saani Kachariyu",
//     highlight: "Winter's Warm Embrace",
//     subtitle: "Rich in iron · Boosts strength · Traditional winter superfood",
//     badge: "Best Seller 2024–25"
//   },
//   {
//     id: 3,
//     image: "/family.jpg", // add a warm family/traditional photo
//     title: "From Our Family",
//     highlight: "To Yours",
//     subtitle: "Every pack carries love, tradition, and the taste of home",
//     badge: "Made with Love in Gujarat"
//   },
//   {
//     id: 4,
//     image: "/ingredients.jpg", // close-up of sesame, jaggery
//     title: "100% Natural",
//     highlight: "Nothing Else",
//     subtitle: "No preservatives · No artificial colors · Just pure goodness",
//     badge: "Pure · Natural · Authentic"
//   },
//   {
//     id: 5,
//     image: "/shop.jpg", // your shop exterior or interior
//     title: "Visit Us in Dhasa",
//     highlight: "Dilkhush Kirana Store",
//     subtitle: "Your trusted neighborhood store for quality groceries & winter specials",
//     badge: "Open Daily · 7 AM – 9 PM"
//   }
// ];

// const ScrollHero = () => {
//   const containerRef = useRef(null);
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end start"]
//   });

//   const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 35 });

//   return (
//     <>
//       {/* Full Height: 5 slides = 500vh */}
//       <div ref={containerRef} className="relative h-[500vh] bg-black">
//         <div className="sticky top-0 h-screen overflow-hidden">

//           {/* Floating Golden Particles */}
//           {[...Array(12)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="absolute w-1 h-1 md:w-2 md:h-2 bg-yellow-400/40 rounded-full blur-xl"
//               initial={{ 
//                 x: Math.random() * window.innerWidth,
//                 y: -50
//               }}
//               animate={{ 
//                 y: window.innerHeight + 50,
//                 x: Math.random() * window.innerWidth
//               }}
//               transition={{
//                 duration: 20 + Math.random() * 20,
//                 repeat: Infinity,
//                 ease: "linear",
//                 delay: Math.random() * 10
//               }}
//             />
//           ))}

//           {/* Gentle Light Rays */}
//           <div className="absolute inset-0 opacity-30">
//             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-yellow-400/20 via-transparent to-transparent blur-3xl" />
//             <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-amber-300/10 via-transparent to-transparent blur-3xl" />
//           </div>

//           {/* Background Images + Parallax */}
//           {slides.map((slide, i) => {
//             const start = i * 0.2;
//             const end = (i + 1) * 0.2;

//             const scale = useTransform(smoothProgress, [start, end], [1.15, 1]);
//             const opacity = useTransform(smoothProgress, [start, start + 0.1, end - 0.05, end], [0.4, 1, 1, 0.4]);
//             const filter = useTransform(smoothProgress, [start, end], ["brightness(0.6)", "brightness(0.8)"]);

//             return (
//               <motion.div
//                 key={i}
//                 className="absolute inset-0"
//                 style={{ scale, opacity, filter }}
//               >
//                 <img
//                   src={slide.image}
//                   alt={slide.title}
//                   className="w-full h-full object-cover"
//                 />
//               </motion.div>
//             );
//           })}

//           {/* Dark Gradient Overlay */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

//           {/* Content Layers */}
//           <div className="relative h-full flex items-center justify-center px-6">
//             <div className="max-w-5xl mx-auto text-center">

//               {slides.map((slide, i) => {
//                 const start = i * 0.2;
//                 const mid = start + 0.1;
//                 const end = start + 0.2;

//                 const contentOpacity = useTransform(
//                   smoothProgress,
//                   [start, mid, end - 0.05, end],
//                   [0, 1, 1, 0]
//                 );
//                 const contentY = useTransform(
//                   smoothProgress,
//                   [start, mid, end - 0.05],
//                   [80, 0, -60]
//                 );

//                 return (
//                   <motion.div
//                     key={i}
//                     className="absolute inset-0 flex flex-col items-center justify-center"
//                     style={{ opacity: contentOpacity, y: contentY }}
//                   >
//                     {/* Badge */}
//                     <motion.div
//                       initial={{ scale: 0.8 }}
//                       animate={{ scale: 1 }}
//                       className="mb-8 inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/30 shadow-2xl"
//                     >
//                       {i === 0 && <Heart className="w-5 h-5 text-red-400 animate-pulse" />}
//                       {i === 1 && <Leaf className="w-5 h-5 text-emerald-400" />}
//                       <span className="text-white font-medium tracking-wider text-sm md:text-base">
//                         {slide.badge}
//                       </span>
//                     </motion.div>

//                     {/* Title */}
//                     <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
//                       {slide.title}
//                       <br />
//                       <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
//                         {slide.highlight}
//                       </span>
//                     </h1>

//                     {/* Subtitle */}
//                     <p className="mt-6 text-lg md:text-xl text-gray-200 font-light max-w-2xl leading-relaxed">
//                       {slide.subtitle}
//                     </p>

//                     {/* CTA Buttons - Only on first slide */}
//                     {i === 0 && (
//                       <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center">
//                         <button className="group px-9 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 flex items-center justify-center gap-3 text-lg">
//                           <ShoppingBag className="w-5 h-5" />
//                           Shop Now
//                           <span className="group-hover:translate-x-1 transition-transform">→</span>
//                         </button>

//                         <button className="px-9 py-4 border border-white/40 text-white font-medium rounded-lg backdrop-blur-md hover:bg-white/10 transition-all text-lg">
//                           View All Products
//                         </button>
//                       </div>
//                     )}
//                   </motion.div>
//                 );
//               })}

//               {/* Scroll Down Indicator */}
//               <motion.div
//                 animate={{ y: [0, 12, 0] }}
//                 transition={{ duration: 2, repeat: Infinity }}
//                 className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70"
//               >
//                 <div className="flex flex-col items-center gap-4">
//                   <span className="text-sm tracking-widest font-light">SCROLL TO EXPLORE</span>
//                   <ChevronDown className="w-7 h-7" />
//                 </div>
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ScrollHero;


// import React, { useState, useEffect, useRef } from 'react';
// import { motion, useScroll, useTransform } from 'framer-motion';
// import { ShoppingBag, ChevronDown } from 'lucide-react';

// const slides = [
//   {
//     image: "/white.jpg",
//     title: "Handcrafted",
//     highlight: "Dilkhush Saani",
//     subtitle: "Pure sesame & jaggery · Made fresh in Dhasa",
//     badge: "25 Years of Trust"
//   },
//   {
//     image: "/black.jpeg",
//     title: "Black Saani Kachariyu",
//     highlight: "Winter Superfood",
//     subtitle: "Rich in iron · Natural energy · Made with love",
//     badge: "Best Seller 2024–25"
//   },
//   {
//     image: "/family.jpg", // or shop.jpg
//     title: "From Our Family",
//     highlight: "To Yours",
//     subtitle: "Serving Gujarat with purity since 1999",
//     badge: "Made in Dhasa"
//   }
// ];

// const MobileFriendlyHero = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const containerRef = useRef(null);

//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end end"]
//   });

//   // Auto-update slide based on scroll (smooth & lightweight)
//   useEffect(() => {
//     const unsubscribe = scrollYProgress.on("change", (value) => {
//       const slideIndex = Math.round(value * (slides.length - 1));
//       setCurrentSlide(Math.min(Math.max(slideIndex, 0), slides.length - 1));
//     });
//     return unsubscribe;
//   }, [scrollYProgress]);

//   return (
//     <>
//       {/* Total height = number of slides × 100vh */}
//       <div ref={containerRef} className="h-[300vh] relative bg-black">
//         {/* Sticky container */}
//         <div className="sticky top-0 h-screen overflow-hidden">

//           {/* Background Images - Simple fade, no heavy scale */}
//           {slides.map((slide, i) => (
//             <motion.div
//               key={i}
//               className="absolute inset-0"
//               initial={{ opacity: 0 }}
//               animate={{ 
//                 opacity: currentSlide === i ? 1 : 0 
//               }}
//               transition={{ duration: 0.8, ease: "easeOut" }}
//             >
//               <img
//                 src={slide.image}
//                 alt={slide.title}
//                 className="w-full h-full object-cover brightness-75"
//                 loading="eager"
//               />
//             </motion.div>
//           ))}

//           {/* Soft gradient overlay */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

//           {/* Content */}
//           <div className="relative h-full flex items-center justify-center px-5">
//             <div className="text-center max-w-2xl">

//               {/* Slide Content */}
//               <motion.div
//                 key={currentSlide}
//                 initial={{ opacity: 0, y: 40 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -40 }}
//                 transition={{ duration: 0.6 }}
//                 className="space-y-6"
//               >
//                 {/* Badge */}
//                 <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/30">
//                   <span className="text-white text-xs md:text-sm font-medium tracking-wider">
//                     {slides[currentSlide].badge}
//                   </span>
//                 </div>

//                 {/* Title */}
//                 <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
//                   {slides[currentSlide].title}
//                   <br />
//                   <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
//                     {slides[currentSlide].highlight}
//                   </span>
//                 </h1>

//                 {/* Subtitle */}
//                 <p className="text-base md:text-lg text-gray-200 font-light max-w-xl mx-auto leading-relaxed">
//                   {slides[currentSlide].subtitle}
//                 </p>

//                 {/* CTA Buttons - Only on first slide */}
//                 {currentSlide === 0 && (
//                   <div className="mt-10 flex flex-col gap-4">
//                     <button className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg shadow-lg flex items-center justify-center gap-3 text-lg hover:shadow-xl transition-shadow">
//                       <ShoppingBag className="w-5 h-5" />
//                       Shop Now
//                       <span className="group-hover:translate-x-1 transition-transform">→</span>
//                     </button>

//                     <button className="px-8 py-4 border border-white/50 text-white font-medium rounded-lg backdrop-blur-sm hover:bg-white/10 transition-colors">
//                       View Collection
//                     </button>
//                   </div>
//                 )}
//               </motion.div>

//               {/* Simple Dots */}
//               <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
//                 {slides.map((_, i) => (
//                   <div
//                     key={i}
//                     className={`transition-all duration-300 ${
//                       currentSlide === i 
//                         ? "w-8 h-2 bg-amber-400 rounded-full" 
//                         : "w-2 h-2 bg-white/50 rounded-full"
//                     }`}
//                   />
//                 ))}
//               </div>

//               {/* Scroll Hint */}
//               <motion.div
//                 animate={{ y: [0, 10, 0] }}
//                 transition={{ duration: 2, repeat: Infinity }}
//                 className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/70"
//               >
//                 <ChevronDown className="w-6 h-6" />
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default MobileFriendlyHero;




// import React, { useState, useEffect, useRef } from 'react';
// import { motion } from 'framer-motion';
// import { ShoppingBag, ChevronDown, ArrowRight } from 'lucide-react';
// import white from "../../src/img/white.jpg"
// import black from "../../src/img/black.jpeg"
// import { Navigate, useNavigate } from 'react-router-dom';

// const slides = [
//   {
//     image: black,
//     title: "Hand Made",
//     highlight: "Dilkhush Saani",
//     subtitle: "Pure sesame & jaggery · Fresh from Dhasa",
//     badge: "25 Years of Trust"
//   },
//   {
//     image: white,
//     title: "Black & White Saani Kachariyu",
//     highlight: "Winter Superfood",
//     subtitle: "Rich in iron · Boosts strength · Pure tradition",
//     badge: "Best Seller 2024–25"
//   },
//   {
//     image: "/logo2.jpg",
//     title: "From Our Family",
//     highlight: "To Yours",
//     subtitle: "Made with love · Delivered with care",
//     badge: "Made in Gujarat"
//   }
// ];

// const UltraSmoothHero = () => {
//   const [index, setIndex] = useState(0);
//   const containerRef = useRef(null);

//   // Ultra-smooth scroll tracking (no jumpiness)
//   useEffect(() => {
//     const handleScroll = () => {
//       if (!containerRef.current) return;

//       const rect = containerRef.current.getBoundingClientRect();
//       const scrollPercentage = Math.max(0, Math.min(1,
//         (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
//       ));

//       const newIndex = Math.round(scrollPercentage * (slides.length - 1));
//       if (newIndex !== index) {
//         setIndex(newIndex);
//       }
//     };

//     // Use passive listener + requestAnimationFrame for max smoothness
//     let ticking = false;
//     const onScroll = () => {
//       if (!ticking) {
//         requestAnimationFrame(() => {
//           handleScroll();
//           ticking = false;
//         });
//         ticking = true;
//       }
//     };

//     window.addEventListener('scroll', onScroll, { passive: true });
//     handleScroll(); // initial

//     return () => window.removeEventListener('scroll', onScroll);
//   }, [index]);

//   return (
//     <div ref={containerRef} className="h-[300vh] relative bg-black">
//       {/* Sticky container */}
//       <div className="sticky top-0 h-screen overflow-hidden">

//         {/* Background Images - GPU-accelerated fade */}
//         {slides.map((slide, i) => (
//           <motion.div
//             key={i}
//             className="absolute inset-0"
//             initial={{ opacity: 0 }}
//             animate={{
//               opacity: index === i ? 1 : 0
//             }}
//             transition={{
//               duration: 1.2,
//               ease: [0.32, 0.72, 0, 1] // Custom ultra-smooth curve
//             }}
//             style={{
//               willChange: 'opacity',
//               transform: 'translateZ(0)' // Force GPU
//             }}
//           >
//             <img
//               src={slide.image}
//               alt={slide.title}
//               className="w-full h-full object-cover brightness-75"
//               loading="eager"
//               decoding="async"
//             />
//           </motion.div>
//         ))}

//         {/* Minimal overlay - only one layer */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 pointer-events-none" />

//         {/* Content - Super smooth text */}
//         <div className="relative h-full flex items-center justify-center px-5">
//           <div className="text-center max-w-2xl">

//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{
//                 duration: 0.9,
//                 ease: [0.32, 0.72, 0, 1],
//                 delay: 0.1
//               }}
//               className="space-y-6"
//             >
//               {/* Badge */}
//               <motion.div
//                 initial={{ scale: 0.9 }}
//                 animate={{ scale: 1 }}
//                 transition={{ duration: 0.8, ease: "easeOut" }}
//                 className="inline-block px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
//               >
//                 <span className="text-white text-xs md:text-sm font-medium tracking-wider">
//                   {slides[index].badge}
//                 </span>
//               </motion.div>

//               {/* Title */}
//               <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
//                 <motion.span
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.2, duration: 0.9 }}
//                   className="block"
//                 >
//                   {slides[index].title}
//                 </motion.span>
//                 <motion.span
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4, duration: 0.9 }}
//                   className="block bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 bg-clip-text text-transparent"
//                 >
//                   {slides[index].highlight}
//                 </motion.span>
//               </h1>

//               {/* Subtitle */}
//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.6, duration: 1 }}
//                 className="text-base md:text-lg text-gray-200 font-light leading-relaxed max-w-xl mx-auto"
//               >
//                 {slides[index].subtitle}
//               </motion.p>

//               {/* CTA - Only on first slide */}
//               {/* {index === 0 && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.8, duration: 0.8 }}
//                   className="mt-10 flex flex-col gap-4"
//                 >
//                   <button
                  
//                     className="group relative px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-500 flex items-center justify-center gap-4 text-lg overflow-hidden"
//                   >
//                     {/* Optional glow effect */}
//                     {/* <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500"></span>

//                     <ShoppingBag className="w-6 h-6 relative z-10" />
//                     <span className="relative z-10">Shop Now</span>
//                     <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-3 transition-transform duration-500" />
//                   </button> */}
// {/* 
//                   <button className="px-4 py-3 border border-white/40 text-white font-medium rounded-lg hover:bg-white/10 transition-colors backdrop-blur-sm">
//                     View Collection
//                   </button> */}
//               {/* )} */} 
//             {/* </motion.div> */}
//                 </motion.div>

//             {/* Ultra-smooth dots */}
//             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
//               {slides.map((_, i) => (
//                 <motion.div
//                   key={i}
//                   className="relative"
//                   animate={{
//                     scale: index === i ? 1.4 : 1,
//                     opacity: index === i ? 1 : 0.4
//                   }}
//                   transition={{ duration: 0.6 }}
//                 >
//                   <div className={`w-2 h-2 rounded-full transition-colors ${index === i ? 'bg-amber-400' : 'bg-white/50'
//                     }`} />
//                 </motion.div>
//               ))}
//             </div>

//             {/* Gentle scroll hint */}
//             {index === 0 && (
//               <motion.div
//                 animate={{ y: [0, 8, 0] }}
//                 transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//                 className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60"
//               >
//                 <ChevronDown className="w-6 h-6" />
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UltraSmoothHero;