import axios from '@utils/axios';

const employeeService = {
  // Submit employee data with file uploads
  async submitEmployee(formData) {
    try {
      // Create FormData for file uploads
      const submissionData = new FormData();
      
      // Append profile picture if exists
      if (formData.personal.profilePicture) {
        submissionData.append('profile_picture', formData.personal.profilePicture);
      }

      // Append all other form data as JSON
      submissionData.append('personal', JSON.stringify({
        ...formData.personal,
        profilePicture: undefined // Remove the file object from JSON data
      }));
      
      submissionData.append('address', JSON.stringify(formData.address));
      submissionData.append('compensation', JSON.stringify(formData.compensation));
      submissionData.append('organization', JSON.stringify(formData.organization));
      
      // Append documents if any
      if (formData.documents && formData.documents.length > 0) {
        formData.documents.forEach((doc, index) => {
          if (doc.file) {
            submissionData.append(`documents[${index}]`, doc.file);
          }
        });
      }

      const response = await axios.post('/employees', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error submitting employee:', error);
      throw error;
    }
  },

  
};

export default employeeService;