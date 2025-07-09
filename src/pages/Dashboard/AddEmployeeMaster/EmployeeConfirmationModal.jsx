import React, { useState } from 'react';
import { User, MapPin, CreditCard, Building, Phone, Heart, Check, Edit } from 'lucide-react';

const EmployeeInformationPage = () => {
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
  };

  const handleEdit = () => {
    console.log('Edit mode activated');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Employee Information</h1>
                <p className="text-blue-100 mt-1">Complete employee profile and details</p>
              </div>
            </div>
            <button
              onClick={handleEdit}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-gray-800 font-medium mt-1">{employeeData.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Display Name</label>
                  <p className="text-gray-800 font-medium mt-1">{employeeData.displayName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name with Initial</label>
                  <p className="text-gray-800 mt-1">{employeeData.nameWithInitial}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Title</label>
                  <p className="text-gray-800 mt-1">{employeeData.title}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">NIC Number</label>
                  <p className="text-gray-800 mt-1">{employeeData.nicNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  <p className="text-gray-800 mt-1">{formatDate(employeeData.dob)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Gender</label>
                  <p className="text-gray-800 mt-1">{employeeData.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Religion</label>
                  <p className="text-gray-800 mt-1">{employeeData.religion}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Country of Birth</label>
                  <p className="text-gray-800 mt-1">{employeeData.countryOfBirth}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Marital Status</label>
                  <p className="text-gray-800 mt-1">{employeeData.maritalStatus}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Family Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-red-100 p-2 rounded-lg">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Family Information</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Spouse Name</label>
                  <p className="text-gray-800 mt-1">{employeeData.spouseName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Spouse Age</label>
                  <p className="text-gray-800 mt-1">{employeeData.spouseAge}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Spouse DOB</label>
                  <p className="text-gray-800 mt-1">{formatDate(employeeData.spouseDob)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Spouse NIC</label>
                  <p className="text-gray-800 mt-1">{employeeData.spouseNic}</p>
                </div>
              </div>
              {employeeData.children && employeeData.children.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-3 block">Children</label>
                  {employeeData.children.map((child, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-2 gap-3 text-sm">
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-100 p-2 rounded-lg">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Address Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Permanent Address</label>
                <p className="text-gray-800 mt-1">{employeeData.address.permanentAddress}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Temporary Address</label>
                <p className="text-gray-800 mt-1">{employeeData.address.temporaryAddress}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">District</label>
                  <p className="text-gray-800 mt-1">{employeeData.address.district}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Province</label>
                  <p className="text-gray-800 mt-1">{employeeData.address.province}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">GN Division</label>
                  <p className="text-gray-800 mt-1">{employeeData.address.gnDivision}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Police Station</label>
                  <p className="text-gray-800 mt-1">{employeeData.address.policeStation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Phone className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-800 mt-1">{employeeData.address.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Mobile</label>
                  <p className="text-gray-800 mt-1">{employeeData.address.mobileLine}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Land Line</label>
                  <p className="text-gray-800 mt-1">{employeeData.address.landLine}</p>
                </div>
              </div>
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-600 mb-3 block">Emergency Contact</label>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Organization Details</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Company</label>
                  <p className="text-gray-800 mt-1">{employeeData.organizationDetails.company}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Department</label>
                  <p className="text-gray-800 mt-1">{employeeData.organizationDetails.department}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Sub Department</label>
                  <p className="text-gray-800 mt-1">{employeeData.organizationDetails.subDepartment}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Designation</label>
                  <p className="text-gray-800 mt-1">{employeeData.organizationDetails.designation}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Date Joined</label>
                  <p className="text-gray-800 mt-1">{formatDate(employeeData.organizationDetails.dateOfJoined)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Current Status</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mt-1">
                    {employeeData.organizationDetails.currentStatus}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Employment Status</label>
                  <p className="text-gray-800 mt-1">{formatEmploymentStatus(employeeData.employmentStatus)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Day Off</label>
                  <p className="text-gray-800 mt-1">{employeeData.organizationDetails.dayOff}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Compensation Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-100 p-2 rounded-lg">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Compensation Details</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Basic Salary</label>
                  <p className="text-gray-800 font-semibold text-lg mt-1">LKR {employeeData.compensation.basicSalary}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Increment Value</label>
                  <p className="text-gray-800 mt-1">LKR {employeeData.compensation.incrementValue}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Bank Name</label>
                  <p className="text-gray-800 mt-1">{employeeData.compensation.bankName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Branch Name</label>
                  <p className="text-gray-800 mt-1">{employeeData.compensation.branchName}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Account Number</label>
                <p className="text-gray-800 mt-1">{employeeData.compensation.bankAccountNo}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Attendance Emp No</label>
                  <p className="text-gray-800 mt-1">{employeeData.attendanceEmpNo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">EPF No</label>
                  <p className="text-gray-800 mt-1">{employeeData.epfNo}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInformationPage;