"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { mockDB } from "@/lib/mockDatabase"

interface User {
  id: string
  role: "Admin" | "Patient"
  email: string
  patientId?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticating: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem("dental_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("dental_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsAuthenticating(true)

    try {
      const authenticatedUser = await mockDB.authenticateUser(email, password)

      if (authenticatedUser) {
        setUser(authenticatedUser)
        localStorage.setItem("dental_user", JSON.stringify(authenticatedUser))
        return true
      }

      return false
    } catch (error) {
      console.error("Authentication error:", error)
      return false
    } finally {
      setIsAuthenticating(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("dental_user")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAuthenticating }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
