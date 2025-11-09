// src/components/GlobalLoader.jsx
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React, { useEffect, useState } from "react";

const GlobalLoader = () => {
  const [loading, setLoading] = useState(false);
  const [activeRequests, setActiveRequests] = useState(0);

  useEffect(() => {
    // Store original fetch
    const originalFetch = window.fetch;

    // Override fetch globally
    window.fetch = async (...args) => {
      setActiveRequests((n) => n + 1);
      setLoading(true);

      try {
        const response = await originalFetch(...args);
        return response;
      } finally {
        setActiveRequests((n) => {
          const newCount = Math.max(0, n - 1);
          if (newCount === 0) setLoading(false);
          return newCount;
        });
      }
    };

    return () => {
      window.fetch = originalFetch; // cleanup
    };
  }, []);

  if (!loading) return null;

  // Inline styles (no CSS file)
  const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(6px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };

  const spinner = {
    width: "60px",
    height: "60px",
    border: "6px solid #ddd",
    borderTop: "6px solid #007bff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  const keyframes = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={overlay}>

         <DotLottieReact
        src="https://lottie.host/3b0b1e9f-c4b5-4a83-ac91-a684ae861f27/cgY4CSU3Wl.lottie"
        loop
        autoplay
        style={{ width: 500, height: 500, margin: "0 auto" }}
      />
      </div>
    </>
  );
};

export default GlobalLoader;
