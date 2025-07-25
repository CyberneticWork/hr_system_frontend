import axios from "@utils/axios";

const timeCardService = {
  // ...existing methods...

  async fetchEmployeeByNic(nic) {
    try {
      const response = await axios.get(`/employees/by-nic/${nic}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching employee by NIC:", error);
      return null;
    }
  },

  markAbsentees: async (date) => {
    const response = await axios.post('/attendance/mark-absentees', { date });
    return response.data;
  },

  // Add these methods:
  updateTimeCard: async (id, data) => {
    const response = await axios.put(`/time-cards/${id}`, data);
    return response.data;
  },

  deleteTimeCard: async (id) => {
    const response = await axios.delete(`/time-cards/${id}`);
    return response.data;
  },
};

export default timeCardService;