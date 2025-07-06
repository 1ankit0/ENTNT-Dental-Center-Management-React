"use client"

import { useAuth } from "../contexts/AuthContext"
import { Button } from "./ui/button"
import { LayoutDashboard, Users, Calendar, LogOut, SmileIcon as Tooth } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "../lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Patients", href: "/admin/patients", icon: Users },
  { name: "Appointments", href: "/admin/appointments", icon: Calendar },
  { name: "Calendar", href: "/admin/calendar", icon: Calendar },
]

export default function AdminSidebar() {
  const { logout } = useAuth()
  const location = useLocation()

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Tooth className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Dental Center</h1>
        </div>
      </div>

      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1",
                  isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <item.icon
                  className={cn("mr-3 h-5 w-5", isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500")}
                />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="absolute bottom-0 w-64 p-4">
        <Button onClick={logout} variant="outline" className="w-full justify-start bg-transparent">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
