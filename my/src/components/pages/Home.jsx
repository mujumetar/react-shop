import React from "react";
import Slider from "../Slider";
import Aboutsect from "../Aboutsect";
import Productcard from "../Productcard";
import Service from "../Service";
import Contact from "../Contact";
import Qna from "../Qna";

const Home = ({ products }) => {
    const adminNumber = "917874536227";
    const message = "Hello 👋, I want to know more about your products."; // default message

    return (
        <>
            <Slider />
            <Productcard products={products} />
            {/* <Service/> */}
            <Qna />
            <Aboutsect />
            <Contact />

            {/* ✅ WhatsApp Floating Button */}
            <a
                href={`https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-fab"
                title="get chat now"
            >
                <i class="ri-whatsapp-line"></i>
            </a>

            {/* ✅ CSS for FAB */}
            <style jsx>{`
        .whatsapp-fab {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: #25d366;
          color: white;
          font-size: 24px;
          padding: 15px 18px;
          border-radius: 50%;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          text-decoration: none;
          transition: transform 0.2s ease-in-out;
        }
        .whatsapp-fab:hover {
          transform: scale(1.1);
          text-decoration: none;
        }
      `}</style>
        </>
    );
};

export default Home;
