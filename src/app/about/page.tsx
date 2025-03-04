// app/about/page.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6 } 
  }
};

// Value item type
type ValueItem = {
  icon: string;
  title: string;
  description: string;
};

// Team member type
type TeamMember = {
  name: string;
  role: string;
  imagePath: string;
};

// Stat item type
type StatItem = {
  count: string;
  label: string;
};

export default function AboutUs() {
  // References for parallax sections
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Mouse position state for hero parallax
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax scroll effects
  const { scrollYProgress: storyScroll } = useScroll({
    target: storyRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: valuesScroll } = useScroll({
    target: valuesRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: statsScroll } = useScroll({
    target: statsRef,
    offset: ["start end", "end start"],
  });

  // Transform values for parallax effects
  const storyImageY = useTransform(storyScroll, [0, 1], [100, -100]);
  const storyTextY = useTransform(storyScroll, [0, 1], [50, -50]);
  const valuesBackgroundY = useTransform(valuesScroll, [0, 1], [50, -50]);
  const statsBackgroundX = useTransform(statsScroll, [0, 1], [-30, 30]);

  // Handle mouse movement for hero section
  useEffect(() => {
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
  }, []);

  // Our values data
  const values: ValueItem[] = [
    {
      icon: "🔍",
      title: "Quality Assurance",
      description:
        "We select only the finest electronics products to ensure reliability and performance.",
    },
    {
      icon: "💡",
      title: "Innovation",
      description:
        "We continuously seek the latest technology to keep our catalog cutting-edge.",
    },
    {
      icon: "🤝",
      title: "Customer First",
      description:
        "Your satisfaction is our priority with responsive support and honest advice.",
    },
  ];

  // Team members data
  const team: TeamMember[] = [
    {
      name: "Shania Azzahra",
      role: "Founder",
      imagePath: "/images/team/alex.jpg",
    },
    {
      name: "Dzaky Athariq Ferreira",
      role: "Founder",
      imagePath: "/images/team/sarah.jpg",
    },
    {
      name: "Mirza",
      role: "Founder",
      imagePath: "/images/team/sarah.jpg",
    },
  ];

  // Stats data
  const stats: StatItem[] = [
    { count: "5+", label: "Years of Experience" },
    { count: "10,000+", label: "Happy Customers" },
    { count: "1,500+", label: "Products" },
    { count: "24/7", label: "Customer Support" },
  ];

  return (
    <div className="bg-black text-white overflow-hidden">
      {/* Hero Section with Mouse Parallax */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Parallax Background Layers */}
        <div
          className="absolute inset-0 z-0 bg-black"
          style={{
            transform: `translate(${mousePosition.x * -30}px, ${
              mousePosition.y * -30
            }px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <Image
            src="/images/tech-background.jpg"
            alt="Technology Background"
            fill
            style={{ objectFit: "cover" }}
            className="opacity-40 scale-110"
            priority
          />
        </div>

        {/* Hero Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-[#090921]/90 z-[1]"></div>

        {/* Hero Lighting Effects - Static, Not Moving */}
        <div className="absolute inset-0 z-[2]">
          <div className="absolute top-0 right-0 w-[500px] h-[800px] bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent transform rotate-[20deg] blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[800px] bg-gradient-to-t from-indigo-500/10 via-blue-500/5 to-transparent transform -rotate-[20deg] blur-3xl"></div>
        </div>

        {/* Decorative Tech Elements */}
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

        {/* Content that moves slightly with mouse */}
        <div
          className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center"
          style={{
            transform: `translate(${mousePosition.x * 15}px, ${
              mousePosition.y * 15
            }px)`,
            transition: "transform 0.2s ease-out",
          }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-3xl"
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
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-300 to-purple-300"
            >
              The Story Behind TechElite
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed"
            >
              Discover the passion and innovation driving the premier
              destination for cutting-edge electronics and technology products.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/products" className="relative group overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                <button className="relative bg-black px-6 py-3 rounded-lg leading-none flex items-center">
                  <span className="text-white font-medium transition duration-200">
                    Explore Products
                  </span>
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
                </button>
              </Link>

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

      {/* Our Story Section with Scroll Parallax */}
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
              {/* Image lighting effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>

              <Image
                src="/images/foundation.jpg"
                alt="TechElite Foundation"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-xl group-hover:scale-110 transition-transform duration-700"
              />
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
                Founded in 2018, TechElite began with a simple mission: to make
                premium technology accessible to everyone. What started as a
                small online store has grown into one of the most trusted
                electronics retailers in the region.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our journey is driven by a passion for innovation and
                exceptional customer service. We believe that everyone deserves
                access to high-quality electronics that enhance their lives.
              </p>

              <div className="mt-8 flex items-center space-x-4">
                <div className="w-12 h-1 bg-blue-500 rounded-full"></div>
                <span className="text-blue-400 font-medium">
                  Established 2018
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section with Parallax */}
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

      {/* Team Section with Parallax Hover Effects */}
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
                      <div className="flex justify-center space-x-4">
                        <a
                          href="#"
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                          </svg>
                        </a>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" />
                          </svg>
                        </a>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0c-6.628 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Horizontal Parallax */}
      <section
        ref={statsRef}
        className="relative py-20 bg-black overflow-hidden"
      >
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

      {/* CTA Section with Dramatic Background */}
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
                satisfied customers who've elevated their tech experience.
              </p>

              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link
                  href="/products"
                  className="relative group overflow-hidden inline-block"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                  <button className="relative bg-black px-8 py-4 rounded-lg leading-none flex items-center">
                    <span className="text-white font-medium text-lg">
                      Shop Now
                    </span>
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
                  </button>
                </Link>

                <Link
                  href="/contact"
                  className="relative px-8 py-4 bg-transparent backdrop-blur-sm border border-white/20 hover:border-white/40 text-white font-medium rounded-lg transition duration-300 flex items-center"
                >
                  <span className="text-lg">Contact Us</span>
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
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/50 to-purple-600/50 rounded-lg blur"></div>
                  <div className="relative flex bg-[#0a0a20] rounded-lg overflow-hidden">
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

      {/* Technologies & Partners Section */}
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
            {/* Replace with actual partner logos */}
            {["Apple", "Samsung", "Sony", "Google", "Microsoft"].map(
              (partner, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="text-center"
                >
                  <div className="w-32 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                    <span className="text-white/50 font-medium">{partner}</span>
                  </div>
                </motion.div>
              )
            )}
          </motion.div>
        </div>
      </section>

      {/* Custom cursor effect - optional */}
      <div
        className="fixed top-0 left-0 w-6 h-6 rounded-full border-2 border-blue-500 pointer-events-none z-50 hidden md:block"
        id="custom-cursor"
        style={{
          transform: "translate(-50%, -50%)",
        }}
      ></div>
    </div>
  );
}