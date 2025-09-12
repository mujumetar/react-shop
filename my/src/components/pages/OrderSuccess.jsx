import React, { useEffect } from "react";
import logo from "../../img/logo.png"
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("🎉 Order Placed Successfully!", {
            body: "Your order has been confirmed and will be delivered soon.",
            icon: { logo }, // place your logo in public folder
          });
        }
      });
    }

    // Optional auto-redirect
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const orderSummary = `
Hello! I just placed an order:
- Order ID: 12345
- Items: Product A, Product B
- Total: $250
`;

  let phoneNumber = 7874536227;

  const sendWhatsApp = () => {
    const phoneNumber = "+917874536227" // your business WhatsApp number
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderSummary)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="container text-center py-5">
    
      <h1 className="text-success">🎉 Order Placed Successfully!</h1>
      <p className="mt-3">
        Thank you for your purchase. Your order has been confirmed and will be delivered soon.
      </p>

      <button className="btn" onClick={sendWhatsApp} >Download Invoice</button>

      <button
        className="btn btn-primary mt-4"
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
    </div>
  );
};

export default OrderSuccess;
