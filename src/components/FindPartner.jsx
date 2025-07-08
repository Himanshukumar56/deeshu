import React, { useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { Heart, Search, Send } from "lucide-react";

const FindPartner = () => {
  const { user } = useAuth();
  const [partnerEmail, setPartnerEmail] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFoundUser(null);
    setLoading(true);

    if (partnerEmail.trim() === "") {
      setError("Please enter an email.");
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, "users"),
        where("email", "==", partnerEmail)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("User not found.");
      } else {
        const partnerDoc = querySnapshot.docs[0];
        setFoundUser({ id: partnerDoc.id, ...partnerDoc.data() });
      }
    } catch (err) {
      setError("Failed to search for user.");
      console.error(err);
    }
    setLoading(false);
  };

  const handleSendRequest = async () => {
    if (!foundUser) return;

    try {
      await addDoc(collection(db, "connectionRequests"), {
        from: user.uid,
        to: foundUser.id,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setSuccess(`Connection request sent to ${foundUser.username}!`);
      setFoundUser(null);
      setPartnerEmail("");
    } catch (err) {
      setError("Failed to send connection request.");
      console.error(err);
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
            Enter your partner's email to connect with them.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-rose-100">
          <form onSubmit={handleSearch}>
            <div className="flex items-center gap-4">
              <input
                type="email"
                value={partnerEmail}
                onChange={(e) => setPartnerEmail(e.target.value)}
                placeholder="Enter your partner's email"
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

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          {success && (
            <p className="text-green-500 mt-4 text-center">{success}</p>
          )}
        </div>

        {foundUser && (
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-purple-100 mt-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-4xl">
                  {foundUser.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {foundUser.username}
              </h2>
              <p className="text-gray-600">{foundUser.email}</p>
              <button
                onClick={handleSendRequest}
                className="mt-6 inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
              >
                <Send className="mr-2" size={20} />
                Send Connection Request
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindPartner;
