import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "../../api/axios"
import { useAuth } from "../../context/AuthContext"

function VendorRegister() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",

    // Business Information
    businessName: "",
    businessType: "",
    businessPhone: "",
    businessEmail: "",
    businessDescription: "",
    businessCategory: "",

    // Business Address
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",

    // Tax Information
    gstNumber: "",
    panNumber: "",

    // Bank Details
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    accountType: "current",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
  }

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill all required fields")
      return false
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.businessName || !formData.businessType || !formData.businessPhone) {
      setError("Please fill all required business fields")
      return false
    }
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(formData.businessPhone.replace(/\s/g, ""))) {
      setError("Please enter a valid 10-digit phone number")
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!formData.street || !formData.city || !formData.state || !formData.postalCode) {
      setError("Please fill all address fields")
      return false
    }
    if (!formData.panNumber) {
      setError("PAN number is required")
      return false
    }
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    if (!panRegex.test(formData.panNumber)) {
      setError("Please enter a valid PAN number (e.g., ABCDE1234F)")
      return false
    }
    if (formData.gstNumber) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
      if (!gstRegex.test(formData.gstNumber)) {
        setError("Please enter a valid GST number")
        return false
      }
    }
    return true
  }

  const validateStep4 = () => {
    if (!formData.accountHolderName || !formData.accountNumber || !formData.ifscCode) {
      setError("Please fill all bank details")
      return false
    }
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      setError("Account numbers do not match")
      return false
    }
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/
    if (!ifscRegex.test(formData.ifscCode)) {
      setError("Please enter a valid IFSC code (e.g., SBIN0001234)")
      return false
    }
    return true
  }

  const handleNext = () => {
    setError("")
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
    } else if (currentStep === 3 && validateStep3()) {
      setCurrentStep(4)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep4()) return

    setLoading(true)
    setError("")

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessPhone: formData.businessPhone,
        businessAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        gstNumber: formData.gstNumber,
        panNumber: formData.panNumber,
        bankDetails: {
          accountHolderName: formData.accountHolderName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          bankName: formData.bankName,
          branchName: formData.branchName,
          accountType: formData.accountType,
        },
      }

      const response = await axios.post("/auth/vendor/signup", payload)

      if (response.data.success) {
        login(response.data.token, response.data.user)
        navigate("/vendor/dashboard")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="10-digit mobile number"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
          required
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Business Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          placeholder="Your shop/business name"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Business Type <span className="text-red-500">*</span>
        </label>
        <select
          name="businessType"
          value={formData.businessType}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
          required
        >
          <option value="">Select business type</option>
          <option value="individual">Individual</option>
          <option value="proprietorship">Proprietorship</option>
          <option value="partnership">Partnership</option>
          <option value="private_limited">Private Limited</option>
          <option value="public_limited">Public Limited</option>
          <option value="llp">LLP</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Business Category
        </label>
        <select
          name="businessCategory"
          value={formData.businessCategory}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
        >
          <option value="">Select category</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="home">Home & Living</option>
          <option value="beauty">Beauty & Personal Care</option>
          <option value="sports">Sports & Fitness</option>
          <option value="books">Books & Media</option>
          <option value="food">Food & Beverages</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Business Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="businessPhone"
          value={formData.businessPhone}
          onChange={handleChange}
          placeholder="10-digit business contact number"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Business Email
        </label>
        <input
          type="email"
          name="businessEmail"
          value={formData.businessEmail}
          onChange={handleChange}
          placeholder="Optional business email"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Business Description
        </label>
        <textarea
          name="businessDescription"
          value={formData.businessDescription}
          onChange={handleChange}
          rows="3"
          placeholder="Tell us about your business"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Business Address & Tax Details</h3>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Street Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="border-t pt-4 mt-6">
        <h4 className="text-md font-semibold text-slate-900 mb-4">Tax Information</h4>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            PAN Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
            placeholder="ABCDE1234F"
            maxLength="10"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent uppercase"
            required
          />
          <p className="text-xs text-slate-500 mt-1">10-character alphanumeric code</p>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            GST Number (Optional)
          </label>
          <input
            type="text"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            placeholder="22AAAAA0000A1Z5"
            maxLength="15"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent uppercase"
          />
          <p className="text-xs text-slate-500 mt-1">15-character alphanumeric code (if registered)</p>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Bank Account Details</h3>
      <p className="text-sm text-slate-600">For receiving payments from your sales</p>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Account Holder Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="accountHolderName"
          value={formData.accountHolderName}
          onChange={handleChange}
          placeholder="As per bank records"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Account Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Confirm Account Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="confirmAccountNumber"
          value={formData.confirmAccountNumber}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          IFSC Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="ifscCode"
          value={formData.ifscCode}
          onChange={handleChange}
          placeholder="SBIN0001234"
          maxLength="11"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent uppercase"
          required
        />
        <p className="text-xs text-slate-500 mt-1">11-character bank code</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Bank Name
          </label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            placeholder="e.g., State Bank of India"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Branch Name
          </label>
          <input
            type="text"
            name="branchName"
            value={formData.branchName}
            onChange={handleChange}
            placeholder="e.g., Mumbai Main"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Account Type <span className="text-red-500">*</span>
        </label>
        <select
          name="accountType"
          value={formData.accountType}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
          required
        >
          <option value="current">Current Account</option>
          <option value="savings">Savings Account</option>
        </select>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Become a Vendor</h1>
          <p className="text-slate-600">Start selling on ShopEz today</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                  currentStep >= step ? "bg-[#1f5fbf] text-white" : "bg-slate-200 text-slate-600"
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? "bg-[#1f5fbf]" : "bg-slate-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-600">Personal</span>
            <span className="text-xs text-slate-600">Business</span>
            <span className="text-xs text-slate-600">Address & Tax</span>
            <span className="text-xs text-slate-600">Bank Details</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                  >
                    Back
                  </button>
                )}
              </div>

              <div>
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-2 bg-[#1f5fbf] text-white rounded-lg hover:bg-[#1a4da0] transition"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-2 bg-[#1f5fbf] text-white rounded-lg hover:bg-[#1a4da0] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating Account..." : "Submit & Register"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-slate-600">
            Already have a vendor account?{" "}
            <Link to="/vendor/login" className="text-[#1f5fbf] hover:underline font-semibold">
              Login here
            </Link>
          </p>
          <p className="text-slate-600 mt-2">
            Want to shop instead?{" "}
            <Link to="/register" className="text-[#1f5fbf] hover:underline font-semibold">
              Customer Registration
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default VendorRegister
