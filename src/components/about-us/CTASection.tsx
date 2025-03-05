// components/about/CTASection.tsx
import React, { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeIn } from "./animationVariant";

const CTASection: React.FC = () => {
  const ctaRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={ctaRef} className="relative py-24 overflow-hidden">
      {/* Dramatic background with position:fixed for a strong parallax effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-[#090921]/95 to-purple-900/90"></div>

        {/* Light rays */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute top-0 right-0 w-[500px] h-[800px] bg-gradient-to-b from-blue-500 via-transparent to-transparent transform rotate-[20deg] blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[800px] bg-gradient-to-t from-purple-500 via-transparent to-transparent transform -rotate-[20deg] blur-3xl"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-200">
              Experience TechElite Today
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Discover our premium electronics selection and join thousands of
              satisfied customers who ve elevated their tech experience.
            </p>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Shop Now Button - Matching your screenshot */}
              <Link
                href="/products"
                className="bg-black border border-indigo-600/30 rounded-md py-3 px-6 text-white font-medium flex items-center justify-center group transition-all duration-300 hover:border-indigo-600/80"
              >
                <span>Shop Now</span>
                <svg
                  className="ml-2 w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform duration-300"
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
              </Link>

              {/* Contact Us Button - Matching your screenshot */}
              <Link
                href="/contact"
                className="bg-transparent border border-white/30 rounded-md py-3 px-6 text-white font-medium flex items-center justify-center group transition-all duration-300 hover:border-white/70"
              >
                <span>Contact Us</span>
                <svg
                  className="ml-2 w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  ></path>
                </svg>
              </Link>
            </div>

            {/* Newsletter subscription */}
            <div className="mt-12 max-w-md mx-auto">
              <div className="relative">
                <div className="relative flex bg-[#0a0a20] border border-white/20 rounded-md overflow-hidden">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-transparent border-0 outline-none px-4 py-3 text-white placeholder-gray-400"
                  />
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium px-6 py-3">
                    Subscribe
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Stay updated with our latest products and exclusive offers
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
