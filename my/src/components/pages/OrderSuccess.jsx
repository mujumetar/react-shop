import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="container text-center py-5">
        <DotLottieReact
                src="https://lottie.host/4cd9cae9-5e75-4984-be70-ac193552b082/rMNXmUNLK0.lottie"
                loop
                autoplay
            />
      <h1 className="text-success">🎉 Order Placed Successfully!</h1>
      <p className="mt-3">
        Thank you for your purchase. Your order has been confirmed and will be delivered soon.
      </p>

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
