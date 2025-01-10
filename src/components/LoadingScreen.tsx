import React from "react";
import imageForLoading from "../images/c3d663097d813023ce59a2d9e73f88a8.gif";

const LoadingScreen: React.FC = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <img src={imageForLoading} className="w-96 rounded-2xl"></img>
    </div>
  );
};

export default LoadingScreen;
