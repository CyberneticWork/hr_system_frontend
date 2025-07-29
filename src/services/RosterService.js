import axios from "@utils/axios";

const getAllRosters = async () => {
  try {
    const response = await axios.get(`/rosters`);
    return response.data;
  } catch (error) {
    console.error("Error fetching rosters:", error);
    throw error;
  }
};

const createRoster = async (rosterData) => {
  try {
    const response = await axios.post(`/rosters`, rosterData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating roster:", error);
    throw error.response?.data?.errors || error.message;
  }
};

const updateRoster = async (id, rosterData) => {
  try {
    const response = await axios.put(`/rosters/${id}`, rosterData);
    return response.data.data;
  } catch (error) {
    console.error("Error updating roster:", error);
    throw error.response?.data?.errors || error.message;
  }
};

const deleteRoster = async (id) => {
  try {
    await axios.delete(`/rosters/${id}`);
  } catch (error) {
    console.error("Error deleting roster:", error);
    throw error;
  }
};

const searchRosters = async (searchParams) => {
  try {
    const response = await axios.get("/roster/search", {
      params: searchParams,
    });
    return response.data.data || [];
  } catch (error) {
    console.error("Error searching rosters:", error);
    throw error;
  }
};

export default {
  getAllRosters,
  createRoster,
  updateRoster,
  searchRosters,
  deleteRoster,
};
