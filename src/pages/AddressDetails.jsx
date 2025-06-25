import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  User,
  Building,
  Globe,
  Shield,
} from "lucide-react";

const initialState = {
  // Personal Details
  empName: "PERERA",
  empNo: "10",
  status: "ACTIVE",
  type: "PERMANENT",

  // Address Details
  name: "VINOD SANJEEWA",
  permanentAddress: "NO 40/A, DUNGALPITIYA",
  temporaryAddress: "NEGAMBO",
  email: "11504",
  landLine: "0315615110",
  mobileLine: "0717597856",
  gnDivision: "",
  policeStation: "",
  district: "GAMPAHA",

  // Location Details
  province: "SRI LANKA",
  electoralDivision: "",

  // Emergency Contact
  emergencyContact: {
    relationship: "",
    contactName: "ContactContactContactName",
    contactAddress: "NO 40/A, DUNGALPITIYA",
    contactTel: "0315615110",
  },
};

const AddressDetails = () => {
  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [name]: value,
      },
    }));
  };

  const handleSave = () => {
    alert("Address details saved successfully!");
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-xl mb-6 p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Employee Photo Section */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-16 h-16 text-white" />
            </div>
            <button className="mt-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Get Photo
            </button>
          </div>

          {/* Employee Basic Info */}
          <div className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Emp Name
                </label>
                <input
                  name="empName"
                  value={form.empName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 font-semibold text-gray-800"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Emp No
                </label>
                <input
                  name="empNo"
                  value={form.empNo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 font-semibold text-gray-800"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Status
                </label>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <input
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-green-50 font-semibold text-green-700"
                    readOnly
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Type
                </label>
                <input
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-blue-50 font-semibold text-blue-700"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Employee List Preview */}
          <div className="flex-shrink-0 lg:w-80">
            <div className="bg-gray-50 rounded-xl p-4 h-32 overflow-hidden">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Employee Directory
              </h3>
              <div className="space-y-1 text-xs">
                {[
                  {
                    id: "4",
                    name: "K.G.D.M.S",
                    surname: "MAHANAMEWITA GAMAGE DONA",
                  },
                  { id: "10", name: "M.V.S", surname: "MITHIUPORUTHTHORAGE" },
                  { id: "12", name: "G.M.J.A", surname: "GINGANNORAGE" },
                  { id: "22", name: "N.U.J.P", surname: "NAGODA VITHANAGE" },
                ].map((emp) => (
                  <div key={emp.id} className="flex gap-2 text-gray-600">
                    <span className="w-6">{emp.id}</span>
                    <span className="w-12">{emp.name}</span>
                    <span className="flex-1 truncate">{emp.surname}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg mb-6 p-1">
        <div className="flex flex-wrap gap-1">
          {[
            "Personal",
            "Address",
            "Organization",
            "Compensation",
            "Salary",
          ].map((tab, index) => (
            <button
              key={tab}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                index === 1
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Address And Contact Details */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Address And Contact Details
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Personal Address */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Personal Information
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Permanent Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="permanentAddress"
                    value={form.permanentAddress}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Enter permanent address"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Temporary Address
                  </label>
                  <textarea
                    name="temporaryAddress"
                    value={form.temporaryAddress}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Enter temporary address"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Land Line
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      name="landLine"
                      value={form.landLine}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter land line number"
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile Line
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      name="mobileLine"
                      value={form.mobileLine}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter mobile number"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Location & Emergency */}
          <div className="space-y-6">
            {/* Location Details */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-600" />
                Location Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Province
                  </label>
                  <input
                    name="province"
                    value={form.province}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter province"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Electoral Division
                  </label>
                  <input
                    name="electoralDivision"
                    value={form.electoralDivision}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter electoral division"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    GN Division
                  </label>
                  <input
                    name="gnDivision"
                    value={form.gnDivision}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter GN division"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Police Station
                  </label>
                  <input
                    name="policeStation"
                    value={form.policeStation}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter police station"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    District
                  </label>
                  <select
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Select District</option>
                    <option value="GAMPAHA">GAMPAHA</option>
                    <option value="COLOMBO">COLOMBO</option>
                    <option value="KALUTARA">KALUTARA</option>
                    <option value="KANDY">KANDY</option>
                    <option value="MATALE">MATALE</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                Emergency Contact
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Relationship
                  </label>
                  <select
                    name="relationship"
                    value={form.emergencyContact.relationship}
                    onChange={handleEmergencyContactChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Select Relationship</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Child">Child</option>
                    <option value="Friend">Friend</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="contactName"
                    value={form.emergencyContact.contactName}
                    onChange={handleEmergencyContactChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter contact name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Address
                  </label>
                  <textarea
                    name="contactAddress"
                    value={form.emergencyContact.contactAddress}
                    onChange={handleEmergencyContactChange}
                    rows="2"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Enter contact address"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Tel <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      name="contactTel"
                      value={form.emergencyContact.contactTel}
                      onChange={handleEmergencyContactChange}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter contact telephone"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:ring-4 focus:ring-blue-300"
          >
            Save Address Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressDetails;
