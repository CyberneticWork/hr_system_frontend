import React, { useState } from 'react';
import { Building2, Users, UserCheck, Calendar, Plus, Edit2, Trash2, Search, Filter, ChevronDown, ChevronRight } from 'lucide-react';

const Department = () => {
  const [activeTab, setActiveTab] = useState('companies');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Sample data
  const [companies] = useState([
    {
      id: 1,
      name: 'TechCorp Solutions',
      code: 'TC001',
      location: 'New York',
      employees: 250,
      established: '2018',
      departments: [
        {
          id: 1,
          name: 'Information Technology',
          code: 'IT001',
          manager: 'John Smith',
          employees: 45,
          subdepartments: [
            { id: 1, name: 'Software Development', manager: 'Alice Johnson', employees: 25 },
            { id: 2, name: 'Network Administration', manager: 'Bob Wilson', employees: 12 },
            { id: 3, name: 'Cybersecurity', manager: 'Carol Davis', employees: 8 }
          ]
        },
        {
          id: 2,
          name: 'Human Resources',
          code: 'HR001',
          manager: 'Sarah Connor',
          employees: 15,
          subdepartments: [
            { id: 4, name: 'Recruitment', manager: 'Mike Brown', employees: 8 },
            { id: 5, name: 'Employee Relations', manager: 'Lisa White', employees: 7 }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Global Industries',
      code: 'GI002',
      location: 'California',
      employees: 180,
      established: '2020',
      departments: [
        {
          id: 3,
          name: 'Marketing',
          code: 'MK001',
          manager: 'David Lee',
          employees: 30,
          subdepartments: [
            { id: 6, name: 'Digital Marketing', manager: 'Emma Stone', employees: 18 },
            { id: 7, name: 'Brand Management', manager: 'Ryan Garcia', employees: 12 }
          ]
        }
      ]
    }
  ]);

  const toggleRowExpansion = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const AddButton = ({ onClick, text }) => (
    <button
      onClick={onClick}
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
    >
      <Plus className="w-4 h-4 mr-2" />
      {text}
    </button>
  );

  const ActionButton = ({ icon: Icon, onClick, variant = 'primary' }) => {
    const variants = {
      primary: 'text-blue-600 hover:bg-blue-50',
      danger: 'text-red-600 hover:bg-red-50'
    };
    
    return (
      <button
        onClick={onClick}
        className={`p-2 rounded-lg transition-colors ${variants[variant]}`}
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  };

  const CompaniesTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Established</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{company.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.employees}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.established}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <ActionButton icon={Edit2} onClick={() => {}} />
                    <ActionButton icon={Trash2} onClick={() => {}} variant="danger" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const DepartmentsTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subdepartments</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.flatMap(company => 
              company.departments.map(dept => (
                <React.Fragment key={`${company.id}-${dept.id}`}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleRowExpansion(`${company.id}-${dept.id}`)}
                          className="mr-2 p-1 hover:bg-gray-200 rounded"
                        >
                          {expandedRows.has(`${company.id}-${dept.id}`) ? 
                            <ChevronDown className="w-4 h-4" /> : 
                            <ChevronRight className="w-4 h-4" />
                          }
                        </button>
                        <Users className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                          <div className="text-sm text-gray-500">{dept.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.manager}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.employees}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.subdepartments.length}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <ActionButton icon={Edit2} onClick={() => {}} />
                        <ActionButton icon={Trash2} onClick={() => {}} variant="danger" />
                      </div>
                    </td>
                  </tr>
                  {expandedRows.has(`${company.id}-${dept.id}`) && dept.subdepartments.map(subdept => (
                    <tr key={subdept.id} className="bg-gray-25 border-l-4 border-blue-200">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="flex items-center pl-8">
                          <UserCheck className="w-4 h-4 text-gray-400 mr-3" />
                          <div className="text-sm font-medium text-gray-700">{subdept.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">-</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{subdept.manager}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{subdept.employees}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">-</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <ActionButton icon={Edit2} onClick={() => {}} />
                          <ActionButton icon={Trash2} onClick={() => {}} variant="danger" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const SubdepartmentsTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subdepartment</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.flatMap(company => 
              company.departments.flatMap(dept => 
                dept.subdepartments.map(subdept => (
                  <tr key={`${company.id}-${dept.id}-${subdept.id}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserCheck className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{subdept.name}</div>
                          <div className="text-sm text-gray-500">SD{subdept.id.toString().padStart(3, '0')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{dept.name}</div>
                      <div className="text-sm text-gray-500">{dept.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-medium text-gray-600">
                            {subdept.manager.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-900">{subdept.manager}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900">{subdept.employees}</div>
                        <div className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {subdept.employees > 15 ? 'Large' : subdept.employees > 8 ? 'Medium' : 'Small'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        subdept.employees > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {subdept.employees > 0 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <ActionButton icon={Edit2} onClick={() => {}} />
                        <ActionButton icon={Trash2} onClick={() => {}} variant="danger" />
                      </div>
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const AddModal = () => (
    showAddModal && (
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-4">Add New {activeTab.slice(0, -1)}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            {activeTab === 'companies' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            )}
            {activeTab === 'departments' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            )}
            {activeTab === 'subdepartments' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Department</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select Department</option>
                    {companies.flatMap(company => 
                      company.departments.map(dept => (
                        <option key={`${company.id}-${dept.id}`} value={`${company.id}-${dept.id}`}>
                          {dept.name} ({company.name})
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add {activeTab.slice(0, -1)}
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Department Management</h1>
        <p className="text-gray-600">
          Manage your organization's structure including companies, departments, and subdepartments.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={Building2} 
          title="Total Companies" 
          value="2" 
          color="bg-blue-500" 
        />
        <StatCard 
          icon={Users} 
          title="Total Departments" 
          value="3" 
          color="bg-green-500" 
        />
        <StatCard 
          icon={UserCheck} 
          title="Subdepartments" 
          value="7" 
          color="bg-purple-500" 
        />
        <StatCard 
          icon={Calendar} 
          title="Total Employees" 
          value="430" 
          color="bg-orange-500" 
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6">
        {[
          { key: 'companies', label: 'Companies', icon: Building2 },
          { key: 'departments', label: 'Departments', icon: Users },
          { key: 'subdepartments', label: 'Subdepartments', icon: UserCheck }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
        <AddButton 
          onClick={() => setShowAddModal(true)}
          text={`Add ${activeTab.slice(0, -1)}`}
        />
      </div>

      {/* Tables */}
      {activeTab === 'companies' && <CompaniesTable />}
      {activeTab === 'departments' && <DepartmentsTable />}
      {activeTab === 'subdepartments' && <SubdepartmentsTable />}

      {/* Add Modal */}
      <AddModal />
    </div>
  );
};

export default Department;