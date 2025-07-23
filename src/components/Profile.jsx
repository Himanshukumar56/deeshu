import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { User, Mail, MapPin, Save, Trash2 } from "lucide-react";

const Profile = () => {
  const { userData, user } = useAuth();
  const [username, setUsername] = useState(userData?.username || "");
  const [location, setLocation] = useState(userData?.location || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setUsername(userData.username || "");
      setLocation(userData.location || "");
    }
  }, [userData]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!user) {
      setError("You must be logged in to update your profile.");
      setLoading(false);
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          username,
          location,
        },
        { merge: true }
      );
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile.");
      console.error(err);
    }
    setLoading(false);
  };

  const handleDeleteProfile = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    if (!user) {
      setError("You must be logged in to delete your profile.");
      setLoading(false);
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      await deleteDoc(userDocRef);
      setUsername("");
      setLocation("");
      setSuccess("Profile deleted successfully!");
    } catch (err) {
      setError("Failed to delete profile.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <User className="text-rose-500 mx-auto mb-4" size={48} />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Your Profile
          </h1>
          <p className="text-gray-600 mt-2">
            Update your personal information.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-rose-100">
          <form onSubmit={handleUpdateProfile}>
            <div className="space-y-6">
              <div className="relative">
                <User className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full p-3 pl-12 border rounded-full focus:ring-rose-500 focus:border-rose-500 transition-all"
                />
              </div>
              <div className="relative">
                <Mail className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
                <input
                  type="email"
                  value={userData?.email || ""}
                  disabled
                  className="w-full p-3 pl-12 border rounded-full bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location (e.g., New York, NY)"
                  className="w-full p-3 pl-12 border rounded-full focus:ring-rose-500 focus:border-rose-500 transition-all"
                />
              </div>
            </div>
            <div className="flex justify-end mt-8 space-x-4">
              <button
                type="button"
                onClick={handleDeleteProfile}
                className="inline-flex items-center bg-red-500 text-white py-3 px-6 rounded-full hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
                disabled={loading}
              >
                <Trash2 className="mr-2" size={20} />
                {loading ? "Deleting..." : "Delete Profile"}
              </button>
              <button
                type="submit"
                className="inline-flex items-center bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-6 rounded-full hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
                disabled={loading}
              >
                <Save className="mr-2" size={20} />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          {success && (
            <p className="text-green-500 mt-4 text-center">{success}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
