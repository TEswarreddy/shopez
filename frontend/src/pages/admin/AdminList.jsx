import { useState, useEffect } from "react"
import axios from "../../api/axios"
import AdminSidebar from "../../components/AdminSidebar"

function AdminList() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    adminLevel: "admin",
  })
  const [editFormData, setEditFormData] = useState({
    adminLevel: "admin",
  })
  const [permissions, setPermissions] = useState({
    canManageUsers: false,
    canManageVendors: false,
    canVerifyVendors: false,
    canManageProducts: false,
    canDeleteProducts: false,
    canFeatureProducts: false,
    canManageOrders: false,
    canSuspendVendors: false,
    canSuspendUsers: false,
    canDeleteVendors: false,
    canViewFinancials: false,
  })
  const [editPermissions, setEditPermissions] = useState({
    canManageUsers: false,
    canManageVendors: false,
    canVerifyVendors: false,
    canManageProducts: false,
    canDeleteProducts: false,
    canFeatureProducts: false,
    canManageOrders: false,
    canSuspendVendors: false,
    canSuspendUsers: false,
    canDeleteVendors: false,
    canViewFinancials: false,
  })

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      const response = await axios.get("/admin/admins")
      if (response.data.success) {
        setAdmins(response.data.admins)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admins")
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handlePermissionChange = (permission) => {
    setPermissions({ ...permissions, [permission]: !permissions[permission] })
  }

  const handleEditPermissionChange = (permission) => {
    setEditPermissions({ ...editPermissions, [permission]: !editPermissions[permission] })
  }

  const openEditModal = (admin) => {
    setSelectedAdmin(admin)
    setEditFormData({
      adminLevel: admin.adminLevel,
    })
    
    // Set permissions from admin object
    const adminPermissions = {
      canManageUsers: admin.permissions?.canManageUsers || false,
      canManageVendors: admin.permissions?.canManageVendors || false,
      canVerifyVendors: admin.permissions?.canVerifyVendors || false,
      canManageProducts: admin.permissions?.canManageProducts || false,
      canDeleteProducts: admin.permissions?.canDeleteProducts || false,
      canFeatureProducts: admin.permissions?.canFeatureProducts || false,
      canManageOrders: admin.permissions?.canManageOrders || false,
      canSuspendVendors: admin.permissions?.canSuspendVendors || false,
      canSuspendUsers: admin.permissions?.canSuspendUsers || false,
      canDeleteVendors: admin.permissions?.canDeleteVendors || false,
      canViewFinancials: admin.permissions?.canViewFinancials || false,
    }
    setEditPermissions(adminPermissions)
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setSelectedAdmin(null)
    setEditFormData({ adminLevel: "admin" })
    setEditPermissions({
      canManageUsers: false,
      canManageVendors: false,
      canVerifyVendors: false,
      canManageProducts: false,
      canDeleteProducts: false,
      canFeatureProducts: false,
      canManageOrders: false,
      canSuspendVendors: false,
      canSuspendUsers: false,
      canDeleteVendors: false,
      canViewFinancials: false,
    })
  }

  const handleUpdateAdmin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(`/admin/admins/${selectedAdmin._id}`, {
        adminLevel: editFormData.adminLevel,
        permissions: editPermissions,
      })
      if (response.data.success) {
        setAdmins(admins.map(a => 
          a._id === selectedAdmin._id ? response.data.admin : a
        ))
        closeEditModal()
        alert("Admin updated successfully!")
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update admin")
    }
  }

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("/admin/admins", {
        ...formData,
        permissions,
      })
      if (response.data.success) {
        setAdmins([...admins, response.data.admin])
        setFormData({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          adminLevel: "admin",
        })
        setPermissions({
          canManageUsers: false,
          canManageVendors: false,
          canVerifyVendors: false,
          canManageProducts: false,
          canDeleteProducts: false,
          canFeatureProducts: false,
          canManageOrders: false,
          canSuspendVendors: false,
          canSuspendUsers: false,
          canDeleteVendors: false,
          canViewFinancials: false,
        })
        setShowCreateForm(false)
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create admin")
    }
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
    <div className="min-h-screen px-4 py-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Management</h1>
          <p className="text-slate-600 mt-2">Create and manage admin accounts (Super Admin Only)</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {showCreateForm ? "Cancel" : "Create New Admin"}
          </button>
        </div>

        {/* Create Admin Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Admin</h2>
            <form onSubmit={handleCreateAdmin} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Admin Level
                </label>
                <select
                  name="adminLevel"
                  value={formData.adminLevel}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="support">Support</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-4">
                  Permissions
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(permissions).map((permission) => (
                    <label key={permission} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={permissions[permission]}
                        onChange={() => handlePermissionChange(permission)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-sm text-slate-700">
                        {permission
                          .replace(/^can/, "")
                          .replace(/([A-Z])/g, " $1")
                          .trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create Admin
              </button>
            </form>
          </div>
        )}

        {/* Admins List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Level
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Created At
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-600">
                    No admins found
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin._id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {admin.firstName} {admin.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{admin.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          admin.adminLevel === "super_admin"
                            ? "bg-red-100 text-red-800"
                            : admin.adminLevel === "admin"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {admin.adminLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => openEditModal(admin)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}

        {/* Edit Admin Modal */}
        {showEditModal && selectedAdmin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Edit Admin</h2>
              
              <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">
                  <strong>Name:</strong> {selectedAdmin.firstName} {selectedAdmin.lastName}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Email:</strong> {selectedAdmin.email}
                </p>
              </div>

              <form onSubmit={handleUpdateAdmin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Admin Level
                  </label>
                  <select
                    value={editFormData.adminLevel}
                    onChange={(e) => setEditFormData({ ...editFormData, adminLevel: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="support">Support</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    Permissions
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.keys(editPermissions).map((permission) => (
                      <label key={permission} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={editPermissions[permission]}
                          onChange={() => handleEditPermissionChange(permission)}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-sm text-slate-700">
                          {permission
                            .replace(/^can/, "")
                            .replace(/([A-Z])/g, " $1")
                            .trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Update Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  )
}

export default AdminList
