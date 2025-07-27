import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Menu, X, Bell } from "lucide-react";

const Navbar = () => {
  const { logout, unreadNotifications } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="text-3xl font-bold text-brand-primary dark:text-white"
            >
              DeeShu
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-600 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                to="/memories"
                className="text-gray-600 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:text-white"
              >
                Memories
              </Link>
              <Link
                to="/notes"
                className="text-gray-600 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:text-white"
              >
                Notes
              </Link>
              <Link
                to="/shared-calendar"
                className="text-gray-600 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:text-white"
              >
                Calendar
              </Link>
              <Link
                to="/communication"
                className="text-gray-600 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:text-white"
              >
                Chat
              </Link>
              <Link
                to="/profile"
                className="text-gray-600 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:text-white"
              >
                Profile
              </Link>
              <Link
                to="/find-partner"
                className="text-gray-600 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:text-white"
              >
                Find Partner
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Link to="/notifications">
                <Bell size={24} className="text-gray-500 dark:text-gray-400 hover:text-brand-primary" />
                {unreadNotifications && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
                )}
              </Link>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md cursor-pointer"
            >
              Logout
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/dashboard"
              className="text-gray-600 dark:text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              to="/memories"
              className="text-gray-600 dark:text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:text-white"
            >
              Memories
            </Link>
            <Link
              to="/notes"
              className="text-gray-600 dark:text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:text-white"
            >
              Notes
            </Link>
            <Link
              to="/shared-calendar"
              className="text-gray-600 dark:text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:text-white"
            >
              Calendar
            </Link>
            <Link
              to="/communication"
              className="text-gray-600 dark:text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:text-white"
            >
              Chat
            </Link>
            <Link
              to="/profile"
              className="text-gray-600 dark:text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:text-white"
            >
              Profile
            </Link>
            <Link
              to="/find-partner"
              className="text-gray-600 dark:text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:text-white"
            >
              Find Partner
            </Link>
            <div className="flex justify-between items-center px-3 py-2">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
