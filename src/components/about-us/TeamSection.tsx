// components/about/TeamSection.tsx
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer, scaleIn } from "./animationVariant";
import { team } from "./data";

const TeamMemberSocial: React.FC<{
  linkedin?: string;
  github?: string;
  instagram?: string;
}> = ({ linkedin, github, instagram }) => (
  <div className="flex justify-center space-x-4">
    {linkedin && (
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-blue-500 transition-colors"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.5c0-1.381-1.119-2.5-2.5-2.5s-2.5 1.119-2.5 2.5v5.5h-3v-10h3v1.562c.902-1.245 3.598-1.351 4.5 0v-1.562h3v10z" />
        </svg>
      </a>
    )}
    {github && (
      <a
        href={github}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-gray-300 transition-colors"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 .297c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.082-.729.082-.729 1.205.084 1.84 1.24 1.84 1.24 1.07 1.834 2.805 1.304 3.49.997.108-.776.418-1.304.76-1.604-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.465-2.382 1.235-3.222-.123-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.958-.267 1.984-.4 3.005-.405 1.02.005 2.047.138 3.005.405 2.29-1.552 3.296-1.23 3.296-1.23.654 1.653.242 2.874.12 3.176.77.84 1.232 1.912 1.232 3.222 0 4.61-2.805 5.625-5.475 5.922.43.372.815 1.103.815 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.217.694.825.576 4.765-1.585 8.2-6.081 8.2-11.384 0-6.627-5.373-12-12-12z" />
        </svg>
      </a>
    )}
    {instagram && (
      <a
        href={instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-pink-500 transition-colors"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.333 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.333-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.333-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.013-4.947.072-1.272.058-2.687.333-3.682 1.328-.995.995-1.27 2.41-1.328 3.682-.059 1.28-.072 1.688-.072 4.947s.013 3.667.072 4.947c.058 1.272.333 2.687 1.328 3.682.995.995 2.41 1.27 3.682 1.328 1.28.059 1.688.072 4.947.072s3.667-.013 4.947-.072c1.272-.058 2.687-.333 3.682-1.328.995-.995 1.27-2.41 1.328-3.682.059-1.28.072-1.688.072-4.947s-.013-3.667-.072-4.947c-.058-1.272-.333-2.687-1.328-3.682-.995-.995-2.41-1.27-3.682-1.328-1.28-.059-1.688-.072-4.947-.072zm0 5.838c-3.183 0-5.774 2.591-5.774 5.774s2.591 5.774 5.774 5.774 5.774-2.591 5.774-5.774-2.591-5.774-5.774-5.774zm0 9.499c-2.056 0-3.725-1.669-3.725-3.725s1.669-3.725 3.725-3.725 3.725 1.669 3.725 3.725-1.669 3.725-3.725 3.725zm6.406-9.837c0 .796-.646 1.442-1.442 1.442s-1.442-.646-1.442-1.442.646-1.442 1.442-1.442 1.442.646 1.442 1.442z" />
        </svg>
      </a>
    )}
  </div>
);

const TeamSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#090921] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-4xl font-bold mb-4 text-white"
          >
            Meet Our Team
          </motion.h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex justify-center"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/50 to-purple-600/50 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative bg-[#0a0a20] rounded-2xl overflow-hidden shadow-xl">
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={member.imagePath}
                      alt={member.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a20] to-transparent opacity-60"></div>
                  </div>
                  <div className="p-6 text-center relative">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-blue-400 font-medium mb-4">
                      {member.role}
                    </p>

                    {/* Social media icons */}
                    <TeamMemberSocial
                      linkedin={member.linkedin}
                      github={member.github}
                      instagram={member.instagram}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;