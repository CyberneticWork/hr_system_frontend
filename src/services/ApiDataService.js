import axios from "@utils/axios";

const API_PREFIX = "/apiData";

export const fetchCompanies = async () => {
  try {
    const response = await axios.get(`${API_PREFIX}/companies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
};

export const fetchDepartments = async () => {
  try {
    const response = await axios.get(`${API_PREFIX}/departments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
};

export const fetchDepartmentsById = async (id) => {
  try {
    const response = await axios.get(`${API_PREFIX}/departments/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
};

export const fetchSubDepartments = async () => {
  try {
    const response = await axios.get(`${API_PREFIX}/subDepartments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sub-departments:", error);
    return [];
  }
};

export const fetchSubDepartmentsById = async (id) => {
  try {
    const response = await axios.get(`${API_PREFIX}/subDepartments/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sub-departments:", error);
    return [];
  }
};

export const fetchDesignations = async () => {
  try {
    const response = await axios.get(`${API_PREFIX}/designations`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Designations:", error);
    return [];
  }
};
