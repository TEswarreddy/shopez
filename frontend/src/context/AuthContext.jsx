import { createContext, useContext, useMemo, useState } from "react"

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const storedUser = localStorage.getItem("user")
        return storedUser ? JSON.parse(storedUser) : null
      } catch (err) {
        console.error("Failed to load user", err)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        return null
      }
    }
    return null
  })

  const value = useMemo(() => ({ user, setUser }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
