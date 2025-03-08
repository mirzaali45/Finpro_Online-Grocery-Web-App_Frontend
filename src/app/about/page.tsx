// app/about/page.tsx
"use client";

import React from "react";
import HeroSection from "@/components/about-us/HeroSection";
import StorySection from "@/components/about-us/StorySection";
import ValuesSection from "@/components/about-us/ValueSection";
import TeamSection from "@/components/about-us/TeamSection";
import StatsSection from "@/components/about-us/StatsSection";
import CTASection from "@/components/about-us/CTASection";
import PartnersSection from "@/components/about-us/PartnerSection";
import CustomCursor from "@/components/about-us/CustomCursor";

export default function AboutUs() {
  return (
    <div className="bg-black text-white overflow-hidden">
      <HeroSection />
      <StorySection />
      <ValuesSection />
      <TeamSection />
      <StatsSection />
      <CTASection />
      <PartnersSection />
      <CustomCursor />
    </div>
  );
}
