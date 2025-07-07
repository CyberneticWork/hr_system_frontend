import React, { useState } from 'react';
import EmpPersonalDetails from './EmpPersonalDetails';
import AddressDetails from './AddressDetails';
import OrganizationDetails from './OrganizationDetails';
import CompensationManagement from './CompensationManagement';
import Employeedocument from './Employeedocument';
const EmployeeMaster = () => {
  const [activeCategory, setActiveCategory] = useState('personal');

  return (
    <div>
      <div className="flex gap-2 px-4 py-2 border-b border-gray-200 bg-white">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            activeCategory === 'personal'
              ? 'bg-indigo-600 text-white'
              : 'text-indigo-700 hover:bg-indigo-100'
          }`}
          onClick={() => setActiveCategory('personal')}
        >
          Personal
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            activeCategory === 'address'
              ? 'bg-indigo-600 text-white'
              : 'text-indigo-700 hover:bg-indigo-100'
          }`}
          onClick={() => setActiveCategory('address')}
        >
          Address
        </button>
        
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            activeCategory === 'compensation'
              ? 'bg-indigo-600 text-white'
              : 'text-indigo-700 hover:bg-indigo-100'
          }`}
          onClick={() => setActiveCategory('compensation')}
          >
          Compensation
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            activeCategory === 'organization'
              ? 'bg-indigo-600 text-white'
              : 'text-indigo-700 hover:bg-indigo-100'
          }`}
          onClick={() => setActiveCategory('organization')}
        >
          Organization
        </button>
        {/* <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            activeCategory === 'employeedocument'
              ? 'bg-indigo-600 text-white'
              : 'text-indigo-700 hover:bg-indigo-100'
          }`}
          onClick={() => setActiveCategory('employeedocument')}

        >
         Employee Document
        </button>
          Salary
        </button> */}
      </div>
      <div className="p-4">
        {activeCategory === 'personal' && <EmpPersonalDetails />}
        {activeCategory === 'address' && <AddressDetails />}
        {activeCategory === 'compensation' && <CompensationManagement />}
        {activeCategory === 'organization' && <OrganizationDetails/>}
        {activeCategory === 'employeedocument' && <Employeedocument />}
        {/* {activeCategory === 'salary' && <div>Salary Details</div>} */}
      </div>
    </div>
  );
};

export default EmployeeMaster;