import React, { useState } from 'react';
import EmpPersonalDetails from '@dashboard/AddEmployeeMaster/EmpPersonalDetails';
import AddressDetails from '@dashboard/AddEmployeeMaster/AddressDetails';
import OrganizationDetails from '@dashboard/AddEmployeeMaster/OrganizationDetails';
import CompensationManagement from '@dashboard/AddEmployeeMaster/CompensationManagement';
import Employeedocument from '@dashboard/AddEmployeeMaster/Employeedocument';
import EmployeeConfirmationModal from './EmployeeConfirmationModal';
import { EmployeeFormProvider, useEmployeeForm } from '@contexts/EmployeeFormContext';
import employeeService from '@services/EmployeeDataService';
import { toast } from 'react-toastify';

const steps = [
  'personal',
  'address',
  'compensation',
  'organization',
  'documents',
  'confirmation'
];

const EmployeeMasterWrapper = () => {
  return (
    <EmployeeFormProvider>
      <EmployeeMaster />
    </EmployeeFormProvider>
  );
};

const EmployeeMaster = () => {
  const [activeCategory, setActiveCategory] = useState('personal');
  const currentStepIndex = steps.indexOf(activeCategory);
  const { setFormErrors, setIsSubmitting, errors } = useEmployeeForm();

  const goNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setActiveCategory(steps[currentStepIndex + 1]);
    }
  };

  const goPrevious = () => {
    if (currentStepIndex > 0) {
      setActiveCategory(steps[currentStepIndex - 1]);
    }
  };

  const handleSubmit = async (allEmployeeData) => {
    setIsSubmitting(true);
    try {
      const response = await employeeService.submitEmployee(allEmployeeData);
      console.log('Employee created:', response);
      toast.success('Employee submitted successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Submission error:', error);
      if (error.response?.data?.errors) {
        const formattedErrors = {};
        
        Object.entries(error.response.data.errors).forEach(([fieldPath, messages]) => {
          const pathParts = fieldPath.split('.');
          let currentLevel = formattedErrors;
          
          pathParts.forEach((part, index) => {
            if (index === pathParts.length - 1) {
              currentLevel[part] = messages[0];
            } else {
              currentLevel[part] = currentLevel[part] || {};
              currentLevel = currentLevel[part];
            }
          });
        });
        
        setFormErrors(formattedErrors);
        toast.error('Please fix the errors in the form', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error('Error submitting employee. Please try again.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2 px-4 py-2 border-b border-gray-200 bg-white">
        {steps.map((step) => (
          <button
            key={step}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              activeCategory === step
                ? 'bg-indigo-600 text-white'
                : 'text-indigo-700 hover:bg-indigo-100'
            }`}
            onClick={() => setActiveCategory(step)}
          >
            {step.charAt(0).toUpperCase() + step.slice(1)}
          </button>
        ))}
      </div>
      <div className="p-4">
        <div className="p-4">
          {activeCategory === 'personal' && (
            <EmpPersonalDetails
              onNext={goNext}
              activeCategory={activeCategory}
            />
          )}
          {activeCategory === 'address' && (
            <AddressDetails
              onNext={goNext}
              onPrevious={goPrevious}
              activeCategory={activeCategory}
            />
          )}
          {activeCategory === 'compensation' && (
            <CompensationManagement
              onNext={goNext}
              onPrevious={goPrevious}
              activeCategory={activeCategory}
            />
          )}
          {activeCategory === 'organization' && (
            <OrganizationDetails
              onNext={goNext}
              onPrevious={goPrevious}
              activeCategory={activeCategory}
            />
          )}
          {activeCategory === 'documents' && (
            <Employeedocument
              onPrevious={goPrevious}
              onSubmit={handleSubmit}
              activeCategory={activeCategory}
            />
          )}
          {activeCategory === 'confirmation' && (
            <EmployeeConfirmationModal
              onPrevious={goPrevious}
              onSubmit={handleSubmit}
              activeCategory={activeCategory}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeMasterWrapper;