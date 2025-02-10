import React from 'react'
import Link from 'next/link';

export const Navbar = () => {
    return (
      <nav className="w-full border-b border-[#2B2B2B] bg-white flex justify-between items-center px-[42px] py-[21px]">
        <div className="flex items-center gap-8">
          <span className="text-xl text-black font-semibold">Logo</span>
          <div className="flex gap-6">
            <Link href="/" className="text-base text-[#2B2B2B]">Home</Link>
            <Link href="/verify" className="text-base text-[#2B2B2B]">Verify</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-[#2B2B2B] border border-[#21C0B3] rounded">Log in</button>
          <button className="px-4 py-2 bg-teal-500 text-black rounded">Register</button>
        </div>
      </nav>
    );
  };
