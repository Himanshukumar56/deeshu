import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeSwitch = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-3xl font-bold text-brand-primary">DeeShu</Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/dashboard" className="text-gray-500 dark:text-gray-300 hover:text-brand-primary px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
              <Link to="/scrapbook" className="text-gray-500 dark:text-gray-300 hover:text-brand-primary px-3 py-2 rounded-md text-sm font-medium">Memories</Link>
              <Link to="/communication" className="text-gray-500 dark:text-gray-300 hover:text-brand-primary px-3 py-2 rounded-md text-sm font-medium">Notes</Link>
              <Link to="/shared-calendar" className="text-gray-500 dark:text-gray-300 hover:text-brand-primary px-3 py-2 rounded-md text-sm font-medium">Calendar</Link>
              <Link to="/profile" className="text-gray-500 dark:text-gray-300 hover:text-brand-primary px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button onClick={handleThemeSwitch} className="p-2 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">
              Logout
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/dashboard" className="text-gray-500 hover:text-brand-primary block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
            <Link to="/scrapbook" className="text-gray-500 hover:text-brand-primary block px-3 py-2 rounded-md text-base font-medium">Memories</Link>
            <Link to="/communication" className="text-gray-500 hover:text-brand-primary block px-3 py-2 rounded-md text-base font-medium">Notes</Link>
            <Link to="/shared-calendar" className="text-gray-500 hover:text-brand-primary block px-3 py-2 rounded-md text-base font-medium">Calendar</Link>
            <Link to="/profile" className="text-gray-500 hover:text-brand-primary block px-3 py-2 rounded-md text-base font-medium">Profile</Link>
            <button onClick={handleLogout} className="w-full text-left bg-red-600 text-white block px-3 py-2 rounded-md text-base font-medium">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
