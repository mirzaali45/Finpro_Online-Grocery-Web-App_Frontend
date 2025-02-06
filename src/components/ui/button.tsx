import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "primary";
}

const Button: React.FC<ButtonProps> = ({ variant = "primary", className, ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md transition ${
        variant === "ghost"
          ? "bg-transparent hover:bg-gray-200"
          : "bg-blue-600 text-white hover:bg-blue-700"
      } ${className}`}
      {...props}
    />
  );
};

export default Button;
