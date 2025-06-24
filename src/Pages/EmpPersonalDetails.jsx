import React, { useState } from "react";
import { User, Users, Baby, Briefcase } from "lucide-react";

const initialState = {
  title: "",
  attendanceEmpNo: "",
  epfNo: "",
  nicNumber: "",
  dob: "",
  gender: "",
  religion: "",
  countryOfBirth: "",
  employeeActive: false,
  permanentBasis: false,
  training: false,
  contractBasis: false,
  dailyWagesSalary: false,
  nameWithInitial: "",
  fullName: "",
  displayName: "",
  maritalStatus: "",
  spouseName: "",
  spouseAge: "",
  spouseDob: "",
  spouseNic: "",
  children: [
    { name: "", age: "", dob: "", nic: "" },
    { name: "", age: "", dob: "", nic: "" },
    { name: "", age: "", dob: "", nic: "" },
  ],
};

const EmpPersonalDetails = () => {
  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleChildChange = (idx, e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const children = [...prev.children];
      children[idx][name] = value;
      return { ...prev, children };
    });
  };

  const handleSubmit = () => {
    alert("Employee details saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Employee Personal Details
              </h1>
              <p className="text-gray-600 mt-1">Complete employee information management system</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <select
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="">Select Title</option>
                  <option>Mr</option>
                  <option>Mrs</option>
                  <option>Miss</option>
                  <option>Ms</option>
                  <option>Dr</option>
                </select>
              </div>

              {/* Attendance Emp No */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Attendance Emp No <span className="text-red-500">*</span>
                </label>
                <input
                  name="attendanceEmpNo"
                  value={form.attendanceEmpNo}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter employee number"
                />
              </div>

              {/* EPF No */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  EPF No <span className="text-red-500">*</span>
                </label>
                <input
                  name="epfNo"
                  value={form.epfNo}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter EPF number"
                />
              </div>

              {/* NIC Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  NIC Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="nicNumber"
                  value={form.nicNumber}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter NIC number"
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Religion */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Religion</label>
                <input
                  name="religion"
                  value={form.religion}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter religion"
                />
              </div>

              {/* Country of Birth */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Country of Birth</label>
                <input
                  name="countryOfBirth"
                  value={form.countryOfBirth}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter country of birth"
                />
              </div>
            </div>
          </div>

          {/* Employment Status */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Employment Status</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { name: "employeeActive", label: "Employee Active" },
                { name: "permanentBasis", label: "Permanent Basis" },
                { name: "training", label: "Training" },
                { name: "contractBasis", label: "Contract Basis" },
                { name: "dailyWagesSalary", label: "Daily Wages Salary" },
              ].map((item) => (
                <label key={item.name} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name={item.name}
                    checked={form[item.name]}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Name Details */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Name Details</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Name With Initial <span className="text-red-500">*</span>
                </label>
                <input
                  name="nameWithInitial"
                  value={form.nameWithInitial}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., J.A. Smith"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Display Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="displayName"
                  value={form.displayName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter display name"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
              <select
                name="maritalStatus"
                value={form.maritalStatus}
                onChange={handleChange}
                className="w-full lg:w-1/3 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="">Select Status</option>
                <option>Single</option>
                <option>Married</option>
                <option>Divorced</option>
                <option>Widowed</option>
              </select>
            </div>
          </div>

          {/* Spouse Details */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-2 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Spouse Details</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Spouse Name</label>
                <input
                  name="spouseName"
                  value={form.spouseName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter spouse name"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Spouse Age</label>
                <input
                  name="spouseAge"
                  type="number"
                  min="0"
                  value={form.spouseAge}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter age"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Spouse DOB</label>
                <input
                  name="spouseDob"
                  type="date"
                  value={form.spouseDob}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Spouse NIC</label>
                <input
                  name="spouseNic"
                  value={form.spouseNic}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter NIC number"
                />
              </div>
            </div>
          </div>

          {/* Children Details */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg">
                <Baby className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Children Details</h2>
            </div>
            
            <div className="space-y-4">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-600 mb-3">Child {idx + 1}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input
                      name="name"
                      placeholder="Child name"
                      value={form.children[idx].name}
                      onChange={(e) => handleChildChange(idx, e)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <input
                      name="age"
                      type="number"
                      min="0"
                      placeholder="Age"
                      value={form.children[idx].age}
                      onChange={(e) => handleChildChange(idx, e)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <input
                      name="dob"
                      type="date"
                      value={form.children[idx].dob}
                      onChange={(e) => handleChildChange(idx, e)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <input
                      name="nic"
                      placeholder="NIC number"
                      value={form.children[idx].nic}
                      onChange={(e) => handleChildChange(idx, e)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pb-6">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:ring-4 focus:ring-blue-300"
            >
              Save Employee Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpPersonalDetails;