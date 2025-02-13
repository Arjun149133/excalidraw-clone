"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const LoginButtons = () => {
  const router = useRouter();

  return (
    <div className=" flex gap-5">
      <Button
        onClick={() => router.push("/register")}
        className=" bg-pink-600 hover:bg-pink-500"
      >
        Sign Up
      </Button>
      <Button
        onClick={() => router.push("/login")}
        className=" bg-violet-600 hover:bg-violet-500"
      >
        Login
      </Button>
    </div>
  );
};

export default LoginButtons;
