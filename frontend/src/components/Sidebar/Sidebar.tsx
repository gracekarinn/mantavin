"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { sidebarItems } from './constant';
import { Button } from "@/components/ui/button";

export const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-col bg-white w-64 min-h-screen p-4 border-r">
      <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.label}
            variant={pathname === item.href ? "default" : "ghost"}
            className="w-full justify-start gap-3 font-normal"
            onClick={() => router.push(item.href)}
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
