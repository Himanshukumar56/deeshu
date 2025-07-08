import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';

const Communication = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'users', user.uid, 'messages'), orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let messagesArr = [];
        querySnapshot.forEach((doc) => {
          messagesArr.push({ ...doc.data(), id: doc.id });
        });
        setMessages(messagesArr);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const addMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    await addDoc(collection(db, 'users', user.uid, 'messages'), {
      text: newMessage,
      timestamp: serverTimestamp(),
      sender: user.email,
    });

    setNewMessage('');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800">Sweet <span className="text-brand-primary">Notes</span></h1>
          <p className="text-gray-500 mt-4">Leave little love notes for each other throughout the day.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <form onSubmit={addMessage}>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share a thought, a memory, or just say hello..."
              className="w-full p-3 border rounded-lg focus:ring-brand-primary focus:border-brand-primary"
            ></textarea>
            <div className="flex justify-end mt-4">
              <button type="submit" className="bg-brand-primary text-white py-2 px-6 rounded-full hover:bg-red-700">
                Send Note
              </button>
            </div>
          </form>
        </div>
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`p-4 rounded-xl shadow-lg ${message.sender === user.email ? 'bg-blue-100' : 'bg-pink-100'}`}>
              <p className="text-gray-800">{message.text}</p>
              <p className="text-sm text-gray-500 mt-2 text-right">
                - {message.sender} on {new Date(message.timestamp?.toDate()).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Communication;
