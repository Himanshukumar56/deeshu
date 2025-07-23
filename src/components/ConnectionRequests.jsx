import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { Check, X } from 'lucide-react';
import Shimmer from './Shimmer';
import toast from 'react-hot-toast';

const ConnectionRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'connectionRequests'),
          where('to', '==', user.uid),
          where('status', '==', 'pending')
        );
        const querySnapshot = await getDocs(q);
        const requestsData = await Promise.all(
          querySnapshot.docs.map(async (requestDoc) => {
            const request = { id: requestDoc.id, ...requestDoc.data() };
            const userDoc = await getDoc(doc(db, 'users', request.from));
            return { ...request, fromUser: userDoc.data() };
          })
        );
        setRequests(requestsData);
      } catch (err) {
        console.error('Failed to fetch connection requests.', err);
      }
      setLoading(false);
    };

    fetchRequests();
  }, [user]);

  const handleRequest = async (requestId, fromId, accept) => {
    const toastId = toast.loading('Updating request...');
    try {
      const requestDocRef = doc(db, 'connectionRequests', requestId);
      if (accept) {
        await updateDoc(requestDocRef, { status: 'accepted' });
        await updateDoc(doc(db, 'users', user.uid), { partnerId: fromId });
        await updateDoc(doc(db, 'users', fromId), { partnerId: user.uid });
        toast.success('Connection request accepted!', { id: toastId });
      } else {
        await updateDoc(requestDocRef, { status: 'declined' });
        toast.success('Connection request declined.', { id: toastId });
      }
      setRequests(requests.filter((req) => req.id !== requestId));
    } catch (err) {
      console.error('Failed to update request.', err);
      toast.error('Failed to update request.', { id: toastId });
    }
  };

  if (loading) {
    return <Shimmer />;
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-purple-100 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Connection Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-600">You have no new connection requests.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request.id} className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
              <div>
                <p className="font-semibold text-gray-800">{request.fromUser.username}</p>
                <p className="text-sm text-gray-600">{request.fromUser.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRequest(request.id, request.from, true)}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all"
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={() => handleRequest(request.id, request.from, false)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConnectionRequests;
