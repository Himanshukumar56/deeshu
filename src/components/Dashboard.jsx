import React, { useState, useEffect } from "react";
import {
  Heart,
  MapPin,
  Clock,
  Calendar,
  Star,
  Users,
  Camera,
  Gift,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import ConnectionRequests from "./ConnectionRequests";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import DailyGoals from "./DailyGoals";

const Dashboard = () => {
  const { userData } = useAuth();
  const [partnerData, setPartnerData] = useState(null);
  const [time, setTime] = useState("");
  const [weather] = useState({
    main: { temp: 22 },
    weather: [{ main: "Sunny", icon: "01d" }],
  });

  useEffect(() => {
    const fetchPartnerData = async () => {
      if (userData && userData.partnerId) {
        const partnerDoc = await getDoc(doc(db, "users", userData.partnerId));
        if (partnerDoc.exists()) {
          setPartnerData(partnerDoc.data());
        }
      }
    };
    fetchPartnerData();
  }, [userData]);

  useEffect(() => {
    const interval = setInterval(() => {
      const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      setTime(new Intl.DateTimeFormat("en-US", options).format(new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      {/* Floating Hearts Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-rose-200 opacity-20">
          <Heart size={24} />
        </div>
        <div className="absolute top-40 right-20 text-pink-200 opacity-20">
          <Heart size={20} />
        </div>
        <div className="absolute bottom-32 left-20 text-purple-200 opacity-20">
          <Heart size={28} />
        </div>
        <div className="absolute bottom-20 right-10 text-rose-200 opacity-20">
          <Heart size={16} />
        </div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-4">
              <Heart className="text-rose-500 mr-3" size={32} />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent dark:text-white">
                Our Journey Together
              </h1>
              <Heart className="text-rose-500 ml-3" size={32} />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
              Stay connected, share beautiful memories, and plan amazing moments
              together.
            </p>
          </div>

          {!userData || !userData.partnerId ? (
            <>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl mb-8 text-center border border-rose-100 dark:border-gray-700">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-4 rounded-full">
                    <Users className="text-white" size={32} />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Connect with your partner
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Start your beautiful journey together
                </p>
                <Link
                  to="/find-partner"
                  className="inline-flex items-center bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-8 rounded-full hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
                >
                  <Heart className="mr-2" size={20} />
                  Find Partner
                </Link>
              </div>
              <ConnectionRequests />
            </>
          ) : (
            <>
              {/* Partner Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* User's Card */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-rose-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-xl">
                          {userData.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h2 className="font-bold text-2xl text-gray-800 dark:text-white">
                          {userData.username}
                        </h2>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <MapPin size={16} className="mr-1" />
                          <span>{userData.location || "Not set"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                        <Clock size={16} className="mr-1" />
                        <span className="text-sm">Local Time</span>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                        {time}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Friday, Jul 4
                      </p>
                    </div>
                  </div>

                  {weather && (
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 p-4 rounded-2xl">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-2xl">☀️</span>
                        </div>
                        <div className="ml-4">
                          <p className="text-2xl font-bold text-gray-800 dark:text-white">
                            {weather.main.temp}°C
                          </p>
                          <p className="text-gray-600 dark:text-gray-300">
                            {weather.weather[0].main}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Partner's Card */}
                {partnerData && (
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-purple-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-bold text-xl">
                            {partnerData.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h2 className="font-bold text-2xl text-gray-800 dark:text-white">
                            {partnerData.username}
                          </h2>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <MapPin size={16} className="mr-1" />
                            <span>{partnerData.location || "Not set"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                          <Clock size={16} className="mr-1" />
                          <span className="text-sm">Local Time</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                          {time}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Friday, Jul 4
                        </p>
                      </div>
                    </div>

                    {weather && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                            <span className="text-2xl">☀️</span>
                          </div>
                          <div className="ml-4">
                            <p className="text-2xl font-bold text-gray-800">
                              {weather.main.temp}°C
                            </p>
                            <p className="text-gray-600">
                              {weather.weather[0].main}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {userData && userData.partnerId && <DailyGoals />}

            {/* Upcoming Together */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-purple-100">
              <div className="flex items-center mb-6">
                <Calendar className="text-purple-500 mr-3" size={28} />
                <h2 className="text-2xl font-bold text-gray-800">
                  Upcoming Together
                </h2>
              </div>

              <div className="space-y-4">
                <div className="text-center text-gray-500">
                  Nothing planned yet.
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/shared-calendar"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold flex items-center justify-center"
                >
                  <Calendar className="mr-2" size={20} />
                  View Full Calendar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
