import { useState, useEffect } from "react"
import axios from "../../api/axios"
import AdminSidebar from "../../components/AdminSidebar"

function CustomerManagement() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [actionType, setActionType] = useState("") // suspend, unsuspend
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchCustomers()
  }, [search, page])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/admin/customers`, {
        params: { search, page, limit: 10 },
      })
      if (response.data.success) {
        setCustomers(response.data.customers)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load customers")
    } finally {
      setLoading(false)
    }
  }

  const handleSuspendCustomer = async () => {
    try {
      const response = await axios.put(`/admin/customers/${selectedCustomer._id}/suspend`, {
        reason: "Suspended by admin",
      })
      if (response.data.success) {
        setCustomers(
          customers.map((c) =>
            c._id === selectedCustomer._id
              ? { ...c, isActive: false }
              : c
          )
        )
        closeActionModal()
        alert("Customer suspended successfully!")
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to suspend customer")
    }
  }

  const handleUnsuspendCustomer = async () => {
    try {
      const response = await axios.put(`/admin/customers/${selectedCustomer._id}/unsuspend`)
      if (response.data.success) {
        setCustomers(
          customers.map((c) =>
            c._id === selectedCustomer._id
              ? { ...c, isActive: true }
              : c
          )
        )
        closeActionModal()
        alert("Customer unsuspended successfully!")
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to unsuspend customer")
    }
  }

  const openDetailsModal = async (customer) => {
    try {
      const response = await axios.get(`/admin/customers/${customer._id}`)
      if (response.data.success) {
        setSelectedCustomerDetails(response.data)
        setShowDetailsModal(true)
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load customer details")
    }
  }

  const openActionModal = (customer, type) => {
    setSelectedCustomer(customer)
    setActionType(type)
    setShowActionModal(true)
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedCustomerDetails(null)
  }

  const closeActionModal = () => {
    setShowActionModal(false)
    setSelectedCustomer(null)
    setActionType("")
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
          <h1 className="text-3xl font-bold text-slate-900">Customer Management</h1>
          <p className="text-slate-600 mt-2">View and manage customers on the platform</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        {/* Customers Table */}
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
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-600">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer._id}
                    className={`border-b border-slate-200 hover:bg-slate-50 ${
                      !customer.isActive ? "opacity-60" : ""
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {customer.firstName} {customer.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{customer.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {customer.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          customer.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {customer.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openDetailsModal(customer)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details
                        </button>
                        {customer.isActive ? (
                          <button
                            onClick={() => openActionModal(customer, "suspend")}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => openActionModal(customer, "unsuspend")}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Unsuspend
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

      {/* Details Modal */}
      {showDetailsModal && selectedCustomerDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Customer Details</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">First Name</p>
                  <p className="text-lg font-medium text-slate-900">
                    {selectedCustomerDetails.customer.firstName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Last Name</p>
                  <p className="text-lg font-medium text-slate-900">
                    {selectedCustomerDetails.customer.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="text-lg font-medium text-slate-900">{selectedCustomerDetails.customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Phone</p>
                  <p className="text-lg font-medium text-slate-900">
                    {selectedCustomerDetails.customer.phone || "N/A"}
                  </p>
                </div>
              </div>

              {selectedCustomerDetails.recentOrders && selectedCustomerDetails.recentOrders.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Recent Orders</h3>
                  <div className="space-y-2">
                    {selectedCustomerDetails.recentOrders.map((order) => (
                      <div key={order._id} className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-sm font-medium text-slate-900">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-xs text-slate-600">
                          ₹{order.totalAmount} - {order.status}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={closeDetailsModal}
              className="w-full mt-6 px-4 py-2 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {actionType === "suspend" ? "Suspend Customer" : "Unsuspend Customer"}
            </h2>

            <p className="text-slate-600 mb-6">
              {selectedCustomer.firstName} {selectedCustomer.lastName} (
              {selectedCustomer.email})
            </p>

            {actionType === "suspend" && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                This customer's account will be suspended and they won't be able to access their
                account.
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={closeActionModal}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={
                  actionType === "suspend"
                    ? handleSuspendCustomer
                    : handleUnsuspendCustomer
                }
                className={`flex-1 px-4 py-2 text-white rounded-lg transition ${
                  actionType === "suspend"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {actionType === "suspend" ? "Suspend" : "Unsuspend"}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default CustomerManagement
