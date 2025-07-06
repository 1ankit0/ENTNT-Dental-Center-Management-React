import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { DataProvider } from "./contexts/DataContext"
import { Toaster } from "./components/ui/toaster"
import LoginPage from "./pages/LoginPage"
import AdminLayout from "./layouts/AdminLayout"
import PatientLayout from "./layouts/PatientLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminPatients from "./pages/admin/AdminPatients"
import AdminAppointments from "./pages/admin/AdminAppointments"
import AdminCalendar from "./pages/admin/AdminCalendar"
import PatientDashboard from "./pages/patient/PatientDashboard"
import PatientAppointments from "./pages/patient/PatientAppointments"
import PatientRecords from "./pages/patient/PatientRecords"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="Admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="patients" element={<AdminPatients />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="calendar" element={<AdminCalendar />} />
          </Route>

          {/* Patient Routes */}
          <Route
            path="/patient"
            element={
              <ProtectedRoute requiredRole="Patient">
                <PatientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/patient/dashboard" replace />} />
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="records" element={<PatientRecords />} />
          </Route>

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster />
      </DataProvider>
    </AuthProvider>
  )
}

export default App
