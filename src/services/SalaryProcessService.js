import axios from "@utils/axios";

export const getSalaryData = async (month, year, company_id, department_id) => {
  try {
    const response = await axios.get(
      `/salary/process/employees-by-month?month=${month}&year=${year}&company_id=${company_id}&department_id=${department_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching salary data:", error);
    throw error;
  }
};

export const UpdateAllowances = async (allowances) => {
  try {
    const response = await axios.post(`/salary/process/allowances`, allowances);
    return response.data;
  } catch (error) {
    console.error("Error fetching salary data:", error);
    throw error;
  }
};
