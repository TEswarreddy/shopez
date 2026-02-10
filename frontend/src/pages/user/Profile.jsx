import { useState, useEffect, useRef } from "react"
import { useAuth } from "../../context/AuthContext"
import {
  updateProfile,
  changePassword,
  uploadProfilePicture,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../api/userService"

function Profile() {
  const { user, setUser } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const fileInputRef = useRef(null)

  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [profileErrors, setProfileErrors] = useState({})

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordErrors, setPasswordErrors] = useState({})

  // Address state
  const [addresses, setAddresses] = useState([])
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [addressData, setAddressData] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    isDefault: false,
  })
  const [addressErrors, setAddressErrors] = useState({})

  // Profile picture upload
  const [uploadingPicture, setUploadingPicture] = useState(false)

  // Load profile data
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      })
    }
  }, [user])

  // Load addresses
  useEffect(() => {
    if (activeTab === "addresses") {
      fetchAddresses()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      const data = await getAddresses()
      setAddresses(data)
    } catch (err) {
      console.error("Error fetching addresses:", err)
      showMessage("error", "Failed to load addresses")
    }
  }

  // Show message helper
  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: "", text: "" }), 5000)
  }

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    
    // Validate
    const errors = {}
    if (!profileData.firstName.trim()) errors.firstName = "First name is required"
    if (!profileData.lastName.trim()) errors.lastName = "Last name is required"
    if (!profileData.email.trim()) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(profileData.email)) errors.email = "Invalid email"
    
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors)
      return
    }

    try {
      setLoading(true)
      setProfileErrors({})
      const updatedUser = await updateProfile(profileData)
      
      // Update localStorage and context
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      showMessage("success", "Profile updated successfully!")
    } catch (err) {
      console.error("Error updating profile:", err)
      showMessage("error", err.response?.data?.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    // Validate
    const errors = {}
    if (!passwordData.currentPassword) errors.currentPassword = "Current password is required"
    if (!passwordData.newPassword) errors.newPassword = "New password is required"
    else if (passwordData.newPassword.length < 6) errors.newPassword = "Password must be at least 6 characters"
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors)
      return
    }

    try {
      setLoading(true)
      setPasswordErrors({})
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      
      // Clear form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      
      showMessage("success", "Password changed successfully!")
    } catch (err) {
      console.error("Error changing password:", err)
      showMessage("error", err.response?.data?.message || "Failed to change password")
    } finally {
      setLoading(false)
    }
  }

  // Handle profile picture upload
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith("image/")) {
      showMessage("error", "Please select an image file")
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showMessage("error", "Image size must be less than 5MB")
      return
    }

    try {
      setUploadingPicture(true)
      const formData = new FormData()
      formData.append("profilePicture", file)
      
      const updatedUser = await uploadProfilePicture(formData)
      
      // Update localStorage and context
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      showMessage("success", "Profile picture updated successfully!")
    } catch (err) {
      console.error("Error uploading profile picture:", err)
      showMessage("error", err.response?.data?.message || "Failed to upload profile picture")
    } finally {
      setUploadingPicture(false)
    }
  }

  // Handle address form change
  const handleAddressChange = (field, value) => {
    setAddressData(prev => ({ ...prev, [field]: value }))
    if (addressErrors[field]) {
      setAddressErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  // Validate address
  const validateAddress = () => {
    const errors = {}
    if (!addressData.fullName.trim()) errors.fullName = "Name is required"
    if (!addressData.phone.trim()) errors.phone = "Phone is required"
    else if (!/^[0-9]{10}$/.test(addressData.phone)) errors.phone = "Phone must be 10 digits"
    if (!addressData.street.trim()) errors.street = "Street is required"
    if (!addressData.city.trim()) errors.city = "City is required"
    if (!addressData.state.trim()) errors.state = "State is required"
    if (!addressData.zipCode.trim()) errors.zipCode = "ZIP code is required"
    else if (!/^[0-9]{6}$/.test(addressData.zipCode)) errors.zipCode = "ZIP must be 6 digits"
    
    setAddressErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle add/edit address
  const handleSaveAddress = async (e) => {
    e.preventDefault()
    
    if (!validateAddress()) return

    try {
      setLoading(true)
      
      if (editingAddress) {
        await updateAddress(editingAddress._id, addressData)
        showMessage("success", "Address updated successfully!")
      } else {
        await addAddress(addressData)
        showMessage("success", "Address added successfully!")
      }
      
      // Reset form and close modal
      setShowAddressModal(false)
      setEditingAddress(null)
      setAddressData({
        label: "Home",
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
        isDefault: false,
      })
      setAddressErrors({})
      
      // Refresh addresses
      await fetchAddresses()
    } catch (err) {
      console.error("Error saving address:", err)
      showMessage("error", err.response?.data?.message || "Failed to save address")
    } finally {
      setLoading(false)
    }
  }

  // Handle delete address
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return

    try {
      await deleteAddress(addressId)
      showMessage("success", "Address deleted successfully!")
      await fetchAddresses()
    } catch (err) {
      console.error("Error deleting address:", err)
      showMessage("error", err.response?.data?.message || "Failed to delete address")
    }
  }

  // Handle set default address
  const handleSetDefaultAddress = async (addressId) => {
    try {
      await setDefaultAddress(addressId)
      showMessage("success", "Default address updated!")
      await fetchAddresses()
    } catch (err) {
      console.error("Error setting default address:", err)
      showMessage("error", err.response?.data?.message || "Failed to set default address")
    }
  }

  // Open edit address modal
  const openEditAddress = (address) => {
    setEditingAddress(address)
    setAddressData({
      label: address.label || "Home",
      fullName: address.fullName || "",
      phone: address.phone || "",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      zipCode: address.zipCode || "",
      country: address.country || "India",
      isDefault: address.isDefault || false,
    })
    setShowAddressModal(true)
  }

  // Open add address modal
  const openAddAddress = () => {
    setEditingAddress(null)
    setAddressData({
      label: "Home",
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      isDefault: false,
    })
    setAddressErrors({})
    setShowAddressModal(true)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="mt-2 text-slate-600">Manage your account settings and preferences</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 rounded-lg p-4 ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {message.type === "success" ? (
                <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              {/* Profile Picture */}
              <div className="mb-6 text-center">
                <div className="relative mx-auto mb-4 h-32 w-32">
                  <div className="h-full w-full overflow-hidden rounded-full bg-slate-200">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.firstName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1f5fbf] to-[#1a4da0] text-4xl font-bold text-white">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPicture}
                    className="absolute bottom-0 right-0 rounded-full bg-[#1f5fbf] p-2 text-white shadow-lg transition hover:bg-[#1a4da0] hover:scale-110 active:scale-95 disabled:opacity-50"
                  >
                    {uploadingPicture ? (
                      <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-sm text-slate-600">{user?.email}</p>
                <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                  {user?.role}
                </span>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-semibold transition ${
                    activeTab === "profile"
                      ? "bg-[#1f5fbf] text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile Information
                </button>

                <button
                  onClick={() => setActiveTab("password")}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-semibold transition ${
                    activeTab === "password"
                      ? "bg-[#1f5fbf] text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Change Password
                </button>

                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-semibold transition ${
                    activeTab === "addresses"
                      ? "bg-[#1f5fbf] text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Saved Addresses
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Information Tab */}
            {activeTab === "profile" && (
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-2xl font-bold text-slate-900">Profile Information</h2>
                
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => {
                          setProfileData({ ...profileData, firstName: e.target.value })
                          if (profileErrors.firstName) setProfileErrors({ ...profileErrors, firstName: "" })
                        }}
                        className={`w-full rounded-lg border-2 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#1f5fbf]/20 ${
                          profileErrors.firstName ? "border-red-500" : "border-slate-200"
                        }`}
                        placeholder="John"
                      />
                      {profileErrors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{profileErrors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => {
                          setProfileData({ ...profileData, lastName: e.target.value })
                          if (profileErrors.lastName) setProfileErrors({ ...profileErrors, lastName: "" })
                        }}
                        className={`w-full rounded-lg border-2 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#1f5fbf]/20 ${
                          profileErrors.lastName ? "border-red-500" : "border-slate-200"
                        }`}
                        placeholder="Doe"
                      />
                      {profileErrors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{profileErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Email *</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => {
                        setProfileData({ ...profileData, email: e.target.value })
                        if (profileErrors.email) setProfileErrors({ ...profileErrors, email: "" })
                      }}
                      className={`w-full rounded-lg border-2 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#1f5fbf]/20 ${
                        profileErrors.email ? "border-red-500" : "border-slate-200"
                      }`}
                      placeholder="john@example.com"
                    />
                    {profileErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value.replace(/\D/g, "") })
                      }
                      maxLength={10}
                      className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#1f5fbf]/20"
                      placeholder="9876543210"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-[#1f5fbf] py-4 font-semibold text-white transition hover:bg-[#1a4da0] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </button>
                </form>
              </div>
            )}

            {/* Change Password Tab */}
            {activeTab === "password" && (
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-2xl font-bold text-slate-900">Change Password</h2>
                
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                        if (passwordErrors.currentPassword) {
                          setPasswordErrors({ ...passwordErrors, currentPassword: "" })
                        }
                      }}
                      className={`w-full rounded-lg border-2 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#1f5fbf]/20 ${
                        passwordErrors.currentPassword ? "border-red-500" : "border-slate-200"
                      }`}
                      placeholder="Enter current password"
                    />
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      New Password *
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                        if (passwordErrors.newPassword) {
                          setPasswordErrors({ ...passwordErrors, newPassword: "" })
                        }
                      }}
                      className={`w-full rounded-lg border-2 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#1f5fbf]/20 ${
                        passwordErrors.newPassword ? "border-red-500" : "border-slate-200"
                      }`}
                      placeholder="Enter new password"
                    />
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                    )}
                    <p className="mt-1 text-sm text-slate-500">Password must be at least 6 characters</p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        if (passwordErrors.confirmPassword) {
                          setPasswordErrors({ ...passwordErrors, confirmPassword: "" })
                        }
                      }}
                      className={`w-full rounded-lg border-2 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#1f5fbf]/20 ${
                        passwordErrors.confirmPassword ? "border-red-500" : "border-slate-200"
                      }`}
                      placeholder="Confirm new password"
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-[#1f5fbf] py-4 font-semibold text-white transition hover:bg-[#1a4da0] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Changing Password..." : "Change Password"}
                  </button>
                </form>
              </div>
            )}

            {/* Saved Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Saved Addresses</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Manage your delivery addresses ({addresses.length})
                    </p>
                  </div>
                  <button
                    onClick={openAddAddress}
                    className="flex items-center gap-2 rounded-lg bg-[#1f5fbf] px-6 py-3 font-semibold text-white transition hover:bg-[#1a4da0] hover:scale-105 active:scale-95"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Address
                  </button>
                </div>

                {/* Address List */}
                {addresses.length === 0 ? (
                  <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
                      <svg className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-slate-900">No Addresses Yet</h3>
                    <p className="mb-6 text-slate-600">Add your first delivery address to get started.</p>
                    <button
                      onClick={openAddAddress}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#1f5fbf] px-6 py-3 font-semibold text-white transition hover:bg-[#1a4da0]"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md ${
                          address.isDefault ? "border-2 border-[#1f5fbf]" : "border-2 border-transparent"
                        }`}
                      >
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-slate-900">{address.label}</h3>
                              {address.isDefault && (
                                <span className="rounded-full bg-[#1f5fbf] px-2 py-0.5 text-xs font-semibold text-white">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600">{address.fullName}</p>
                          </div>
                        </div>

                        <div className="mb-4 space-y-1 text-sm text-slate-700">
                          <p>{address.phone}</p>
                          <p>{address.street}</p>
                          <p>
                            {address.city}, {address.state} - {address.zipCode}
                          </p>
                          <p>{address.country}</p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditAddress(address)}
                            className="flex-1 rounded-lg border-2 border-slate-200 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(address._id)}
                              className="flex-1 rounded-lg border-2 border-[#1f5fbf] py-2 text-sm font-semibold text-[#1f5fbf] transition hover:bg-[#1f5fbf] hover:text-white"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(address._id)}
                            className="rounded-lg border-2 border-red-200 px-3 py-2 text-red-600 transition hover:border-red-300 hover:bg-red-50"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h2>
              <button
                onClick={() => {
                  setShowAddressModal(false)
                  setEditingAddress(null)
                  setAddressErrors({})
                }}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Address Label</label>
                <select
                  value={addressData.label}
                  onChange={(e) => handleAddressChange("label", e.target.value)}
                  className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#1f5fbf]/20"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    value={addressData.fullName}
                    onChange={(e) => handleAddressChange("fullName", e.target.value)}
                    className={`w-full rounded-lg border-2 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#1f5fbf]/20 ${
                      addressErrors.fullName ? "border-red-500" : "border-slate-200"
                    }`}
                    placeholder="John Doe"
                  />
                  {addressErrors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{addressErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Phone *</label>
                  <input
                    type="tel"
                    value={addressData.phone}
                    onChange={(e) => handleAddressChange("phone", e.target.value.replace(/\D/g, ""))}
                    maxLength={10}
                    className={`w-full rounded-lg border-2 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#1f5fbf]/20 ${
                      addressErrors.phone ? "border-red-500" : "border-slate-200"
                    }`}
                    placeholder="9876543210"
                  />
                  {addressErrors.phone && <p className="mt-1 text-sm text-red-600">{addressErrors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Street Address *</label>
                <input
                  type="text"
                  value={addressData.street}
                  onChange={(e) => handleAddressChange("street", e.target.value)}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#1f5fbf]/20 ${
                    addressErrors.street ? "border-red-500" : "border-slate-200"
                  }`}
                  placeholder="123 Main Street, Apartment 4B"
                />
                {addressErrors.street && <p className="mt-1 text-sm text-red-600">{addressErrors.street}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">City *</label>
                  <input
                    type="text"
                    value={addressData.city}
                    onChange={(e) => handleAddressChange("city", e.target.value)}
                    className={`w-full rounded-lg border-2 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#1f5fbf]/20 ${
                      addressErrors.city ? "border-red-500" : "border-slate-200"
                    }`}
                    placeholder="Mumbai"
                  />
                  {addressErrors.city && <p className="mt-1 text-sm text-red-600">{addressErrors.city}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">State *</label>
                  <input
                    type="text"
                    value={addressData.state}
                    onChange={(e) => handleAddressChange("state", e.target.value)}
                    className={`w-full rounded-lg border-2 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#1f5fbf]/20 ${
                      addressErrors.state ? "border-red-500" : "border-slate-200"
                    }`}
                    placeholder="Maharashtra"
                  />
                  {addressErrors.state && <p className="mt-1 text-sm text-red-600">{addressErrors.state}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">ZIP Code *</label>
                  <input
                    type="text"
                    value={addressData.zipCode}
                    onChange={(e) => handleAddressChange("zipCode", e.target.value.replace(/\D/g, ""))}
                    maxLength={6}
                    className={`w-full rounded-lg border-2 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#1f5fbf]/20 ${
                      addressErrors.zipCode ? "border-red-500" : "border-slate-200"
                    }`}
                    placeholder="400001"
                  />
                  {addressErrors.zipCode && <p className="mt-1 text-sm text-red-600">{addressErrors.zipCode}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Country</label>
                  <input
                    type="text"
                    value={addressData.country}
                    disabled
                    className="w-full rounded-lg border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressData.isDefault}
                  onChange={(e) => handleAddressChange("isDefault", e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-[#1f5fbf] focus:ring-2 focus:ring-[#1f5fbf]/20"
                />
                <label htmlFor="isDefault" className="text-sm font-semibold text-slate-700">
                  Set as default address
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddressModal(false)
                    setEditingAddress(null)
                    setAddressErrors({})
                  }}
                  className="flex-1 rounded-lg border-2 border-slate-200 py-3 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-[#1f5fbf] py-3 font-semibold text-white transition hover:bg-[#1a4da0] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : editingAddress ? "Update Address" : "Add Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
