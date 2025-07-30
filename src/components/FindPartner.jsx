import React, { useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { Heart, Search, Send } from "lucide-react";
import toast from "react-hot-toast";

const FindPartner = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") {
      toast.error("Please enter a username to search.");
      return;
    }
    setLoading(true);
    setSearchResults([]);
    try {
      const q = query(
        collection(db, "users"),
        where("username_lowercase", ">=", searchTerm.toLowerCase()),
        where("username_lowercase", "<=", searchTerm.toLowerCase() + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((foundUser) => foundUser.id !== user.uid);
      setSearchResults(users);
      if (users.length === 0) {
        toast.success("No users found.");
      }
    } catch (err) {
      console.error("Error searching for users:", err);
      toast.error("Failed to search for users.");
    }
    setLoading(false);
  };

  const handleSendRequest = async (toId) => {
    if (toId === user.uid) {
      toast.error("You cannot send a request to yourself.");
      return;
    }
    const toastId = toast.loading("Sending request...");
    try {
      const requestId = `${user.uid}_${toId}`;
      const requestDocRef = doc(db, "connectionRequests", requestId);
      await setDoc(requestDocRef, {
        from: user.uid,
        to: toId,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      toast.success("Connection request sent!", { id: toastId });
    } catch (err) {
      console.error("Failed to send connection request.", err);
      toast.error("Failed to send connection request.", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Heart className="text-rose-500 mx-auto mb-4" size={48} />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Find Your Partner
          </h1>
          <p className="text-gray-600 mt-2">
            Search for your partner by their username.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-rose-100">
          <form onSubmit={handleSearch}>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter a username"
                className="w-full p-3 border rounded-full focus:ring-rose-500 focus:border-rose-500 transition-all"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-3 rounded-full hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                disabled={loading}
              >
                <Search size={24} />
              </button>
            </div>
          </form>
        </div>

        {searchResults.length > 0 && (
          <div className="mt-8 space-y-4">
            {searchResults.map((foundUser) => (
              <div
                key={foundUser.id}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-purple-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {foundUser.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {foundUser.username}
                    </h2>
                    <p className="text-gray-600">{foundUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSendRequest(foundUser.id)}
                  className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
                >
                  <Send className="mr-2" size={16} />
                  Send Request
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindPartner;
