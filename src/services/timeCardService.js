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
};

export default timeCardService;