"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Pencil, User, Mail, Lock } from "lucide-react";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<RegisterForm>();
  const [isMounted, setIsMounted] = React.useState(false);

  const onSubmit = (data: RegisterForm) => {
    console.log(data);
    router.push("/");
  };

  React.useEffect(() => {
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
            <div className="bg-pink-500/10 p-3 rounded-full">
              <Pencil className="w-8 h-8 text-pink-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">
            Create Account
          </h2>
          <div className="text-gray-400 text-center mb-8">
            Join CollabCanvas and start creating
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("name")}
                  type="text"
                  className="w-full bg-gray-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("email")}
                  type="email"
                  className="w-full bg-gray-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Enter your email"
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
                  className="w-full bg-gray-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 py-3 rounded-lg font-semibold transition-colors"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-pink-400 hover:text-pink-300 font-medium"
            >
              Sign in
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
