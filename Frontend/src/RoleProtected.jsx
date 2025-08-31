// src/RoleProtected.jsx
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

export default function RoleProtected({ children, roles = [], requireVerified = false }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="p-6">Checking session…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (roles.length && !roles.includes(user.role)) return <Navigate to="/" replace />
  if (requireVerified && !user.isVerified) return <div className="p-6">Please verify your account to access this page.</div>

  return children
}
