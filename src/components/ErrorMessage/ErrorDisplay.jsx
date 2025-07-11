// components/ErrorDisplay.jsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorDisplay = ({ errors, section }) => {
  if (!errors || !errors[section]) return null;

  // Flatten nested errors for display
  const flattenErrors = (errorObj, prefix = '') => {
    return Object.entries(errorObj).reduce((acc, [key, value]) => {
      if (typeof value === 'object') {
        return [...acc, ...flattenErrors(value, `${prefix}${key}.`)];
      }
      return [...acc, { field: `${prefix}${key}`, message: value }];
    }, []);
  };

  const sectionErrors = flattenErrors(errors[section]);

  if (sectionErrors.length === 0) return null;

  return (
    <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
        <h3 className="text-red-800 font-medium">Validation Errors</h3>
      </div>
      <ul className="mt-2 ml-7 list-disc text-red-700">
        {sectionErrors.map(({ field, message }) => (
          <li key={`${section}-${field}`}>
            <span className="font-medium capitalize">{field.replace(/\./g, ' ')}:</span> {message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorDisplay;