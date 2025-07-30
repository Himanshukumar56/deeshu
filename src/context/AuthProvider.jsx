import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(false);

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
    let unsubscribeNotifications;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      unsubscribeDoc = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (!data.username_lowercase && data.username) {
            updateDoc(userDocRef, {
              username_lowercase: data.username.toLowerCase(),
            });
          }
          setUserData({ id: doc.id, ...data });
        }
        setLoading(false);
      });

      const notificationDocRef = doc(db, "notifications", user.uid);
      unsubscribeNotifications = onSnapshot(notificationDocRef, (doc) => {
        if (doc.exists() && doc.data().message) {
          setUnreadNotifications(true);
        } else {
          setUnreadNotifications(false);
        }
      });
    }
    return () => {
      if (unsubscribeDoc) {
        unsubscribeDoc();
      }
      if (unsubscribeNotifications) {
        unsubscribeNotifications();
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
    setUserData,
    unreadNotifications,
    setUnreadNotifications,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
