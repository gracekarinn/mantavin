"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

interface User {
  email: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const checkAuth = async () => {
    const token = getCookie("accessToken");
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    deleteCookie("accessToken");
    router.push("/login");
  };

  useEffect(() => {
    const token = getCookie("accessToken");
    if (token) {
      checkAuth();
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      logout,
      checkAuth,
      setUser,
      setIsAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
