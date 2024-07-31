import React from 'react';
import logo from '../images/don.gif.gif';

const Navbar: React.FC = () => {
  return (
    <div className="flex justify-start items-center h-1/5 ml-10">
      <div className='w-1/6'>
        <img
          src={logo}
          alt="Logo" // Added alt attribute for accessibility
          className='size-full object-cover p-0 m-0 flex'
        />
      </div>
      <div>
        <p className='text-2xl'>SyncThinks</p>
      </div>
    </div>
  );
};

export default Navbar;
