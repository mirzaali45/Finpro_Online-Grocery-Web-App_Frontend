// components/about/StatsSection.tsx
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { scaleIn } from "./animationVariant";
import { stats } from "./data";

const StatsSection: React.FC = () => {
  const statsRef = useRef<HTMLDivElement>(null);

  // Parallax scroll effects
  const { scrollYProgress: statsScroll } = useScroll({
    target: statsRef,
    offset: ["start end", "end start"],
  });

  // Transform values for parallax effects
  const statsBackgroundX = useTransform(statsScroll, [0, 1], [-30, 30]);

  return (
    <section ref={statsRef} className="relative py-20 bg-black overflow-hidden">
      {/* Background that moves horizontally */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none z-0"
        style={{ x: statsBackgroundX }}
      >
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-900/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-900/20 blur-3xl"></div>
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
              <div className="relative text-center p-6 bg-[#0a0a20] rounded-xl hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {stat.count}
                </div>
                <div className="text-gray-300 text-lg font-medium">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
