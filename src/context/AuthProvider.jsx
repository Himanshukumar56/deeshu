import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setUserData(null);
        setLoading(false);
      }
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    let unsubscribeDoc;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      unsubscribeDoc = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setUserData({ id: doc.id, ...doc.data() });
        }
        setLoading(false);
      });
    }
    return () => {
      if (unsubscribeDoc) {
        unsubscribeDoc();
      }
    };
  }, [user]);

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    userData,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
