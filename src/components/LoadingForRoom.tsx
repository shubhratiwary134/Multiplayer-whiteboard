import React from "react";
import Loading from "../images/LoadingGif.gif";

const LoadingPage: React.FC = () => {
  return (
    <div className="size-full bg-[#191919] flex flex-col justify-center items-center">
      <img src={Loading} alt="Loading" className="size-full object-contain" />
    </div>
  );
};

export default LoadingPage;
