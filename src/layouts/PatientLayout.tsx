import { Outlet } from "react-router-dom"
import PatientSidebar from "../components/PatientSidebar"

export default function PatientLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <PatientSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
