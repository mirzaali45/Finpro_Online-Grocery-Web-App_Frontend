// components/about/PartnersSection.tsx
import React from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "./animationVariant";
import { partners } from "./data";

const PartnersSection: React.FC = () => {
  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Trusted Technology Partners
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex flex-wrap justify-center items-center gap-12"
        >
          {partners.map((partner, index) => (
            <motion.div key={index} variants={fadeIn} className="text-center">
              <div className="w-32 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white/50 font-medium">{partner}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;
