import React, { useState } from "react";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    alert("Submitted!");
  };

  return (
    <form className="space-y-6 max-w-2xl mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Personal Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div>
          <label className="block font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <select
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option>Mr</option>
            <option>Mrs</option>
            <option>Miss</option>
            <option>Ms</option>
            <option>Dr</option>
          </select>
        </div>
        {/* Attendance Emp No */}
        <div>
          <label className="block font-medium">
            Attendance Emp No <span className="text-red-500">*</span>
          </label>
          <input
            name="attendanceEmpNo"
            value={form.attendanceEmpNo}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        {/* EPF No */}
        <div>
          <label className="block font-medium">
            EPF No <span className="text-red-500">*</span>
          </label>
          <input
            name="epfNo"
            value={form.epfNo}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        {/* NIC Number */}
        <div>
          <label className="block font-medium">
            NIC Number <span className="text-red-500">*</span>
          </label>
          <input
            name="nicNumber"
            value={form.nicNumber}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        {/* Date of Birth */}
        <div>
          <label className="block font-medium">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        {/* Gender */}
        <div>
          <label className="block font-medium">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        {/* Religion */}
        <div>
          <label className="block font-medium">Religion</label>
          <input
            name="religion"
            value={form.religion}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        {/* Country of Birth */}
        <div>
          <label className="block font-medium">Country of Birth</label>
          <input
            name="countryOfBirth"
            value={form.countryOfBirth}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Employment Types */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="employeeActive"
            checked={form.employeeActive}
            onChange={handleChange}
          />
          Employee Active
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="permanentBasis"
            checked={form.permanentBasis}
            onChange={handleChange}
          />
          Permanent Basis
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="training"
            checked={form.training}
            onChange={handleChange}
          />
          Training
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="contractBasis"
            checked={form.contractBasis}
            onChange={handleChange}
          />
          Contract Basis
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="dailyWagesSalary"
            checked={form.dailyWagesSalary}
            onChange={handleChange}
          />
          Daily Wages Salary
        </label>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-medium">
            Name With Initial <span className="text-red-500">*</span>
          </label>
          <input
            name="nameWithInitial"
            value={form.nameWithInitial}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium">
            Display Name <span className="text-red-500">*</span>
          </label>
          <input
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Marital Status */}
      <div>
        <label className="block font-medium">Marital Status</label>
        <input
          name="maritalStatus"
          value={form.maritalStatus}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Spouse Details */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block font-medium">Husband/Wife Name</label>
          <input
            name="spouseName"
            value={form.spouseName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium">Husband/Wife Age</label>
          <input
            name="spouseAge"
            type="number"
            min="0"
            value={form.spouseAge}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium">Husband/Wife DOB</label>
          <input
            name="spouseDob"
            type="date"
            value={form.spouseDob}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium">Husband/Wife NIC</label>
          <input
            name="spouseNic"
            value={form.spouseNic}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Children Details */}
      <div>
        <label className="block font-medium mb-2">Children Details</label>
        {[0, 1, 2].map((idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
            <input
              name="name"
              placeholder={`Children Name ${idx + 1}`}
              value={form.children[idx].name}
              onChange={(e) => handleChildChange(idx, e)}
              className="w-full border rounded px-3 py-2"
            />
            <input
              name="age"
              type="number"
              min="0"
              placeholder={`Children Name ${idx + 1} Age`}
              value={form.children[idx].age}
              onChange={(e) => handleChildChange(idx, e)}
              className="w-full border rounded px-3 py-2"
            />
            <input
              name="dob"
              type="date"
              placeholder={`Children Name ${idx + 1} DOB`}
              value={form.children[idx].dob}
              onChange={(e) => handleChildChange(idx, e)}
              className="w-full border rounded px-3 py-2"
            />
            <input
              name="nic"
              placeholder={`Children Name ${idx + 1} NIC`}
              value={form.children[idx].nic}
              onChange={(e) => handleChildChange(idx, e)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
      >
        Save Details
      </button>
    </form>
  );
};

export default EmpPersonalDetails;