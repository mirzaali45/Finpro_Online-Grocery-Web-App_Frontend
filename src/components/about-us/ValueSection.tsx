// components/about/ValuesSection.tsx
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeIn, staggerContainer, scaleIn } from "./animationVariant";
import { values } from "./data";

const ValuesSection: React.FC = () => {
  const valuesRef = useRef<HTMLDivElement>(null);

  // Parallax scroll effects
  const { scrollYProgress: valuesScroll } = useScroll({
    target: valuesRef,
    offset: ["start end", "end start"],
  });

  // Transform values for parallax effects
  const valuesBackgroundY = useTransform(valuesScroll, [0, 1], [50, -50]);

  return (
    <section
      ref={valuesRef}
      className="relative py-24 bg-black overflow-hidden"
    >
      {/* Background that moves with scroll */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none z-0"
        style={{ y: valuesBackgroundY }}
      >
        <div className="absolute -top-[400px] -right-[300px] w-[800px] h-[800px] rounded-full bg-blue-900/30 blur-3xl"></div>
        <div className="absolute -bottom-[400px] -left-[300px] w-[800px] h-[800px] rounded-full bg-purple-900/30 blur-3xl"></div>
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
            Our Values
          </motion.h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid sm:grid-cols-3 gap-8"
        >
          {values.map((value, index) => (
            <motion.div key={index} variants={scaleIn} className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/50 to-purple-600/50 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
              <div className="relative bg-[#0a0a20] p-8 rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 h-full">
                <div className="text-5xl mb-6">{value.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {value.title}
                </h3>
                <p className="text-gray-300 text-lg">{value.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ValuesSection;
