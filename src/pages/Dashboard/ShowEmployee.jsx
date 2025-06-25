import React, { useState } from 'react';
import { Eye, User, Phone, Mail, MapPin, Calendar, Briefcase, X } from 'lucide-react';

const ShowEmployee = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Sample employee data
  const employees = [
    {
      id: 1,
      empNo: "10",
      name: "PERERA",
      fullName: "VINOD SANJEEWA PERERA",
      displayName: "V.S. PERERA",
      status: "ACTIVE",
      type: "PERMANENT",
      title: "Software Engineer",
      gender: "Male",
      dateOfBirth: "1985-05-15",
      religion: "Buddhist",
      country: "Sri Lanka",
      attendanceEmpNo: "EMP001",
      epfNo: "EPF001",
      nicNumber: "858521234V",
      address: {
        permanent: "NO 40/A, DUNGALPITIYA",
        temporary: "NEGAMBO",
        province: "SRI LANKA",
        district: "GAMPAHA"
      },
      contact: {
        email: "perera@company.com",
        landLine: "0315651310",
        mobile: "0717597856",
        emergencyContact: "0315651310",
        emergencyContactName: "ContactName",
        relationship: "Spouse"
      },
      employment: {
        employeeActive: true,
        permanentBasis: true,
        training: false,
        contractBasis: false,
        dailyWagesSalary: false
      }
    },
    {
      id: 2,
      empNo: "12",
      name: "SILVA",
      fullName: "KAMAL JOHN SILVA",
      displayName: "K.J. SILVA",
      status: "ACTIVE",
      type: "CONTRACT",
      title: "HR Manager",
      gender: "Male",
      dateOfBirth: "1980-08-20",
      religion: "Christian",
      country: "Sri Lanka",
      attendanceEmpNo: "EMP002",
      epfNo: "EPF002",
      nicNumber: "802341234V",
      address: {
        permanent: "NO 25/B, COLOMBO ROAD",
        temporary: "COLOMBO",
        province: "WESTERN",
        district: "COLOMBO"
      },
      contact: {
        email: "silva@company.com",
        landLine: "0112345678",
        mobile: "0771234567",
        emergencyContact: "0112345678",
        emergencyContactName: "Emergency Contact",
        relationship: "Brother"
      },
      employment: {
        employeeActive: true,
        permanentBasis: false,
        training: false,
        contractBasis: true,
        dailyWagesSalary: false
      }
    },
    {
      id: 3,
      empNo: "22",
      name: "FERNANDO",
      fullName: "MARIA JANE FERNANDO",
      displayName: "M.J. FERNANDO",
      status: "ACTIVE",
      type: "PERMANENT",
      title: "Accountant",
      gender: "Female",
      dateOfBirth: "1990-03-10",
      religion: "Catholic",
      country: "Sri Lanka",
      attendanceEmpNo: "EMP003",
      epfNo: "EPF003",
      nicNumber: "903451234V",
      address: {
        permanent: "NO 15/C, KANDY ROAD",
        temporary: "KANDY",
        province: "CENTRAL",
        district: "KANDY"
      },
      contact: {
        email: "fernando@company.com",
        landLine: "0812345678",
        mobile: "0751234567",
        emergencyContact: "0812345678",
        emergencyContactName: "Parent",
        relationship: "Mother"
      },
      employment: {
        employeeActive: true,
        permanentBasis: true,
        training: false,
        contractBasis: false,
        dailyWagesSalary: false
      }
    }
  ];

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const getStatusBadge = (status) => {
    const statusClass = status === 'ACTIVE' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusClass}`}>
        {status}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeClass = type === 'PERMANENT' 
      ? 'bg-blue-100 text-blue-800 border-blue-200' 
      : 'bg-orange-100 text-orange-800 border-orange-200';
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${typeClass}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Management</h1>
          <p className="text-gray-600">Manage and view employee information</p>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <User className="mr-2 h-5 w-5 text-blue-600" />
              Employee List
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {employee.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Emp No: {employee.empNo}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{employee.title}</div>
                      <div className="text-sm text-gray-500">ID: {employee.attendanceEmpNo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(employee.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(employee.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.contact.mobile}</div>
                      <div className="text-sm text-gray-500">{employee.contact.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewEmployee(employee)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Employee Details Modal */}
        {showModal && selectedEmployee && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-xl">
                        {selectedEmployee.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedEmployee.fullName}</h2>
                      <p className="text-blue-100">{selectedEmployee.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-white hover:text-gray-200 transition-colors p-2"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Basic Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Employee No</label>
                      <p className="text-gray-900 font-semibold">{selectedEmployee.empNo}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Display Name</label>
                      <p className="text-gray-900 font-semibold">{selectedEmployee.displayName}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                      <p className="text-gray-900 font-semibold">{selectedEmployee.gender}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                      <p className="text-gray-900 font-semibold flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                        {selectedEmployee.dateOfBirth}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Religion</label>
                      <p className="text-gray-900 font-semibold">{selectedEmployee.religion}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Country</label>
                      <p className="text-gray-900 font-semibold">{selectedEmployee.country}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">NIC Number</label>
                      <p className="text-gray-900 font-semibold">{selectedEmployee.nicNumber}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">EPF No</label>
                      <p className="text-gray-900 font-semibold">{selectedEmployee.epfNo}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Attendance Emp No</label>
                      <p className="text-gray-900 font-semibold">{selectedEmployee.attendanceEmpNo}</p>
                    </div>
                  </div>
                </div>

                {/* Employment Status */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-purple-600" />
                    Employment Status
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(selectedEmployee.employment).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {value ? 'Yes' : 'No'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-green-600" />
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Permanent Address</label>
                      <p className="text-gray-900 font-semibold">{selectedEmployee.address.permanent}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Temporary Address</label>
                      <p className="text-gray-900 font-semibold">{selectedEmployee.address.temporary}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Province</label>
                      <p className="text-gray-900 font-semibold">{selectedEmployee.address.province}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">District</label>
                      <p className="text-gray-900 font-semibold">{selectedEmployee.address.district}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-blue-600" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                      <p className="text-gray-900 font-semibold flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-gray-500" />
                        {selectedEmployee.contact.email}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Mobile</label>
                      <p className="text-gray-900 font-semibold flex items-center">
                        <Phone className="h-4 w-4 mr-1 text-gray-500" />
                        {selectedEmployee.contact.mobile}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Land Line</label>
                      <p className="text-gray-900 font-semibold">{selectedEmployee.contact.landLine}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Emergency Contact</label>
                      <p className="text-gray-900 font-semibold">{selectedEmployee.contact.emergencyContact}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Emergency Contact Name</label>
                      <p className="text-gray-900 font-semibold">{selectedEmployee.contact.emergencyContactName}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Relationship</label>
                      <p className="text-gray-900 font-semibold">{selectedEmployee.contact.relationship}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-2xl">
                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowEmployee;