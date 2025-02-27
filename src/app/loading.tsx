import React from "react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="loader-dominoes-container">
        <div className="loader-dominoes"></div>
        <p className="loading-text">Loading...</p>
      </div>
    </div>
  );
}


