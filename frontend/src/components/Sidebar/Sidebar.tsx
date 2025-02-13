import React from 'react';
import { sidebarItems } from './constant';
import { Button } from "@/components/ui/button";

export const Sidebar = () => {
  return (
    <div className="flex flex-col bg-white w-64 min-h-screen p-4 border-r">
      <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="w-full justify-start gap-3 font-normal"
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
