import React, { useState, useEffect } from 'react';
import { Building2, Users, UserCheck, Calendar, Plus, Edit2, Trash2, Search, Filter, ChevronDown, ChevronRight } from 'lucide-react';
import { fetchCompanies, fetchDepartments, fetchSubDepartments } from '../../services/ApiDataService';

const Department = () => {
  const [activeTab, setActiveTab] = useState('companies');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [modalMode, setModalMode] = useState('add');
  const [editingCompany, setEditingCompany] = useState(null);
  const [companyForm, setCompanyForm] = useState({
    name: '',
    location: '',
    employees: '',
    established: ''
  });

  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);

  useEffect(() => {
    fetchCompanies().then(setCompanies);
    fetchDepartments().then(setDepartments);
    fetchSubDepartments().then(setSubDepartments);
  }, []);

  // Merge subdepartments into departments
  const departmentsWithSubs = departments.map(dept => ({
    ...dept,
    subdepartments: subDepartments.filter(sub => sub.department_id === dept.id)
  }));

  // Merge departments into companies
  const companiesWithDeps = companies.map(company => ({
    ...company,
    departments: departmentsWithSubs.filter(dept => dept.company_id === company.id)
  }));

  function toggleRowExpansion(id) {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  }

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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.employees}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.established}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <ActionButton
                      icon={Edit2}
                      onClick={() => {
                        setModalMode('edit');
                        setEditingCompany(company);
                        setCompanyForm({
                          name: company.name || '',
                          location: company.location || '',
                          employees: company.employees || '',
                          established: company.established || ''
                        });
                        setShowAddModal(true);
                      }}
                    />
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
              {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th> */}
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subdepartments</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companiesWithDeps.flatMap(company =>
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
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.manager}</td> */}
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
                      {/* <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{subdept.manager}</td> */}
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
              {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th> */}
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO Of Employees</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companiesWithDeps.flatMap(company =>
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
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-medium text-gray-600">
                            {(subdept.manager || '').split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-900">{subdept.manager}</div>
                      </div>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className=" px-8 py-1 text-sm text-gray-900">{subdept.employees}</div>
                        {/* <div className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {subdept.employees > 15 ? 'Large' : subdept.employees > 8 ? 'Medium' : 'Small'}
                        </div> */}
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
          <h3 className="text-lg font-semibold mb-4">
            {modalMode === 'add' ? 'Add New Company' : 'Edit Company'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={companyForm.name}
                onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={companyForm.location}
                onChange={e => setCompanyForm({ ...companyForm, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employees</label>
              <input
                type="number"
                value={companyForm.employees}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Established</label>
              <input
                type="text"
                value={companyForm.established}
                onChange={e => setCompanyForm({ ...companyForm, established: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (modalMode === 'add') {
                  setCompanies([
                    ...companies,
                    {
                      id: Date.now(),
                      ...companyForm
                    }
                  ]);
                } else if (modalMode === 'edit' && editingCompany) {
                  setCompanies(companies.map(c =>
                    c.id === editingCompany.id ? { ...editingCompany, ...companyForm } : c
                  ));
                }
                setShowAddModal(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {modalMode === 'add' ? 'Add Company' : 'Save Changes'}
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
          value={companies.length} 
          color="bg-blue-500" 
        />
        <StatCard 
          icon={Users} 
          title="Total Departments" 
          value={departments.length} 
          color="bg-green-500" 
        />
        <StatCard 
          icon={UserCheck} 
          title="Subdepartments" 
          value={subDepartments.length} 
          color="bg-purple-500" 
        />
        <StatCard 
          icon={Calendar} 
          title="Total Employees" 
          value={companies.reduce((sum, c) => sum + (parseInt(c.employees) || 0), 0)} 
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
          onClick={() => {
            setModalMode('add');
            setCompanyForm({ name: '', location: '', employees: '', established: '' });
            setShowAddModal(true);
          }}
          text="Add Company"
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