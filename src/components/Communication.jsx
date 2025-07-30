import React from "react";
import Chat from "./Chat";
import { useAuth } from "../hooks/useAuth";
import { Heart, MessageSquare } from "lucide-react";

const Communication = () => {
  const { userData } = useAuth();
  const partnerId = userData ? userData.partnerId : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-rose-200 dark:text-rose-800 opacity-20">
          <Heart size={24} />
        </div>
        <div className="absolute top-40 right-20 text-pink-200 dark:text-pink-800 opacity-20">
          <Heart size={20} />
        </div>
        <div className="absolute bottom-32 left-20 text-purple-200 dark:text-purple-800 opacity-20">
          <Heart size={28} />
        </div>
        <div className="absolute bottom-20 right-10 text-rose-200 dark:text-rose-800 opacity-20">
          <Heart size={16} />
        </div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-4">
              <MessageSquare className="text-rose-500 mr-3" size={32} />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent dark:from-rose-400 dark:via-pink-400 dark:to-purple-400 dark:text-transparent">
                Stay Connected
              </h1>
              <MessageSquare className="text-rose-500 ml-3" size={32} />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
              Real-time messaging to share your thoughts and moments.
            </p>
          </div>

          <div
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-rose-100 dark:border-gray-700 overflow-hidden"
            style={{ height: "70vh" }}
          >
            {partnerId ? (
              <Chat partnerId={partnerId} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">
                  You don't have a partner connected yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communication;
