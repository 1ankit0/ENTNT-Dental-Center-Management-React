"use client"

import { useData } from "@/contexts/DataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, Clock, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import DataPersistenceStatus from "@/components/DataPersistenceStatus"

export default function AdminDashboard() {
  const { patients, incidents } = useData()

  const now = new Date()

  // Get upcoming appointments (future dates only)
  const upcomingAppointments = incidents
    .filter((i) => i.status === "Scheduled" && new Date(i.appointmentDate) > now)
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
    .slice(0, 10) // Ensure exactly 10 appointments

  const completedTreatments = incidents.filter((i) => i.status === "Completed")
  const pendingTreatments = incidents.filter((i) => i.status === "Scheduled")
  const totalRevenue = completedTreatments.reduce((sum, i) => sum + (i.cost || 0), 0)

  const topPatients = patients
    .map((patient) => ({
      ...patient,
      appointmentCount: incidents.filter((i) => i.patientId === patient.id).length,
      totalSpent: incidents
        .filter((i) => i.patientId === patient.id && i.cost)
        .reduce((sum, i) => sum + (i.cost || 0), 0),
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5)

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your dental practice overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTreatments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Treatments</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTreatments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments - Show exactly 10 */}
        <Card>
          <CardHeader>
            <CardTitle>Next 10 Appointments</CardTitle>
            <CardDescription>
              Upcoming scheduled treatments ({upcomingAppointments.length} appointments)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {upcomingAppointments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
              ) : (
                upcomingAppointments.map((appointment, index) => {
                  const patient = patients.find((p) => p.id === appointment.patientId)
                  return (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                            #{index + 1}
                          </span>
                          <p className="font-medium text-gray-900">{patient?.name}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{appointment.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(appointment.appointmentDate), "MMM dd, yyyy - HH:mm")}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {appointment.status}
                      </Badge>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Patients */}
        <Card>
          <CardHeader>
            <CardTitle>Top Patients</CardTitle>
            <CardDescription>Patients by total spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPatients.map((patient, index) => (
                <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.appointmentCount} appointments</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${patient.totalSpent}</p>
                    <p className="text-xs text-gray-500">#{index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Persistence Status */}
      <div className="mt-8">
        <DataPersistenceStatus />
      </div>
    </div>
  )
}
