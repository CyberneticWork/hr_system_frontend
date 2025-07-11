// components/FieldError.jsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

const FieldError = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mt-1 flex items-start text-red-600 text-sm">
      <AlertCircle className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0" />
      <span>{error}</span>
    </div>
  );
};

export default FieldError;