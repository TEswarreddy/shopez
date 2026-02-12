import axios from "axios"

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - token expired or invalid
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      
      // Redirect based on current path
      const currentPath = window.location.pathname
      if (currentPath.startsWith("/admin")) {
        window.location.href = "/admin/login"
      } else if (currentPath.startsWith("/vendor")) {
        window.location.href = "/vendor/login"
      } else {
        window.location.href = "/login"
      }
    } else if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.error("Access forbidden:", error.response?.data?.message)
      // Don't automatically redirect on 403, let components handle it
    }
    return Promise.reject(error)
  }
)

export default apiClient
