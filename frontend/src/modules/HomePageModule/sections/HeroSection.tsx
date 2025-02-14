"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const router = useRouter();

  return (
    <section className="relative flex flex-col items-center justify-center text-center pt-16 pb-0 bg-[#F0FFFA] overflow-hidden">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 tracking-wider">
        <Image src="/logo.svg" alt="Mantavin Logo" width={25} height={32} />
        MANTAVIN
      </h2>
      <h1 className="text-5xl font-bold text-gray-900 mt-2">
        The HR Department’s Best Friend
      </h1>
      <p className="text-gray-600 mt-4 max-w-2xl">
        Automate HR tasks, verify employee credentials, track training progress, and store secure workforce data—all in one place.
      </p>
      <div className="mt-6 space-x-4">
        <Button
          variant="outline"
          className="border-teal-500 text-[#1B9E93]"
          onClick={() => router.push('/login')}
        >
          Log in
        </Button>
        <Button
          className="bg-teal-500 font-bold text-white hover:bg-teal-600"
          onClick={() => router.push('/register')}
        >
          Get Started
        </Button>
      </div>
      <div className="relative w-full max-w-4xl mt-12 flex justify-center items-center">
        <Image
          src="/detail.svg"
          alt="Decorative Detail"
          width={800}
          height={400}
          className="w-full h-auto z-0 right-0 transform translate-x-[10%]"
        />
        <Image
          src="/detail.svg"
          alt="Second Decorative Detail"
          width={700}
          height={350}
          className="w-full h-auto absolute top-10 left-0 transform -translate-x-[10%] z-10"
        />
      </div>
    </section>
  );
};

export default HeroSection;
