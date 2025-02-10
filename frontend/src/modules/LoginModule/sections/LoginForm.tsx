"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loginSchema, type submitLoginData } from "../constants";
import { toast } from "sonner";
import { setCookie } from "cookies-next";

export const LoginForm = () => {
  const route = useRouter();
  const form = useForm<submitLoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: submitLoginData) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        if (res.ok) {
          const { accessToken, refreshToken } = await res.json();
          setCookie("accessToken", accessToken, { maxAge: 60 * 60 * 24 });
          setCookie("refreshToken", refreshToken, { maxAge: 60 * 60 * 24 });
          toast.success("Login Success");
          route.replace("/main");
        } else {
          toast.error("Invalid Email or Password dm @mentrikominfo on X");
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-2xl rounded-lg border border-gray-100">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">Welcome Back</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        className="ring-1 ring-gray-200 focus:ring-2 focus:ring-teal-500 rounded-lg py-2 px-3 transition duration-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        className="ring-1 ring-gray-200 focus:ring-2 focus:ring-teal-500 rounded-lg py-2 px-3 transition duration-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
              >
                Sign In
              </Button>
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="text-teal-600 hover:text-teal-700 font-medium hover:underline transition duration-150 ease-in-out"
                  >
                    Register here
                  </Link>
                </span>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
