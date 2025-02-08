"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  const images = ["/home/ip16.png", "/home/s25.jpg","/home/gpix.jpg"]; // Add all your image paths
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsTransitioning(false);
      }, 500); // Half of transition duration for smooth crossfade
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Images */}
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentImageIndex === index && !isTransitioning
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          <Image
            src={image}
            alt={`Background ${index + 2}`}
            fill
            priority={index === 0}
            className="object-cover object-center"
          />
        </div>
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-gray-900/70" />

      {/* Content Container */}
      <div className="relative z-10 text-center max-w-[1440px] min-h-screen flex justify-center items-center mx-auto px-4 sm:px-6 md:px-8 pb-5 lg:px-16 xl:px-20">
        <div className="pt-12 md:pt-8 lg:pt-8">
          {/* Heading */}
          <h1 className="text-white text-3xl sm:text-7xl md:text-6xl lg:text-6xl xl:text-6xl font-bold leading-[1.1] mb-6 md:mb-8 lg:mb-10">
            Experience Premium
            <br />
            <i className="text-sky-400">Tech</i> Excellence
          </h1>

          {/* Description */}
          <p className="text-gray-300 text-sm sm:text-sm md:text-md lg:text-2xl mb-8 md:mb-10 lg:mb-12 max-w-4xl">
            Discover our curated collection
            <br />
             of premium phones and innovative
            gadgets.
          </p>

          {/* CTA Button */}
          <Link
            href="/products"
            className="inline-block px-5 py-2 bg-white text-black rounded-md text-xl md:text-2xl font-medium hover:bg-gray-100 transition-colors"
          >
            Shop Now
            <i className="bi bi-arrow-right ml-3"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
