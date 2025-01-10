import React from "react";
import logo from "../images/don.gif.gif";
import { SignOutButton, UserButton } from "@clerk/clerk-react";

const Navbar: React.FC = () => {
  return (
    <div className="flex justify-between  items-center h-1/5 px-10">
      <div className="w-2/3 flex items-center">
        <div className="w-1/6">
          <img
            src={logo}
            alt="Logo" // Added alt attribute for accessibility
            className="size-full object-cover p-0 m-0 flex"
          />
        </div>
        <div>
          <p className="text-5xl text-white font-mono">SyncThink</p>
        </div>
      </div>

      <div>
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
