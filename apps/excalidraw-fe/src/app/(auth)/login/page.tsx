"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Pencil, Mail, Lock } from "lucide-react";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginForm>();
  const [isMounted, setIsMounted] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/login`, data);

      if (res.status === 200) {
        const token = res.data.token;
        localStorage.setItem("token", token);
        router.push("/");
      }
    } catch (error: any) {
      console.error(error);
      setServerError(error.response.data.message);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gray-800 rounded-xl p-8 shadow-xl"
        >
          <div className="flex justify-center mb-8">
            <div className="bg-purple-500/10 p-3 rounded-full">
              <Pencil className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
          <div className="text-gray-400 text-center mb-8">
            Sign in to continue to CollabCanvas
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("email")}
                  type="email"
                  className="w-full bg-gray-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your password"
                  defaultValue={""}
                  required={true}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("password")}
                  type="password"
                  className="w-full bg-gray-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your password"
                  defaultValue={""}
                  required={true}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold transition-colors"
              >
                Sign In
              </button>
              {serverError && (
                <div className="text-center text-red-400 mt-2">
                  {serverError}
                </div>
              )}
            </div>
          </form>

          <div className="mt-6 text-center text-gray-400">
            Dont have an account?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Sign up
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
