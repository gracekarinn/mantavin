"use client";

import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Shield, Award, Zap, ClipboardCheck, GraduationCap } from "lucide-react";

const MantavinOffersSection = () => {
  const [activeSection, setActiveSection] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      title: "Data Safety",
      content: "Powered by our blockchain technology, we ensure all sensitive data remains encrypted & accessible only to authorized personnel.",
      icon: Shield,
      stats: "99.9% uptime",
      highlight: "Bank-grade encryption"
    },
    {
      title: "Proof of Work",
      content: "Using blockchain-based records, we provide digital certificates for employee's skills, training, and achievements. These credentials provide proof and makes verification easier.",
      icon: Award,
      stats: "10k+ certificates issued",
      highlight: "Blockchain verified"
    },
    {
      title: "Efficient Data Transfer",
      content: "With new technologies such as websocket, we eliminate bottlenecks in data processing and speed up the processes while maintaining data integrity.",
      icon: Zap,
      stats: "50ms latency",
      highlight: "Real-time sync"
    },
    {
      title: "Compliance Management",
      content: "Our platform automates compliance management, tracking & ensuring the delivery of all of your HR processes.",
      icon: ClipboardCheck,
      stats: "100% compliance rate",
      highlight: "Automated tracking"
    },
    {
      title: "Employee Training Platform",
      content: "Empower your workforce with seamless learning opportunities. Our employee training platform offers personalized learning paths to support growth & development.",
      icon: GraduationCap,
      stats: "95% completion rate",
      highlight: "AI-powered learning"
    }
  ];

  const handleClick = (index: number) => {
    setActiveSection(index);
    if (scrollContainerRef.current) {
      const button = scrollContainerRef.current.children[index] as HTMLElement;
      const buttonRect = button.getBoundingClientRect();
      const containerRect = scrollContainerRef.current.getBoundingClientRect();
      const scrollLeft = button.offsetLeft - (containerRect.width / 2) + (buttonRect.width / 3);

      scrollContainerRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const ActiveIcon = features[activeSection].icon;

  return (
    <div className="w-full py-16 bg-[#F0FFFA]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-teal-500 text-center mb-16">
          What Mantavin offers
        </h2>

        <Card className="bg-white rounded-lg shadow-lg p-8">
          <div className="relative">
            <div className="relative mb-12">
              <div
                ref={scrollContainerRef}
                className="flex items-center gap-8 px-4 overflow-x-auto hide-scrollbar"
                style={{
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                }}
              >
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <button
                      key={index}
                      className={`relative flex items-center text-lg whitespace-nowrap pb-2 px-4 transition-all ${
                        activeSection === index
                          ? 'text-[#3CDED0] font-medium scale-105'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => handleClick(index)}
                    >
                      <Icon className={`w-5 h-5 mr-2 ${activeSection === index ? 'text-[#3CDED0]' : 'text-gray-400'}`} />
                      {feature.title}
                    </button>
                  );
                })}
              </div>
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#E3E3E3]" />
              <div
                className="absolute bottom-0 left-4 h-0.5 bg-[#3CDED0] transition-all duration-300"
                style={{
                  width: `${100 / features.length}%`,
                  transform: `translateX(${activeSection * 100}%)`
                }}
              />
            </div>

            <div className="transition-all duration-300">
              <Card className="max-w-3xl mx-auto p-8 rounded-lg border-none shadow-none bg-gradient-to-br from-white to-teal-50/30">
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-teal-50 rounded-full">
                      <ActiveIcon className="w-8 h-8 text-[#3CDED0]" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-medium text-[#3CDED0] mb-2">
                    {features[activeSection].title}
                  </h3>
                  <div className="text-teal-500 font-medium mb-4">
                    {features[activeSection].highlight}
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {features[activeSection].content}
                  </p>
                  <div className="inline-block bg-teal-50 px-4 py-2 rounded-full">
                    <span className="text-[#3CDED0] font-medium">
                      {features[activeSection].stats}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MantavinOffersSection;
