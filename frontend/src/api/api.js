// This acts as your connection to the backend
const api = {
  // Add base axios or fetch configuration here later
};

export const children = {
  create: async (data) => {
    console.log("Mock API: Creating Child Profile", data);
    return { id: Math.random(), ...data };
  },
  update: async (id, data) => {
    console.log("Mock API: Updating Child Profile", id, data);
    return { id, ...data };
  },
  uploadProfilePicture: async (id, file) => {
    console.log("Mock API: Uploading photo for", id);
    return { profile_picture_url: URL.createObjectURL(file) };
  }
};

export default api;