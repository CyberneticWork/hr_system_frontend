import axios from "@utils/axios";

export const fetchTimeCards = async () => {
  try {
    const response = await axios.get(`/overtime`);
    return response.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
};