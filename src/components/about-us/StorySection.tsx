// components/about/StorySection.tsx
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeIn, fadeInLeft, fadeInRight } from "./animationVariant";

const StorySection: React.FC = () => {
  const storyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Parallax scroll effects
  const { scrollYProgress: storyScroll } = useScroll({
    target: storyRef,
    offset: ["start end", "end start"],
  });

  // Transform values for parallax effects
  const storyImageY = useTransform(storyScroll, [0, 1], [100, -100]);
  const storyTextY = useTransform(storyScroll, [0, 1], [50, -50]);

  return (
    <section
      id="our-story"
      ref={storyRef}
      className="relative py-24 bg-[#090921] overflow-hidden"
    >
      {/* Background parallax elements */}
      <motion.div
        className="absolute inset-0 opacity-30 pointer-events-none z-0"
        style={{ y: storyImageY }}
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-3xl"></div>
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-4xl font-bold mb-4"
          >
            Our Story
          </motion.h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInLeft}
            className="relative h-80 md:h-96 rounded-xl overflow-hidden shadow-2xl group"
            style={{ y: storyImageY }}
          >
            {/* Video lighting effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>

            {/* Video element instead of Image */}
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-700"
              >
                <source
                  src="https://res.cloudinary.com/dak07ttxh/video/upload/v1741175412/Product_Launch_Video_so0dmc.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInRight}
            style={{ y: storyTextY }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              From Passion to Excellence
            </h3>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              Founded in 2025, TechElite began with a simple mission: to make
              premium technology accessible to everyone. What started as a small
              online store has grown into one of the most trusted electronics
              retailers in the region.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Our journey is driven by a passion for innovation and exceptional
              customer service. We believe that everyone deserves access to
              high-quality electronics that enhance their lives.
            </p>

            <div className="mt-8 flex items-center space-x-4">
              <div className="w-12 h-1 bg-blue-500 rounded-full"></div>
              <span className="text-blue-400 font-medium">
                Established 2025
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
