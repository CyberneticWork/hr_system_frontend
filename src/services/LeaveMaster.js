import axios from "@utils/axios";

//fetch data from leave-master
export const getAllLeaves = async () => {
  try {
    const response = await axios.get(`/leave-masters`);
    return response.data;
  } catch (error) {
    console.error("Error fetching leaves:", error);
    return [];
  }
};

// save the leave master
export const createLeave = async (data) => {
  try {
    const response = await axios.post(`/leave-masters`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating leave:", error);
    throw error;
  }
};

//update the leave master
export const updateLeave = async (id, data) => {
  try {
    const response = await axios.put(`/leave-masters/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating leave:", error);
    throw error;
  }
};

//get leave by ID
export const getLeaveById = async (id) => {
  try {
    const response = await axios.get(`/leave-masters/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching leave:", error);
    return null;
  }
};

//delete leave by ID
export const deleteLeave = async (id) => {
  try {
    const response = await axios.delete(`/leave-masters/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting leave:", error);
    throw error;
  }
};

export const getLeaveCountsByEmployee = async (employeeId) => {
  try {
    const response = await axios.get(`/Leave-Master/${employeeId}/counts`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching leave counts:",
      error.response?.data || error
    );
    throw error;
  }
};
