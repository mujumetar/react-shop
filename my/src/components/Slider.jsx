import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, ArrowRight, Truck, ShieldCheck, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ─── Fallback slides (shown when API has no slides yet) ─── */
const FALLBACK = [
  {
    _id: "f1",
    image: null,
    title: "Homemade Saani & Kachariyu",
    subtitle: "Pure ingredients, traditional recipes — made fresh in Dhasa, Gujarat since 1999.",
    buttonText: "Shop Now",
    buttonLink: "/products",
    _bg: "linear-gradient(140deg,#052e16 0%,#14532d 55%,#166534 100%)",
  },
  {
    _id: "f2",
    image: null,
    title: "Fresh Spices Delivered to Your Door",
    subtitle: "Order before 6 PM and receive your groceries within 24 hours, anywhere nearby.",
    buttonText: "Browse Products",
    buttonLink: "/products",
    _bg: "linear-gradient(140deg,#431407 0%,#7c2d12 55%,#9a3412 100%)",
  },
];

const TRUST = [
  { icon: <Truck size={13} />, label: "24hr Delivery" },
  { icon: <ShieldCheck size={13} />, label: "100% Pure" },
  { icon: <Star size={13} />, label: "25+ Years Trust" },
];

/* ─── Component ─── */
const Slider = () => {
  const [slides, setSlides]     = useState([]);
  const [current, setCurrent]   = useState(0);
  const [visible, setVisible]   = useState(true); // cross-fade toggle
  const navigate  = useNavigate();
  const timerRef  = useRef(null);

  /* fetch from API */
  useEffect(() => {
    axios
      .get(`${API}/api/sliders`)
      .then(res => {
        const active = (res.data || [])
          .filter(s => s.isActive)
          .sort((a, b) => a.order - b.order);
        if (active.length) setSlides(active);
      })
      .catch(() => {/* fallback will show */});
  }, []);

  const items = slides.length ? slides : FALLBACK;

  /* cross-fade transition */
  const goTo = useCallback((rawIdx) => {
    const idx = ((rawIdx % items.length) + items.length) % items.length;
    if (idx === current) return;
    setVisible(false);
    setTimeout(() => {
      setCurrent(idx);
      setVisible(true);
    }, 350);
  }, [current, items.length]);

  /* auto-advance */
  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => goTo(current + 1), 6000);
  }, [current, goTo]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  const slide = items[current];

  /* determine if this slide has a real image */
  const hasImage = Boolean(slide.image);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        height: "clamp(480px, 82vh, 700px)",
        background: "#0a1a0a",
      }}
    >
      {/* ── BACKGROUND LAYER ── */}
      <div
        style={{
          position: "absolute", inset: 0,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.45s ease",
        }}
      >
        {hasImage ? (
          <>
            <img
              src={slide.image}
              alt={slide.title || "Slide"}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover", display: "block",
              }}
            />
            {/* gradient overlay — darkens left for text readability */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(100deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.42) 50%, rgba(0,0,0,0.15) 100%)",
            }} />
          </>
        ) : (
          <div
            style={{
              width: "100%", height: "100%",
              background: slide._bg || "linear-gradient(140deg,#052e16,#14532d,#166534)",
            }}
          >
            {/* subtle dot texture */}
            <div style={{
              position: "absolute", inset: 0, opacity: 0.06,
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }} />
          </div>
        )}
      </div>

      {/* ── CONTENT LAYER ── */}
      <div
        style={{
          position: "relative", zIndex: 10,
          height: "100%", display: "flex", alignItems: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        <div className="hero-inner">
          <div style={{ maxWidth: 620 }}>

            {/* eyebrow pill */}
            <div className="hero-tag" style={{ marginBottom: 20 }}>
              <span className="hero-pulse" />
              Dilkhush Kirana Store · Est. 1999
            </div>

            {/* title */}
            <h1
              className="hero-title"
              style={{ marginBottom: 16 }}
            >
              {slide.title || "Homemade Saani & Kachariyu"}
            </h1>

            {/* subtitle */}
            <p className="hero-sub" style={{ marginBottom: 30 }}>
              {slide.subtitle || "Pure ingredients, traditional recipes — made fresh in Dhasa, Gujarat since 1999."}
            </p>

            {/* CTA buttons */}
            <div className="hero-btns" style={{ marginBottom: 28 }}>
              <button
                className="hero-btn-primary"
                onClick={() => navigate(slide.buttonLink || "/products")}
              >
                {slide.buttonText || "Shop Now"} <ArrowRight size={15} />
              </button>
              <button
                className="hero-btn-outline"
                onClick={() => navigate("/track-order")}
              >
                <Truck size={15} /> Track Order
              </button>
            </div>

            {/* trust badges */}
            <div className="hero-badges">
              {TRUST.map((b, i) => (
                <span key={i} className="hero-badge">
                  {b.icon} {b.label}
                </span>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ── PREV / NEXT ARROWS ── */}
      {items.length > 1 && (
        <>
          <button
            className="hero-arrow hero-arrow-left"
            onClick={() => { goTo(current - 1); resetTimer(); }}
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="hero-arrow hero-arrow-right"
            onClick={() => { goTo(current + 1); resetTimer(); }}
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* ── SLIDE DOTS ── */}
      {items.length > 1 && (
        <div className="hero-dots">
          {items.map((_, i) => (
            <button
              key={i}
              className={`hero-dot${i === current ? " active" : ""}`}
              onClick={() => { goTo(i); resetTimer(); }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── STATS STRIP (desktop only) ── */}
      <div className="hero-stats">
        {[
          { value: "500+", label: "Happy Customers" },
          { value: "24hr",  label: "Fast Delivery"    },
          { value: "100%",  label: "Natural"           },
        ].map((s, i) => (
          <div key={i} className="hero-stat">
            <div className="hero-stat-val">{s.value}</div>
            <div className="hero-stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── SLIDE COUNT (top-right) ── */}
      {items.length > 1 && (
        <div style={{
          position: "absolute", top: 20, right: 20, zIndex: 20,
          color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 600,
          letterSpacing: "0.05em",
        }}>
          {String(current + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </div>
      )}
    </section>
  );
};

export default Slider;
