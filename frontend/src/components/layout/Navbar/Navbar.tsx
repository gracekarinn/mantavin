"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="w-full border-b border-neutral-800 bg-white">
      <div className="flex justify-between items-center px-[42px]  py-[21px]">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={25}
              height={32}
              className="cursor-pointer"
            />
          </Link>
          <div className="flex ml-6 gap-10">
            <Link href="/" className="text-base text-neutral-800 hover:text-teal-500 transition-colors">
              Home
            </Link>
            <Link href="/verify" className="text-base text-neutral-800 hover:text-teal-500 transition-colors">
              Verify
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
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
      </div>
    </nav>
  );
};
