import React from 'react';
import Chat from './Chat';
import { useAuth } from '../hooks/useAuth';

const Communication = () => {
  const { userData } = useAuth();

  // Assuming the user object has a partnerId field.
  // You might need to fetch this from your database based on the current user.
  const partnerId = userData ? userData.partnerId : null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800">Chat with your <span className="text-brand-primary">Partner</span></h1>
          <p className="text-gray-500 mt-4">Real-time messaging to stay connected.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg" style={{ height: '70vh' }}>
          {partnerId ? (
            <Chat partnerId={partnerId} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">You don't have a partner connected yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Communication;
