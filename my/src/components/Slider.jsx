import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, ArrowRight, Truck, ShieldCheck, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Lotus } from "./Ornament";
import whiteKachariyu from "../img/white.jpeg";
import blackKachariyu from "../img/black.jpeg";

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
    _bg: "radial-gradient(120% 90% at 85% 40%, #8A1C1C 0%, #5E1412 45%, #24120C 100%)",
  },
  {
    _id: "f2",
    image: null,
    title: "Fresh Spices Delivered to Your Door",
    subtitle: "Order before 6 PM and receive your groceries within 24 hours, anywhere nearby.",
    buttonText: "Browse Products",
    buttonLink: "/products",
    _bg: "radial-gradient(120% 90% at 85% 40%, #9A5A12 0%, #6B3410 45%, #24120C 100%)",
  },
];

const TRUST = [
  { icon: <Truck size={13} />, label: "24hr Delivery" },
  { icon: <ShieldCheck size={13} />, label: "100% Pure" },
  { icon: <Star size={13} />, label: "25+ Years Trust" },
];

const RIBBON = [
  { text: "Pure & Homemade" }, { text: "શુદ્ધ ઘરગથ્થુ", gu: true }, { text: "Kachariyu" }, { text: "Saani" },
  { text: "Mari Masala" }, { text: "Groundnut Oil" }, { text: "Cattle Feed" }, { text: "Since 1999 · Dhasa" },
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

  /* real image from API, or our own kachariyu photo for fallback slides */
  const visual = slide.image || (current % 2 ? blackKachariyu : whiteKachariyu);

  return (
    <>
      <section className="hero2 scallop-bottom">
        <div className="bandhani-light" style={{ position: "absolute", inset: 0 }} />

        <div className="dk-wrap hero2-grid" style={{ padding: 0 }}>
          {/* ── TEXT ── */}
          <div
            className="hero-inner"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            <div className="hero-gu" lang="gu">શુદ્ધ · ઘરગથ્થુ · તાજું</div>
            <div className="hero-tag">Dilkhush Kirana Store · Est. 1999</div>

            <h1 className="hero-title">
              {slide.title || "Homemade Saani & Kachariyu"}
            </h1>

            <p className="hero-sub">
              {slide.subtitle || "Pure ingredients, traditional recipes — made fresh in Dhasa, Gujarat since 1999."}
            </p>

            <div className="hero-btns">
              <button className="btn btn-gold btn-lg" onClick={() => navigate(slide.buttonLink || "/products")}>
                {slide.buttonText || "Shop Now"} <ArrowRight size={16} />
              </button>
              <button className="btn btn-ghost-light btn-lg" onClick={() => navigate("/track-order")}>
                <Truck size={16} /> Track Order
              </button>
            </div>

            <div className="hero-badges">
              {TRUST.map((b, i) => (
                <span key={i} className="hero-badge">{b.icon} {b.label}</span>
              ))}
            </div>

            {items.length > 1 && (
              <div className="hero2-controls">
                <button className="hero-arrow" onClick={() => { goTo(current - 1); resetTimer(); }} aria-label="Previous slide">
                  <ChevronLeft size={18} />
                </button>
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
                <button className="hero-arrow" onClick={() => { goTo(current + 1); resetTimer(); }} aria-label="Next slide">
                  <ChevronRight size={18} />
                </button>
                <span className="hero-count">
                  {String(current + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </span>
              </div>
            )}
          </div>

          {/* ── ARCHED VISUAL ── */}
          <div className="hero2-visual">
            <div className="hero2-mandala" aria-hidden="true"><Lotus size={600} /></div>
            <div className="hero2-arch-ring" aria-hidden="true" />
            <div className="hero2-arch">
              <img
                src={visual}
                alt={slide.title || "Dilkhush Kirana"}
                style={{ opacity: visible ? 1 : 0, transition: "opacity 0.45s ease" }}
              />
            </div>
            <div className="hero2-seal">
              <small>Since</small>
              <strong>1999</strong>
              <small>Dhasa</small>
            </div>
            <div className="hero2-chip"><span className="diamond" /> 100% Homemade</div>
          </div>
        </div>
      </section>

      {/* ── GOLD RIBBON ── */}
      <div className="ribbon" aria-hidden="true">
        <div className="ribbon-track">
          {[0, 1].map(k => (
            <div key={k} style={{ display: "flex" }}>
              {RIBBON.map((r, i) => (
                <span key={i} className="ribbon-item">
                  {r.gu ? <span className="gu" lang="gu">{r.text}</span> : r.text}
                  <Lotus size={18} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Slider;
