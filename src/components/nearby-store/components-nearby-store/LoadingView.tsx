"use client";

import React from "react";

export default function LoadingView() {
  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[400px] -left-[300px] w-[600px] h-[600px] rounded-full bg-gray-800/5 blur-3xl"></div>
        <div className="absolute -bottom-[400px] -right-[300px] w-[600px] h-[600px] rounded-full bg-gray-800/5 blur-3xl"></div>

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(50, 50, 50, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(50, 50, 50, 0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Sophisticated loader */}
        <div className="relative w-20 h-20">
          {/* Outer spinner */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gray-400 animate-spin"></div>

          {/* Inner spinner */}
          <div className="absolute inset-[4px] rounded-full border-4 border-gray-700"></div>
          <div
            className="absolute inset-[4px] rounded-full border-4 border-transparent border-t-gray-500 animate-spin"
            style={{ animationDuration: "0.8s" }}
          ></div>

          {/* Center dot */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-400 animate-pulse"></div>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Locating Stores
          </h2>
          <p className="text-gray-400">Finding the best tech stores near you</p>
        </div>
      </div>
    </div>
  );
}
