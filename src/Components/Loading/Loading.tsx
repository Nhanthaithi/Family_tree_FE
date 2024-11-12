import { images } from "../../assets/img/img";
import "./Loading.css";
import React from "react";

const LoadingComponent: React.FC = () => {
  return (
    <div className="image-container">
      <div className="wave-effect"></div>
      <img
        src={images.dragon}
        alt="Rotating Image"
        className="rotating-image"
      />
    </div>
  );
};

export default LoadingComponent;
