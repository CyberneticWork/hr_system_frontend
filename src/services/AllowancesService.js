import axios from "@utils/axios";

const getAllAllowances = async () => {
  try {
    const response = await axios.get(`/allowances`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching allowances:", error);
    throw error;
  }
};

const createAllowance = async (allowanceData) => {
  try {
    const response = await axios.post(`/allowances`, allowanceData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating allowance:", error);
    throw error.response?.data?.errors || error.message;
  }
};

const updateAllowance = async (id, allowanceData) => {
  try {
    const response = await axios.put(`/allowances/${id}`, allowanceData);
    return response.data.data;
  } catch (error) {
    console.error("Error updating allowance:", error);
    throw error.response?.data?.errors || error.message;
  }
};

const deleteAllowance = async (id) => {
  try {
    await axios.delete(`/allowances/${id}`);
  } catch (error) {
    console.error("Error deleting allowance:", error);
    throw error;
  }
};

const getAllowancesByCompanyOrDepartment = async (companyId, departmentId) => {
  try {
    const response = await axios.get(`/allowance/by-company-or-department`, {
      params: {
        companyId,
        departmentId,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching allowances by company or department:", error);
    throw error;
  }
};

export default {
  getAllAllowances,
  createAllowance,
  updateAllowance,
  deleteAllowance,
  getAllowancesByCompanyOrDepartment,
};
