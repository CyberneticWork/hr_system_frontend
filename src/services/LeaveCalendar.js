import axios from "@utils/axios";

//fetch all from LeaveCalendar
export async function fetchLeaveCalendar() {
  try {
    const response = await axios.get("/leave-calendars");
    return response.data;
  } catch (error) {
    console.error("Error fetching leave calendar:", error);
    return [];
  }
}

// Create a new leave entry
export async function createLeaveEntry(data) {
  try {
    const response = await axios.post("/leave-calendars", data);
    return response.data;
  } catch (error) {
    console.error("Error creating leave entry:", error);
    throw error;
  }
}

// Get a single leave entry by ID
export async function getLeaveEntry(id) {
  try {
    const response = await axios.get(`/leave-calendars/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching leave entry:", error);
    return null;
  }
}

// Update a leave entry by ID
export async function updateLeaveEntry(id, data) {
  try {
    const response = await axios.put(`/leave-calendars/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating leave entry:", error);
    throw error;
  }
}

// Delete a leave entry by ID
export async function deleteLeaveEntry(id) {
  try {
    const response = await axios.delete(`/leave-calendars/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting leave entry:", error);
    throw error;
  }
}
