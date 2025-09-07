import React from 'react';

const Loading = () => {
  return (
    <div className="bg-white d-flex justify-content-center align-items-center vh-100">
      <dotlottie-wc
        src="https://lottie.host/9b03c96e-6dbb-49bd-81f2-7db7a21a43b0/MV5dyCO6o5.lottie"
        style={{ width: "300px", height: "300px" }}
        speed="2"
        autoplay
        loop
      ></dotlottie-wc>
    </div>
  );
};

export default Loading;
