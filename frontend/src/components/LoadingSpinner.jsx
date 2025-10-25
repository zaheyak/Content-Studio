import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-emerald-600 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
