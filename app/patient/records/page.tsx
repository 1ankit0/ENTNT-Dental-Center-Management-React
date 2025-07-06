"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useData } from "@/contexts/DataContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Mail, Heart, Calendar } from "lucide-react"
import { format, differenceInYears } from "date-fns"

export default function PatientRecords() {
  const { user } = useAuth()
  const { patients, incidents } = useData()

  const patient = patients.find((p) => p.id === user?.patientId)
  const patientIncidents = incidents.filter((i) => i.patientId === user?.patientId)
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

  const age = differenceInYears(new Date(), new Date(patient.dob))

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
        <p className="text-gray-600">Your personal information and treatment history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Full Name</p>
                <p className="text-sm text-gray-900">{patient.name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Date of Birth</p>
                <p className="text-sm text-gray-900">
                  {format(new Date(patient.dob), "MMM dd, yyyy")} ({age} years old)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-sm text-gray-900">{patient.contact}</p>
                </div>
              </div>

              {patient.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-900">{patient.email}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-2">
                <Heart className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Health Information</p>
                  <p className="text-sm text-gray-900">{patient.healthInfo}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Treatment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Appointments</span>
                <Badge variant="outline">{patientIncidents.length}</Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Completed Treatments</span>
                <Badge variant="secondary">{completedTreatments.length}</Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Spent</span>
                <span className="text-sm font-semibold text-green-600">${totalSpent}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Treatment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patientIncidents.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No treatment history available.</p>
                ) : (
                  patientIncidents
                    .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
                    .map((incident) => (
                      <div key={incident.id} className="border-l-4 border-blue-200 pl-4 py-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{incident.title}</h4>
                            <p className="text-sm text-gray-600">
                              {format(new Date(incident.appointmentDate), "MMM dd, yyyy")}
                            </p>
                          </div>
                          <Badge
                            className={
                              incident.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : incident.status === "Scheduled"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {incident.status}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-700 mb-2">{incident.description}</p>

                        {incident.treatment && (
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Treatment:</span> {incident.treatment}
                          </p>
                        )}

                        {incident.cost && (
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Cost:</span> ${incident.cost}
                          </p>
                        )}

                        {incident.comments && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Notes:</span> {incident.comments}
                          </p>
                        )}

                        {incident.nextDate && (
                          <p className="text-sm text-blue-600 mt-2">
                            <span className="font-medium">Next Appointment:</span>{" "}
                            {format(new Date(incident.nextDate), "MMM dd, yyyy - HH:mm")}
                          </p>
                        )}
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
