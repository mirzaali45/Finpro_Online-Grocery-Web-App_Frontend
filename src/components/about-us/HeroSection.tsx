// components/about/HeroSection.tsx
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeIn } from "./animationVariant";

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Handle mouse movement for parallax effect (only on desktop)
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      setMousePosition({ x, y });
    };

    if (heroRef.current) {
      heroRef.current.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (heroRef.current) {
        heroRef.current.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [isMobile]);

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden">
      {/* Parallax Video Background (desktop) or Static Video Background (mobile) */}
      <div
        className="absolute inset-0 z-0 bg-black"
        style={
          isMobile
            ? {}
            : {
                transform: `translate(${mousePosition.x * -30}px, ${
                  mousePosition.y * -30
                }px) scale(1.1)`,
                transition: "transform 0.1s ease-out",
              }
        }
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover opacity-40"
          style={{ objectFit: "cover" }}
        >
          <source
            src="https://res.cloudinary.com/dak07ttxh/video/upload/v1741171824/Orange_and_Black_Bold_Creative_Animated_Welcome_Channel_Youtube_Intro_Video_o0f6ak.mp4"
            type="video/mp4"
          />
          {/* Fallback for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Hero Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-[#090921]/90 z-[1]"></div>

      {/* Hero Lighting Effects - Static, Not Moving */}
      <div className="absolute inset-0 z-[2]">
        <div className="absolute top-0 right-0 w-[500px] h-[800px] bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent transform rotate-[20deg] blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[800px] bg-gradient-to-t from-indigo-500/10 via-blue-500/5 to-transparent transform -rotate-[20deg] blur-3xl"></div>
      </div>

      {/* Decorative Tech Elements (desktop only) */}
      {!isMobile && (
        <div
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{
            transform: `translate(${mousePosition.x * -50}px, ${
              mousePosition.y * -50
            }px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <div className="absolute top-[20%] right-[15%] w-32 h-32 border border-blue-500/20 rounded-full backdrop-blur-sm"></div>
          <div className="absolute bottom-[30%] left-[10%] w-24 h-24 border border-purple-500/20 rounded-full backdrop-blur-sm"></div>
        </div>
      )}

      {/* Content with different styling for mobile vs desktop */}
      <div
        className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center"
        style={
          isMobile
            ? {}
            : {
                transform: `translate(${mousePosition.x * 15}px, ${
                  mousePosition.y * 15
                }px)`,
                transition: "transform 0.2s ease-out",
              }
        }
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className={`${isMobile ? "max-w-full text-center" : "max-w-3xl"}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <span className="inline-block text-blue-400 text-lg uppercase tracking-widest font-medium mb-2">
              About Us
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className={`font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-300 to-purple-300 ${
              isMobile
                ? "text-3xl sm:text-4xl"
                : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            }`}
          >
            The Story Behind TechElite
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className={`text-gray-300 mb-8 leading-relaxed ${
              isMobile ? "text-base" : "text-lg md:text-xl"
            }`}
          >
            Discover the passion and innovation driving the premier destination
            for cutting-edge electronics and technology products.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className={`flex flex-wrap gap-4 ${
              isMobile ? "justify-center" : ""
            }`}
          >
            {/* Enhanced Explore Products Button */}
            <Link
              href="/products"
              className="relative group"
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 group-hover:inset-1 transition-all duration-300"></div>
              <div className="relative bg-black px-6 py-3 rounded-lg flex items-center overflow-hidden">
                <span className="text-white font-medium transition duration-300 mr-2">
                  Explore Products
                </span>
                <div className="relative">
                  <svg
                    className={`w-5 h-5 text-white transition-transform duration-300 ${
                      isButtonHovered ? "translate-x-5 opacity-0" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                  <svg
                    className={`absolute top-0 left-0 w-5 h-5 text-white transition-transform duration-300 ${
                      isButtonHovered
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-5 opacity-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>

            {/* Mobile-optimized Our Story button */}
            <a
              href="#our-story"
              className="relative px-6 py-3 bg-transparent backdrop-blur-sm border border-white/20 hover:border-white/40 text-white font-medium rounded-lg transition duration-300 flex items-center"
            >
              <span>Our Story</span>
              <svg
                className="ml-2 w-5 h-5 text-white transform group-hover:translate-y-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                ></path>
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20"
      >
        <span className="text-white/50 text-sm mb-2">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <div className="w-1.5 h-3 bg-white/60 rounded-full animate-scroll-down"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
