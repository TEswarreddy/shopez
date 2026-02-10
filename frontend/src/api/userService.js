import axiosInstance from "./axios"

// Get current user profile
export const getProfile = async () => {
  const response = await axiosInstance.get("/users/profile")
  return response.data.user
}

// Update user profile
export const updateProfile = async (profileData) => {
  const response = await axiosInstance.put("/users/profile", profileData)
  return response.data.user
}

// Change password
export const changePassword = async (passwordData) => {
  const response = await axiosInstance.put("/users/change-password", passwordData)
  return response.data
}

// Upload profile picture
export const uploadProfilePicture = async (formData) => {
  const response = await axiosInstance.post("/users/profile-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data.user
}

// Get user addresses
export const getAddresses = async () => {
  const response = await axiosInstance.get("/users/addresses")
  return response.data.addresses
}

// Add new address
export const addAddress = async (addressData) => {
  const response = await axiosInstance.post("/users/addresses", addressData)
  return response.data.address
}

// Update address
export const updateAddress = async (addressId, addressData) => {
  const response = await axiosInstance.put(`/users/addresses/${addressId}`, addressData)
  return response.data.address
}

// Delete address
export const deleteAddress = async (addressId) => {
  const response = await axiosInstance.delete(`/users/addresses/${addressId}`)
  return response.data
}

// Set default address
export const setDefaultAddress = async (addressId) => {
  const response = await axiosInstance.put(`/users/addresses/${addressId}/default`)
  return response.data.address
}

export default {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
}
