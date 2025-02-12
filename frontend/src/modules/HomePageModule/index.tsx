import React from "react";
import HeroSection from "./sections/HeroSection";  
import DemoSection from "./sections/DemoSection";
import MantavinOffersSection from "./sections/MantavinOffersSection";
import FAQSection from "./sections/FAQSection";
import CTASection from "./sections/CTASection";

export const HomePageModule = () => {
  return (
    <>
      <HeroSection />
      <DemoSection />
      <MantavinOffersSection />
      <FAQSection />
      <CTASection />
    </>
  );
};
