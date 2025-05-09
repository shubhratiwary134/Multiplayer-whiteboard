import React from 'react';

// Define the interface for the component props
interface CursorDisplaysProps {
  color: string;
  x: number;
  y: number;
}

// Functional component with props typed
const CursorDisplays: React.FC<CursorDisplaysProps> = ({ color, x, y }) => {
  return (
    <div className='cursor-display'>
          <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transition: "transform 0.3s cubic-bezier(.17,.93,.38,1)",
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
      width="24"
      height="36"
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
        fill={color}
      />
    </svg>
    </div>

  );
};

export default CursorDisplays;
