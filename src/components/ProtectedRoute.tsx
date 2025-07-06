"use client"

import type React from "react"
import { useAuth } from "../contexts/AuthContext"
import { Navigate, useLocation } from "react-router-dom"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "Admin" | "Patient"
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    const redirectPath = user.role === "Admin" ? "/admin/dashboard" : "/patient/dashboard"
    return <Navigate to={redirectPath} replace />
  }

  return <>{children}</>
}
