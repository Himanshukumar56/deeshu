import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const Notifications = () => {
  const { user, setUnreadNotifications } = useAuth();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, "notifications", user.uid), (doc) => {
        setNotification(doc.data());
        if (doc.exists() && doc.data().message) {
          setUnreadNotifications(true);
        }
      });
      return () => unsub();
    }
  }, [user, setUnreadNotifications]);

  useEffect(() => {
    if (user) {
      const notificationRef = doc(db, "notifications", user.uid);
      setDoc(notificationRef, { message: "" }, { merge: true });
      setUnreadNotifications(false);
    }
  }, [user, setUnreadNotifications]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
      <div className="mt-6">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
          {notification ? (
            <p className="text-gray-500 dark:text-gray-300">{notification.message}</p>
          ) : (
            <p className="text-gray-500 dark:text-gray-300">No new notifications.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
