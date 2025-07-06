"use client"

import { useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import LoginForm from "../components/LoginForm"

export default function LoginPage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "Admin") {
        navigate("/admin/dashboard", { replace: true })
      } else {
        navigate("/patient/dashboard", { replace: true })
      }
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    return null 
  }

  return <LoginForm />
}
