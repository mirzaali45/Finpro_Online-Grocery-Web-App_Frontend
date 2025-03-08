// components/about/CustomCursor.tsx
import React, { useEffect, useState } from "react";

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateCursorPosition);

    return () => {
      window.removeEventListener("mousemove", updateCursorPosition);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-6 h-6 rounded-full border-2 border-blue-500 pointer-events-none z-50 hidden md:block"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
        transition: "transform 0.1s ease-out",
      }}
    />
  );
};

export default CustomCursor;
