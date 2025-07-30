import axios from "@utils/axios";

export const fetchSalaryDataAPI = async () => {
  try {
    const response = await axios.get(`/salary`);
    return response.data;
  } catch (error) {
    console.error("Error fetching salary data:", error);
    throw error;
  }
};

export const updateSalary = async (id, status) => {
  try {
    const response = await fetch(`/api/salary-records/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error("Failed to update salary status");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating salary status:", error);
    throw error;
  }
};

export const deleteSalaryRecord = async (id) => {
  try {
    const response = await fetch(`/api/salary-records/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete salary record");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting salary record:", error);
    throw error;
  }
};
