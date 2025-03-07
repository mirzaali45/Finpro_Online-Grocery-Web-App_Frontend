"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Github, Linkedin } from "lucide-react";

export default function Footer() {
  const teamMembers = [
    {
      name: "Dzaky Athariq Ferreira",
      linkedin: "https://linkedin.com/in/dzaky",
      github: "https://github.com/dzaky",
      instagram: "https://instagram.com/dzaky",
    },
    {
      name: "Mirza Ali Yusuf",
      linkedin: "https://linkedin.com/in/mirza",
      github: "https://github.com/mirza",
      instagram: "https://instagram.com/mirza",
    },
    {
      name: "Shania Azzahra",
      linkedin: "https://linkedin.com/in/shania",
      github: "https://github.com/shania",
      instagram: "https://instagram.com/shania",
    },
  ];

  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo and Description */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image
                src="/hp.png"
                alt="TechElite Logo"
                width={30}
                height={30}
                className="object-contain"
              />
              <span className="text-xl font-bold">TechElite</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Your premium tech destination.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/our-store"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Our Store
                </Link>
              </li>
              <li>
                <Link
                  href="/deals"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/shipping-info"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns-info"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/orderstatus-info"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Order Status
                </Link>
              </li>
              <li>
                <Link
                  href="/payment-info"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Payment Options
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Team */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Team</h3>
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex flex-col">
                  <p className="text-white mb-2">{member.name}</p>
                  <div className="flex space-x-3">
                    <Link
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                      aria-label={`${member.name}'s LinkedIn`}
                    >
                      <Linkedin size={20} />
                    </Link>
                    <Link
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                      aria-label={`${member.name}'s GitHub`}
                    >
                      <Github size={20} />
                    </Link>
                    <Link
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-pink-400 transition-colors"
                      aria-label={`${member.name}'s Instagram`}
                    >
                      <Instagram size={20} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          © 2025 TechElite. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
