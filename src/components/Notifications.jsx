import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import Shimmer from './Shimmer';

const Notifications = () => {
  const { user, setUnreadNotifications } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, `users/${user.uid}/notifications`), orderBy('timestamp', 'desc'));
      const unsub = onSnapshot(q, (querySnapshot) => {
        const notificationsData = [];
        querySnapshot.forEach((doc) => {
          notificationsData.push({ id: doc.id, ...doc.data() });
        });
        setNotifications(notificationsData);
        setLoading(false);
        setUnreadNotifications(false);
      });
      return () => unsub();
    } else {
      setLoading(false);
    }
  }, [user, setUnreadNotifications]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
      <div className="mt-6">
        {loading ? (
          <Shimmer />
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li key={notification.id} className="p-4">
                    <p className="text-gray-800 dark:text-gray-300">{notification.message}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(notification.timestamp?.toDate()).toLocaleString()}
                    </p>
                  </li>
                ))
              ) : (
                <li className="p-4 text-gray-500 dark:text-gray-300">No new notifications.</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
