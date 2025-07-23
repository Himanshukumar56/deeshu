import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc, getDoc, deleteDoc } from "firebase/firestore";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        // If the user is new, create a new document for them
        const username = user.email.split('@')[0] + Math.floor(Math.random() * 1000);
        const newInviteCode = Math.random().toString(36).substring(2, 8);
        await setDoc(doc(db, "invites", newInviteCode), { userId: user.uid });
        await setDoc(doc(db, "users", user.uid), { inviteCode: newInviteCode, username: username });
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const username = email.split('@')[0] + Math.floor(Math.random() * 1000);

      let partnerId = null;
      if (inviteCode) {
        const inviteDoc = await getDoc(doc(db, "invites", inviteCode));
        if (inviteDoc.exists()) {
          partnerId = inviteDoc.data().userId;
          // Link the two users
          await setDoc(doc(db, "users", user.uid), { 
            partnerId,
            username,
            email,
            location: ''
          });
          await setDoc(doc(db, "users", partnerId), { partnerId: user.uid }, { merge: true });
          // Delete the invite code
          await deleteDoc(doc(db, "invites", inviteCode));
        } else {
          setError("Invalid invite code.");
          return;
        }
      } else {
        // Generate a new invite code for the first user
        const newInviteCode = Math.random().toString(36).substring(2, 8);
        await setDoc(doc(db, "invites", newInviteCode), { userId: user.uid });
        await setDoc(doc(db, "users", user.uid), { 
          inviteCode: newInviteCode, 
          username: username,
          email: email,
          location: ''
        });
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/50 backdrop-blur-sm rounded-2xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800">Create Your Account</h2>
          <p className="mt-2 text-gray-600">Join DeeShu and start sharing your journey</p>
        </div>
        {error && <p className="text-sm text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              id="email"
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full px-4 py-3 text-gray-900 bg-transparent border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-500 peer"
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-3 text-gray-500 duration-300 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email Address
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-4 py-3 text-gray-900 bg-transparent border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-500 peer"
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-3 text-gray-500 duration-300 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <input
              id="inviteCode"
              type="text"
              placeholder=" "
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="block w-full px-4 py-3 text-gray-900 bg-transparent border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-500 peer"
            />
            <label
              htmlFor="inviteCode"
              className="absolute left-4 top-3 text-gray-500 duration-300 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Invite Code (Optional)
            </label>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-bold text-white uppercase bg-pink-500 rounded-lg shadow-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transform hover:scale-105 transition-transform duration-300"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="relative flex items-center justify-center w-full">
          <div className="w-full h-px bg-gray-300"></div>
          <p className="absolute px-4 text-sm text-gray-500 bg-white/50">OR</p>
        </div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center px-4 py-3 font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        >
          Sign up with Google
        </button>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/"
            className="font-medium text-pink-600 hover:text-pink-500"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
