"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  const images = ["/home/ip16.png", "/home/s25.jpg", "/home/gpix.jpg"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Multiple parallax refs for different layers
  const heroRef = useRef<HTMLDivElement>(null);
  const parallaxLayerFast = useRef<HTMLDivElement>(null);
  const parallaxLayerMedium = useRef<HTMLDivElement>(null);
  const parallaxLayerSlow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Image rotation timer
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsTransitioning(false);
      }, 500);
    }, 6000);

    // Advanced parallax effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;

      const { clientX, clientY } = e;
      const rect = heroRef.current.getBoundingClientRect();

      // Calculate relative mouse position within the container
      const relativeX = (clientX - rect.left) / rect.width - 0.5;
      const relativeY = (clientY - rect.top) / rect.height - 0.5;

      setMousePosition({ x: relativeX, y: relativeY });

      // Apply different intensities of parallax to different layers
      if (parallaxLayerFast.current) {
        parallaxLayerFast.current.style.transform = `translate(${
          relativeX * -50
        }px, ${relativeY * -50}px)`;
      }

      if (parallaxLayerMedium.current) {
        parallaxLayerMedium.current.style.transform = `translate(${
          relativeX * -30
        }px, ${relativeY * -30}px)`;
      }

      if (parallaxLayerSlow.current) {
        parallaxLayerSlow.current.style.transform = `translate(${
          relativeX * -15
        }px, ${relativeY * -15}px)`;
      }
    };

    // Add initial loaded state with slight delay for animations
    setTimeout(() => setLoaded(true), 100);

    // Add mousemove event listener
    if (heroRef.current) {
      heroRef.current.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      clearInterval(timer);
      if (heroRef.current) {
        heroRef.current.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-screen w-full overflow-hidden">
      {/* Background Images with dramatic transitions */}
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentImageIndex === index && !isTransitioning
              ? "opacity-100"
              : "opacity-0"
          }`}
          style={{
            zIndex: currentImageIndex === index ? 1 : 0,
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={image}
              alt={`Background ${index + 1}`}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center transition-transform duration-[2000ms] brightness-[0.6] contrast-[1.1]"
              style={{
                transform:
                  currentImageIndex === index
                    ? `scale(1.05) translate(${mousePosition.x * 10}px, ${
                        mousePosition.y * 10
                      }px)`
                    : "scale(1.15)",
              }}
            />
          </div>
        </div>
      ))}

      {/* Darker, more powerful gradient overlays for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-black/85 mix-blend-multiply" />

      {/* Stronger vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,0.9)_90%)]" />

      {/* Subtle light streaks - static, not moving */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[800px] bg-gradient-to-b from-purple-500/5 via-indigo-500/5 to-transparent transform rotate-[20deg] blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[800px] bg-gradient-to-t from-blue-500/5 via-indigo-500/5 to-transparent transform -rotate-[20deg] blur-3xl" />
      </div>

      {/* Parallax content layers */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 min-h-screen flex flex-col justify-center">
        {/* Fast moving layer - decorative elements */}
        <div
          ref={parallaxLayerFast}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-[20%] right-[20%] w-32 h-32 rounded-full border border-white/10 backdrop-blur-sm" />
          <div className="absolute bottom-[30%] left-[15%] w-24 h-24 rounded-full border border-white/10 backdrop-blur-sm" />
          <div className="absolute bottom-[15%] right-[10%] w-40 h-40 rounded-full border border-white/10 backdrop-blur-sm" />
        </div>

        {/* Medium moving layer - accent text */}
        <div ref={parallaxLayerMedium} className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative mb-4"
          >
            <span className="text-lg md:text-xl uppercase tracking-[0.2em] font-medium text-white/50">
              TechElite Presents
            </span>
          </motion.div>
        </div>

        {/* Slow moving layer - main content */}
        <div ref={parallaxLayerSlow} className="relative">
          {/* Ultra-powerful heading with multiple effect layers */}
          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 30 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400 text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold leading-[1.1] mb-6 md:mb-8 lg:mb-10"
            >
              Experience Premium
              <br />
              Tech Excellence
            </motion.h1>

            {/* Animated heading underline glow */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: loaded ? 1 : 0, opacity: loaded ? 1 : 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute bottom-0 left-0 h-1.5 w-full origin-left bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 shadow-[0_0_15px_rgba(191,90,242,0.5)]"
            />
          </div>

          {/* Enhanced description */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 40 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-neutral-300 text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-8 md:mb-10 lg:mb-12 max-w-4xl drop-shadow-lg"
          >
            Discover our curated collection of premium phones and innovative
            gadgets for the discerning tech enthusiast.
          </motion.p>

          {/* Ultra-powerful CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 50 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            {/* Primary CTA Button with powerful effects */}
            <Link
              href="/products"
              className="group relative inline-flex items-center overflow-hidden"
            >
              {/* Button background glow effect */}
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 opacity-70 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

              {/* Button content */}
              <div className="relative px-8 py-4 bg-white rounded-lg overflow-hidden transition-all duration-300 ease-out transform group-hover:translate-y-[-2px]">
                <div className="relative flex items-center">
                  <span className="relative text-xl md:text-2xl font-medium text-neutral-900">
                    Shop Now
                  </span>
                  <svg
                    className="w-6 h-6 ml-2 transform transition-transform duration-300 ease-out group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                      className="text-neutral-950"
                    />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Secondary CTA Button with glass effect */}
            <Link
              href="/store-locator"
              className="group relative inline-flex items-center overflow-hidden"
            >
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-30 blur group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>

              <div className="relative px-8 py-4 bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden transition-all duration-300 ease-out border border-white/20 transform group-hover:translate-y-[-2px] group-hover:border-white/40">
                <div className="relative flex items-center">
                  <span className="relative text-xl md:text-2xl font-medium text-white">
                    Find Stores
                  </span>
                  <svg
                    className="w-6 h-6 ml-2 text-white transform transition-transform duration-300 ease-out group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
