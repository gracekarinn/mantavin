"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/context/auth';

export const Navbar = () => {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="w-full border-b bg-white">
      <div className="flex justify-between items-center px-[42px] py-[21px]">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
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
            {isAuthenticated && (
              <Link href="/dashboard" className="text-base text-neutral-800 hover:text-teal-500 transition-colors">
                Dashboard
              </Link>
            )}
            <Link href="/verify" className="text-base text-neutral-800 hover:text-teal-500 transition-colors">
              Verify
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
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
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-neutral-900">{user?.email}</span>
                    <span className="text-xs text-neutral-500">Mantavin</span>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar-placeholder.png" />
                    <AvatarFallback>{user?.email?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
