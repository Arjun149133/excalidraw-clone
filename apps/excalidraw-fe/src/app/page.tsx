"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Pencil, Users, LogOut, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const router = useRouter();
  const [showRoomDialog, setShowRoomDialog] = useState(false);
  const [roomAction, setRoomAction] = useState<"create" | "join" | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Pencil className="w-8 h-8 text-purple-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              CollabCanvas
            </h1>
          </div>
          {!token ? (
            <LoginButtons />
          ) : (
            <div>
              <button
                onClick={() => router.push("/login")}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">
            Welcome to CollabCanvas
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Choose your creative space - work solo or collaborate with others
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Offline Canvas Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800 rounded-xl p-6 cursor-pointer"
              onClick={() => router.push("/canvas/me")}
            >
              <div className="h-40 flex items-center justify-center bg-gray-700 rounded-lg mb-4">
                <Pencil className="w-16 h-16 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personal Canvas</h3>
              <p className="text-gray-400">
                Work on your diagrams privately. All your work is saved locally.
              </p>
            </motion.div>

            {/* Collaborative Canvas Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800 rounded-xl p-6 cursor-pointer"
              onClick={() => setShowRoomDialog(true)}
            >
              <div className="h-40 flex items-center justify-center bg-gray-700 rounded-lg mb-4">
                <Users className="w-16 h-16 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Collaborative Space
              </h3>
              <p className="text-gray-400">
                Create or join a room to collaborate with others in real-time.
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Room Dialog */}
      {showRoomDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-xl p-6 max-w-md w-full"
          >
            {!roomAction ? (
              <div className=" relative">
                <span className=" absolute top-0 right-1 cursor-pointer">
                  <button onClick={() => setShowRoomDialog(false)}>
                    <XIcon />
                  </button>
                </span>
                <h3 className="text-2xl font-bold mb-6 text-center">
                  Choose an Option
                </h3>
                {!token ? (
                  <div>
                    <p className="text-gray-400 text-center mb-8">
                      You need to be logged in to create or join a room
                    </p>
                    <div className="flex justify-center">
                      <LoginButtons />
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setRoomAction("create")}
                      className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
                    >
                      Create a Room
                    </button>
                    <button
                      onClick={() => setRoomAction("join")}
                      className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                    >
                      Join a Room
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-6 text-center">
                  {roomAction === "create" ? "Create a Room" : "Join a Room"}
                </h3>
                <input
                  type="text"
                  placeholder={
                    roomAction === "create" ? "Room name" : "Room code"
                  }
                  className="w-full p-3 bg-gray-700 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setShowRoomDialog(false);
                      router.push("/collaborative-canvas");
                    }}
                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
                  >
                    {roomAction === "create" ? "Create" : "Join"}
                  </button>
                  <button
                    onClick={() => setRoomAction(null)}
                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                  >
                    Back
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}

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
