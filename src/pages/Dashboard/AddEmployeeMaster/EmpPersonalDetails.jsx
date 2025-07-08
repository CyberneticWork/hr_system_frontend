import React, { useState, useEffect } from "react";
import { User, Users, Baby, Briefcase, Plus, Trash2 } from "lucide-react";

const STORAGE_KEY = "employeeFormData";

const initialState = {
  title: "",
  attendanceEmpNo: "",
  epfNo: "",
  nicNumber: "",
  dob: "",
  gender: "",
  religion: "",
  countryOfBirth: "",
  employmentStatus: "",
  nameWithInitial: "",
  fullName: "",
  displayName: "",
  maritalStatus: "",
  relationshipType: "",
  spouseName: "",
  spouseAge: "",
  spouseDob: "",
  spouseNic: "",
  children: [{ name: "", age: "", dob: "", nic: "" }], // Exactly one empty child
};

const EmpPersonalDetails = ({ onNext, activeCategory }) => {
  const [form, setForm] = useState(initialState);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {

    const loadData = () => {
      try {
        // console.log("Attempting to load data from localStorage...");
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (savedData && savedData !== "undefined" && savedData !== "null") {
          const parsedData = JSON.parse(savedData);
          // console.log("Data loaded from localStorage:", parsedData);
          setForm(parsedData);
        } else {
          // console.log("No saved data found in localStorage");
        }
      } catch (error) {
        // console.error("Error loading saved data:", error);
        // If there's an error, clear the corrupted data
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsDataLoaded(true);
      }
    };

    loadData();
  }, []);

  // Save to localStorage whenever form changes (but only after initial load)
  useEffect(() => {
    if (!isDataLoaded) return; // Don't save until we've loaded initial data

    const saveData = () => {
      try {
        const dataToSave = JSON.stringify(form);
        localStorage.setItem(STORAGE_KEY, dataToSave);
        // console.log("Data saved to localStorage:", form);

        // Verify the save worked
        const verification = localStorage.getItem(STORAGE_KEY);
        if (verification) {
          // console.log("✅ Save verified successfully");
        } else {
          // console.error("❌ Save verification failed");
        }
      } catch (error) {
        // console.error("Error saving data to localStorage:", error);
        // Check if localStorage is available
        if (typeof Storage === "undefined") {
          // console.error("localStorage is not supported in this browser");
        } else if (error.name === "QuotaExceededError") {
          // console.error("localStorage quota exceeded");
        }
      }
    };

    // Debounce the save to avoid too frequent saves
    const timeoutId = setTimeout(saveData, 300);
    return () => clearTimeout(timeoutId);
  }, [form, isDataLoaded]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleChildChange = (idx, e) => {
    const { name, value, type } = e.target;
    setForm((prev) => {
      const children = [...prev.children];
      // Always store as string for controlled input
      children[idx][name] = type === "number" ? value.toString() : value;
      return { ...prev, children };
    });
  };

  const addChild = () => {
    setForm((prev) => ({
      ...prev,
      children: [...prev.children, { name: "", age: "", dob: "", nic: "" }],
    }));
  };

  const removeChild = (idx) => {
    if (form.children.length > 1) {
      setForm((prev) => ({
        ...prev,
        children: prev.children.filter((_, index) => index !== idx),
      }));
    }
  };

  const handleSubmit = () => {
  console.log("Form submitted:", JSON.stringify(form, null, 2));
  alert("Employee details saved successfully!");
  // Removed the clearForm() call here - let user decide when to clear
};

  const clearForm = () => {
  try {
    // Reset to initial state with exactly one empty child
    setForm({
      ...initialState,
      children: [{ name: "", age: "", dob: "", nic: "" }]
    });
    localStorage.removeItem(STORAGE_KEY);
    console.log("✅ Form cleared and localStorage data removed");

    // Verify the clear worked
    const verification = localStorage.getItem(STORAGE_KEY);
    if (!verification) {
      console.log("✅ Clear verified successfully");
    } else {
      console.error("❌ Clear verification failed");
    }
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

  // Test localStorage function
  const testLocalStorage = () => {
    try {
      const testKey = "test_key";
      const testValue = "test_value";

      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      if (retrieved === testValue) {
        // console.log("✅ localStorage is working correctly");
        alert("localStorage is working correctly");
      } else {
        // console.error("❌ localStorage test failed");
        alert("localStorage test failed");
      }
    } catch (error) {
      // console.error("❌ localStorage is not available:", error);
      alert("localStorage is not available: " + error.message);
    }
  };

  const relationshipOptions = [
  { value: "", label: "Select Relationship Type" },
  { value: "husband", label: "Husband" },
  { value: "wife", label: "Wife" },
  { value: "relation", label: "Relation" },
  { value: "non-relation", label: "Non-Relation" },
  { value: "friend", label: "Friend" },
  ];

  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="bg-white rounded-2xl shadow-xl mb-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Employee Personal Details
              </h1>
              <p className="text-gray-600 mt-1">
                Complete employee information management system
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={testLocalStorage}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Test Storage
            </button>
            <button
              onClick={clearForm}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Clear Form
            </button>
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
            <h2 className="text-xl font-semibold text-gray-800">
              Basic Information
            </h2>
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
              <label className="block text-sm font-medium text-gray-700">
                Religion
              </label>
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
              <label className="block text-sm font-medium text-gray-700">
                Country of Birth
              </label>
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
            <h2 className="text-xl font-semibold text-gray-800">
              Employment Status
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { value: "employeeActive", label: "Employee Active" },
              { value: "permanentBasis", label: "Permanent Basis" },
              { value: "training", label: "Training" },
              { value: "contractBasis", label: "Contract Basis" },
              { value: "dailyWagesSalary", label: "Daily Wages Salary" },
            ].map((item) => (
              <label
                key={item.value}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <input
                  type="radio"
                  name="employmentStatus"
                  value={item.value}
                  checked={form.employmentStatus === item.value}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
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
            <h2 className="text-xl font-semibold text-gray-800">
              Name Details
            </h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marital Status
            </label>
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
            <h2 className="text-xl font-semibold text-gray-800">
              Relationship Details
            </h2>
          </div>

          <div className="mt-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship Type
            </label>
            <select
              name="relationshipType"
              value={form.relationshipType || ""}
              onChange={handleChange}
              className="w-full lg:w-1/3 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
            >
              {relationshipOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                name="spouseName"
                value={form.spouseName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter spouse name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
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
              <label className="block text-sm font-medium text-gray-700">
                DOB
              </label>
              <input
                name="spouseDob"
                type="date"
                value={form.spouseDob}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                NIC
              </label>
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

        {/* Children Details - Dynamic */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg">
                <Baby className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Children Details
              </h2>
            </div>
            <button
              onClick={addChild}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Child
            </button>
          </div>

          <div className="space-y-4">
            {form.children.map((child, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-600">
                    Child {idx + 1}
                  </h3>
                  {form.children.length > 1 && (
                    <button
                      onClick={() => removeChild(idx)}
                      className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input
                    name="name"
                    placeholder="Child name"
                    value={child.name}
                    onChange={(e) => handleChildChange(idx, e)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <input
                    name="age"
                    type="number"
                    min="0"
                    placeholder="Age"
                    value={child.age}
                    onChange={(e) => handleChildChange(idx, e)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <input
                    name="dob"
                    type="date"
                    value={child.dob}
                    onChange={(e) => handleChildChange(idx, e)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <input
                    name="nic"
                    placeholder="NIC number"
                    value={child.nic}
                    onChange={(e) => handleChildChange(idx, e)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        {/* <div className="flex justify-center gap-4 pb-6">
          <button
            type="button"
            onClick={() => {
              handleSubmit();
              clearForm();
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:ring-4 focus:ring-blue-300"
          >
            Save Employee Details
          </button>
        </div> */}
        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={onNext}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmpPersonalDetails;
