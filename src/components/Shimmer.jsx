import React from 'react';

const Shimmer = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-purple-100 mt-8">
      <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-4"></div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shimmer;
