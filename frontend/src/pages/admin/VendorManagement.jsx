import { useState, useEffect } from "react"
import axios from "../../api/axios"
import AdminSidebar from "../../components/AdminSidebar"

function VendorManagement() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all") // all, pending, verified, suspended
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [suspensionReason, setSuspensionReason] = useState("")
  const [actionType, setActionType] = useState("") // verify, reject, suspend, edit
  const [editFormData, setEditFormData] = useState({
    businessName: "",
    businessPhone: "",
    businessEmail: "",
    storeName: "",
    businessCategory: "",
    commissionRate: ""
  })

  useEffect(() => {
    fetchVendors()
  }, [filter])

  const fetchVendors = async () => {
    try {
      setLoading(true)
      let url = "/admin/vendors"
      if (filter !== "all") {
        url += `?verificationStatus=${filter === "pending" ? "pending" : "verified"}`
      }
      const response = await axios.get(url)
      if (response.data.success) {
        setVendors(response.data.vendors)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load vendors")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyVendor = async () => {
    try {
      const response = await axios.put(`/admin/vendors/${selectedVendor._id}/verify`)
      if (response.data.success) {
        setVendors(
          vendors.map((v) =>
            v._id === selectedVendor._id
              ? { ...v, verificationStatus: "verified" }
              : v
          )
        )
        setShowModal(false)
        setSelectedVendor(null)
        alert("Vendor verified successfully!")
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to verify vendor")
    }
  }

  const handleRejectVendor = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason")
      return
    }
    try {
      const response = await axios.put(`/admin/vendors/${selectedVendor._id}/reject`, {
        reason: rejectionReason,
      })
      if (response.data.success) {
        setVendors(
          vendors.map((v) =>
            v._id === selectedVendor._id
              ? { ...v, verificationStatus: "rejected" }
              : v
          )
        )
        setShowModal(false)
        setSelectedVendor(null)
        setRejectionReason("")
        alert("Vendor rejected successfully!")
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject vendor")
    }
  }

  const handleSuspendVendor = async () => {
    try {
      const response = await axios.put(`/admin/vendors/${selectedVendor._id}/suspend`, {
        reason: suspensionReason,
      })
      if (response.data.success) {
        setVendors(
          vendors.map((v) =>
            v._id === selectedVendor._id
              ? { ...v, isSuspended: true }
              : v
          )
        )
        setShowModal(false)
        setSelectedVendor(null)
        setSuspensionReason("")
        alert("Vendor suspended successfully!")
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to suspend vendor")
    }
  }

  const handleUnsuspendVendor = async () => {
    try {
      const response = await axios.put(`/admin/vendors/${selectedVendor._id}/unsuspend`)
      if (response.data.success) {
        setVendors(
          vendors.map((v) =>
            v._id === selectedVendor._id
              ? { ...v, isSuspended: false }
              : v
          )
        )
        setShowModal(false)
        setSelectedVendor(null)
        alert("Vendor unsuspended successfully!")
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to unsuspend vendor")
    }
  }

  const handleEditVendor = async () => {
    try {
      const response = await axios.put(`/admin/vendors/${selectedVendor._id}`, editFormData)
      if (response.data.success) {
        setVendors(
          vendors.map((v) =>
            v._id === selectedVendor._id
              ? { ...v, ...response.data.vendor }
              : v
          )
        )
        setShowModal(false)
        setSelectedVendor(null)
        setEditFormData({
          businessName: "",
          businessPhone: "",
          businessEmail: "",
          storeName: "",
          businessCategory: "",
          commissionRate: ""
        })
        alert("Vendor updated successfully!")
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update vendor")
    }
  }

  const openModal = (vendor, type) => {
    setSelectedVendor(vendor)
    setActionType(type)
    
    // Pre-fill form data for edit mode
    if (type === "edit") {
      setEditFormData({
        businessName: vendor.businessName || "",
        businessPhone: vendor.businessPhone || "",
        businessEmail: vendor.businessEmail || "",
        storeName: vendor.storeName || "",
        businessCategory: vendor.businessCategory || "",
        commissionRate: vendor.commissionRate || ""
      })
    }
    
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedVendor(null)
    setRejectionReason("")
    setSuspensionReason("")
    setActionType("")
    setEditFormData({
      businessName: "",
      businessPhone: "",
      businessEmail: "",
      storeName: "",
      businessCategory: "",
      commissionRate: ""
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-h-screen px-4 py-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Vendor Management</h1>
          <p className="text-slate-600 mt-2">Verify and manage vendors on the platform</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          {["all", "pending", "verified", "suspended"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-blue-600"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Vendors Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Store Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Owner
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-600">
                    No vendors found
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr key={vendor._id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {vendor.storeName || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {vendor.firstName} {vendor.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{vendor.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          vendor.verificationStatus === "verified"
                            ? "bg-green-100 text-green-800"
                            : vendor.verificationStatus === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : vendor.verificationStatus === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        } ${vendor.isSuspended ? "opacity-50 line-through" : ""}`}
                      >
                        {vendor.isSuspended ? "SUSPENDED" : vendor.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        {vendor.verificationStatus === "pending" && !vendor.isSuspended && (
                          <>
                            <button
                              onClick={() => openModal(vendor, "verify")}
                              className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => openModal(vendor, "reject")}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openModal(vendor, "edit")}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        {vendor.isSuspended ? (
                          <button
                            onClick={() => openModal(vendor, "unsuspend")}
                            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                          >
                            Unsuspend
                          </button>
                        ) : (
                          <button
                            onClick={() => openModal(vendor, "suspend")}
                            className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedVendor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {actionType === "verify" && "Verify Vendor"}
              {actionType === "reject" && "Reject Vendor"}
              {actionType === "suspend" && "Suspend Vendor"}
              {actionType === "unsuspend" && "Unsuspend Vendor"}
              {actionType === "edit" && "Edit Vendor"}
            </h2>

            <p className="text-slate-600 mb-4">
              {selectedVendor.firstName} {selectedVendor.lastName} (
              {selectedVendor.storeName})
            </p>

            {actionType === "edit" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      value={editFormData.businessName}
                      onChange={(e) => setEditFormData({ ...editFormData, businessName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.storeName}
                      onChange={(e) => setEditFormData({ ...editFormData, storeName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Business Phone *
                    </label>
                    <input
                      type="tel"
                      value={editFormData.businessPhone}
                      onChange={(e) => setEditFormData({ ...editFormData, businessPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Business Email
                    </label>
                    <input
                      type="email"
                      value={editFormData.businessEmail}
                      onChange={(e) => setEditFormData({ ...editFormData, businessEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Business Category
                    </label>
                    <select
                      value={editFormData.businessCategory}
                      onChange={(e) => setEditFormData({ ...editFormData, businessCategory: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">Select Category</option>
                      <option value="electronics">Electronics</option>
                      <option value="fashion">Fashion</option>
                      <option value="home">Home</option>
                      <option value="beauty">Beauty</option>
                      <option value="sports">Sports</option>
                      <option value="books">Books</option>
                      <option value="food">Food</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Commission (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={editFormData.commissionRate}
                      onChange={(e) => setEditFormData({ ...editFormData, commissionRate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>
            ) : (
              (actionType === "reject" || actionType === "suspend") && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {actionType === "reject" ? "Rejection Reason" : "Suspension Reason"}
                  </label>
                  <textarea
                    value={actionType === "reject" ? rejectionReason : suspensionReason}
                    onChange={(e) =>
                      actionType === "reject"
                        ? setRejectionReason(e.target.value)
                        : setSuspensionReason(e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    rows="3"
                    placeholder="Enter reason..."
                  />
                </div>
              )
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={
                  actionType === "verify"
                    ? handleVerifyVendor
                    : actionType === "reject"
                    ? handleRejectVendor
                    : actionType === "suspend"
                    ? handleSuspendVendor
                    : actionType === "unsuspend"
                    ? handleUnsuspendVendor
                    : handleEditVendor
                }
                className={`flex-1 px-4 py-2 text-white rounded-lg transition ${
                  actionType === "verify"
                    ? "bg-green-600 hover:bg-green-700"
                    : actionType === "reject"
                    ? "bg-red-600 hover:bg-red-700"
                    : actionType === "suspend"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : actionType === "unsuspend"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {actionType === "verify" && "Verify"}
                {actionType === "reject" && "Reject"}
                {actionType === "suspend" && "Suspend"}
                {actionType === "unsuspend" && "Unsuspend"}
                {actionType === "edit" && "Update Vendor"}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default VendorManagement
