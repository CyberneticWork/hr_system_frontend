import React, { useState } from 'react';
import { X, User, MapPin, CreditCard, Building, Calendar, Phone, Mail, Users, Heart, Check, Edit } from 'lucide-react';

const STORAGE_KEY = "employeeFormData";

const EmployeeConfirmationModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Sample data from your form
  const employeeData = {
    "title": "Miss",
    "attendanceEmpNo": "Consequat Incididun",
    "epfNo": "Rerum qui aliqua Be",
    "nicNumber": "463",
    "dob": "2017-12-18",
    "gender": "Male",
    "religion": "Quas perspiciatis u",
    "countryOfBirth": "Aperiam cupiditate a",
    "employmentStatus": "permanentBasis",
    "nameWithInitial": "Shannon Duran",
    "fullName": "Preston Burks",
    "displayName": "Laura Gonzales",
    "maritalStatus": "Divorced",
    "relationshipType": "wife",
    "spouseName": "Cyrus Branch",
    "spouseAge": "53",
    "spouseDob": "1980-09-08",
    "spouseNic": "Qui laudantium impe",
    "children": [
      {
        "name": "Macey Dillard",
        "age": "93",
        "dob": "2000-09-19",
        "nic": "Voluptatum in qui qu"
      }
    ],
    "address": {
      "name": "Todd Stein",
      "permanentAddress": "Ea et doloremque aut",
      "temporaryAddress": "Corrupti nisi tempo",
      "email": "hedixovoka@mailinator.com",
      "landLine": "Cum sed quibusdam ve",
      "mobileLine": "Ullam perspiciatis ",
      "gnDivision": "Anim molestiae est v",
      "policeStation": "Minima est quasi iru",
      "district": "KALUTARA",
      "province": "Quas officiis nobis ",
      "electoralDivision": "Dolorem fugiat nulla",
      "emergencyContact": {
        "relationship": "Friend",
        "contactName": "Quyn Wilson",
        "contactAddress": "Ipsum ea ut delectus",
        "contactTel": "Exercitationem accus"
      }
    },
    "compensation": {
      "basicSalary": "33",
      "incrementValue": "3",
      "incrementEffectiveFrom": "1971-03-23",
      "bankName": "bank3",
      "branchName": "branch3",
      "bankCode": "Aut est tenetur ut ",
      "branchCode": "Blanditiis incididun",
      "bankAccountNo": "Est dolores dicta et",
      "comments": "Eos aut laboriosam",
      "secondaryEmp": true,
      "primaryEmploymentBasic": "false",
      "enableEpfEtf": false,
      "otActive": false,
      "earlyDeduction": false,
      "incrementActive": false,
      "nopayActive": true,
      "morningOt": false,
      "eveningOt": false,
      "budgetaryReliefAllowance2015": false,
      "budgetaryReliefAllowance2016": false
    },
    "organizationDetails": {
      "company": "Company A",
      "department": "HR",
      "subDepartment": "Recruitment",
      "currentSupervisor": "Doloribus error et c",
      "dateOfJoined": "1998-02-08",
      "designation": "Manager",
      "probationPeriod": true,
      "trainingPeriod": false,
      "contractPeriod": true,
      "probationFrom": "",
      "probationTo": "",
      "trainingFrom": "",
      "trainingTo": "",
      "contractFrom": "2025-07-15",
      "contractTo": "2025-07-07",
      "confirmationDate": "",
      "resignationDate": "",
      "resignationLetter": null,
      "resignationApproved": false,
      "currentStatus": "Active",
      "dayOff": "Sunday"
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatEmploymentStatus = (status) => {
    const statusMap = {
      'permanentBasis': 'Permanent Basis',
      'contractBasis': 'Contract Basis',
      'temporaryBasis': 'Temporary Basis'
    };
    return statusMap[status] || status;
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    // Here you would send data to backend
    console.log('Saving employee data:', employeeData);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Employee Information Review</h2>
              <p className="text-blue-100">Please review all details before saving</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Personal Information */}
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center space-x-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-800 font-medium">{employeeData.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Display Name</label>
                    <p className="text-gray-800 font-medium">{employeeData.displayName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name with Initial</label>
                    <p className="text-gray-800">{employeeData.nameWithInitial}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Title</label>
                    <p className="text-gray-800">{employeeData.title}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">NIC Number</label>
                    <p className="text-gray-800">{employeeData.nicNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                    <p className="text-gray-800">{formatDate(employeeData.dob)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Gender</label>
                    <p className="text-gray-800">{employeeData.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Religion</label>
                    <p className="text-gray-800">{employeeData.religion}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Country of Birth</label>
                    <p className="text-gray-800">{employeeData.countryOfBirth}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Marital Status</label>
                    <p className="text-gray-800">{employeeData.maritalStatus}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Family Information */}
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-800">Family Information</h3>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Spouse Name</label>
                    <p className="text-gray-800">{employeeData.spouseName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Spouse Age</label>
                    <p className="text-gray-800">{employeeData.spouseAge}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Spouse DOB</label>
                    <p className="text-gray-800">{formatDate(employeeData.spouseDob)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Spouse NIC</label>
                    <p className="text-gray-800">{employeeData.spouseNic}</p>
                  </div>
                </div>
                {employeeData.children && employeeData.children.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Children</label>
                    {employeeData.children.map((child, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><strong>Name:</strong> {child.name}</div>
                          <div><strong>Age:</strong> {child.age}</div>
                          <div><strong>DOB:</strong> {formatDate(child.dob)}</div>
                          <div><strong>NIC:</strong> {child.nic}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">Address Information</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Permanent Address</label>
                  <p className="text-gray-800">{employeeData.address.permanentAddress}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Temporary Address</label>
                  <p className="text-gray-800">{employeeData.address.temporaryAddress}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">District</label>
                    <p className="text-gray-800">{employeeData.address.district}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Province</label>
                    <p className="text-gray-800">{employeeData.address.province}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">GN Division</label>
                    <p className="text-gray-800">{employeeData.address.gnDivision}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Police Station</label>
                    <p className="text-gray-800">{employeeData.address.policeStation}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center space-x-2 mb-4">
                <Phone className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-800">{employeeData.address.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mobile</label>
                    <p className="text-gray-800">{employeeData.address.mobileLine}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Land Line</label>
                    <p className="text-gray-800">{employeeData.address.landLine}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Emergency Contact</label>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div><strong>Name:</strong> {employeeData.address.emergencyContact.contactName}</div>
                      <div><strong>Relationship:</strong> {employeeData.address.emergencyContact.relationship}</div>
                    </div>
                    <div><strong>Address:</strong> {employeeData.address.emergencyContact.contactAddress}</div>
                    <div><strong>Phone:</strong> {employeeData.address.emergencyContact.contactTel}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Organization Details */}
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center space-x-2 mb-4">
                <Building className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Organization Details</h3>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Company</label>
                    <p className="text-gray-800">{employeeData.organizationDetails.company}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Department</label>
                    <p className="text-gray-800">{employeeData.organizationDetails.department}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Sub Department</label>
                    <p className="text-gray-800">{employeeData.organizationDetails.subDepartment}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Designation</label>
                    <p className="text-gray-800">{employeeData.organizationDetails.designation}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date Joined</label>
                    <p className="text-gray-800">{formatDate(employeeData.organizationDetails.dateOfJoined)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Current Status</label>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {employeeData.organizationDetails.currentStatus}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Employment Status</label>
                    <p className="text-gray-800">{formatEmploymentStatus(employeeData.employmentStatus)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Day Off</label>
                    <p className="text-gray-800">{employeeData.organizationDetails.dayOff}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compensation Details */}
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">Compensation Details</h3>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Basic Salary</label>
                    <p className="text-gray-800 font-semibold text-lg">LKR {employeeData.compensation.basicSalary}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Increment Value</label>
                    <p className="text-gray-800">LKR {employeeData.compensation.incrementValue}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Bank Name</label>
                    <p className="text-gray-800">{employeeData.compensation.bankName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Branch Name</label>
                    <p className="text-gray-800">{employeeData.compensation.branchName}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Account Number</label>
                  <p className="text-gray-800">{employeeData.compensation.bankAccountNo}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Attendance Emp No</label>
                    <p className="text-gray-800">{employeeData.attendanceEmpNo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">EPF No</label>
                    <p className="text-gray-800">{employeeData.epfNo}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Please review all information carefully before saving.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Employee</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeConfirmationModal;