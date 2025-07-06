"use client"

import { useAuth } from "../../contexts/AuthContext"
import { useData } from "../../contexts/DataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Calendar, DollarSign, Clock, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { CalendarIcon } from "@radix-ui/react-icons"

export default function PatientDashboard() {
  const { user } = useAuth()
  const { patients, incidents } = useData()

  const patient = patients.find((p) => p.id === user?.patientId)
  const patientIncidents = incidents.filter((i) => i.patientId === user?.patientId)

  const now = new Date()

  // Get upcoming appointments (future dates only) - limit to 2
  const upcomingAppointments = patientIncidents
    .filter((i) => i.status === "Scheduled" && new Date(i.appointmentDate) > now)
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
    .slice(0, 2) // Show exactly 1-2 upcoming appointments

  const completedTreatments = patientIncidents.filter((i) => i.status === "Completed")
  const totalSpent = completedTreatments.reduce((sum, i) => sum + (i.cost || 0), 0)

  if (!patient) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Patient information not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {patient.name}</h1>
        <p className="text-gray-600">Your dental health overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
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
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientIncidents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Your Next Appointments</CardTitle>
            <CardDescription>
              {upcomingAppointments.length === 0
                ? "No upcoming appointments scheduled"
                : `${upcomingAppointments.length} upcoming appointment${upcomingAppointments.length > 1 ? "s" : ""}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500">No upcoming appointments</p>
                  <p className="text-sm text-gray-400 mt-1">Contact us to schedule your next visit</p>
                </div>
              ) : (
                upcomingAppointments.map((appointment, index) => (
                  <div
                    key={appointment.id}
                    className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-medium">
                            Next {index === 0 ? "" : index + 1}
                          </span>
                          <p className="font-semibold text-gray-900">{appointment.title}</p>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{appointment.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-600">
                          <span className="flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {format(new Date(appointment.appointmentDate), "MMM dd, yyyy")}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {format(new Date(appointment.appointmentDate), "HH:mm")}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-white">
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Treatments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Treatments</CardTitle>
            <CardDescription>Your completed treatments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedTreatments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No completed treatments</p>
              ) : (
                completedTreatments
                  .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
                  .slice(0, 5)
                  .map((treatment) => (
                    <div key={treatment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{treatment.title}</p>
                        <p className="text-sm text-gray-600">{treatment.treatment}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(treatment.appointmentDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">Completed</Badge>
                        {treatment.cost && <p className="text-sm font-medium text-green-600 mt-1">${treatment.cost}</p>}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
