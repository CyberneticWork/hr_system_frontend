import axios from "@utils/axios";

const getSalaryData = async (month, year, company_id, department_id) => {
  try {
    const response = await axios.get(
      `/salary/process/employees-by-month?month=${month}&year=${year}&company_id=${company_id}&department_id=${department_id}`
    );
    // const response = await axios.get(`/salary/process/employees-by-month?month=8&year=2025&company_id=3&department_id=7`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching rosters:", error);
    throw error;
  }
};

// const createRoster = async (rosterData) => {
//   try {
//     const response = await axios.post(`/rosters`, rosterData);
//     return response.data.data;
//   } catch (error) {
//     console.error("Error creating roster:", error);
//     throw error.response?.data?.errors || error.message;
//   }
// };

// const updateRoster = async (id, rosterData) => {
//   try {
//     const response = await axios.put(`/rosters/${id}`, rosterData);
//     return response.data.data;
//   } catch (error) {
//     console.error("Error updating roster:", error);
//     throw error.response?.data?.errors || error.message;
//   }
// };

// const deleteRoster = async (id) => {
//   try {
//     await axios.delete(`/rosters/${id}`);
//   } catch (error) {
//     console.error("Error deleting roster:", error);
//     throw error;
//   }
// };

export default {
  getSalaryData,
};
