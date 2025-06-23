import React from 'react';

// Error Message Component
const ErrorMessage = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-in slide-in-from-top-1 duration-300">
      {message}
    </div>
  );
};
export default ErrorMessage;