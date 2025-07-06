"use client"

import { useAuth } from "../../contexts/AuthContext"
import { useData } from "../../contexts/DataContext"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Search, FileText, Download } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"

export default function PatientAppointments() {
  const { user } = useAuth()
  const { incidents } = useData()
  const [searchTerm, setSearchTerm] = useState("")

  const patientIncidents = incidents
    .filter((i) => i.patientId === user?.patientId)
    .filter(
      (incident) =>
        incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-600">View your appointment history and upcoming visits</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {patientIncidents.map((incident) => (
          <Card key={incident.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{incident.title}</CardTitle>
                  <p className="text-sm text-gray-600">
                    {format(new Date(incident.appointmentDate), "MMM dd, yyyy - HH:mm")}
                  </p>
                </div>
                <Badge className={getStatusColor(incident.status)}>{incident.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Description:</p>
                  <p className="text-sm text-gray-600">{incident.description}</p>
                </div>

                {incident.comments && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Comments:</p>
                    <p className="text-sm text-gray-600">{incident.comments}</p>
                  </div>
                )}

                {incident.treatment && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Treatment Provided:</p>
                    <p className="text-sm text-gray-600">{incident.treatment}</p>
                  </div>
                )}

                {incident.cost && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Cost:</p>
                    <p className="text-sm font-semibold text-green-600">${incident.cost}</p>
                  </div>
                )}

                {incident.nextDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Next Appointment:</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(incident.nextDate), "MMM dd, yyyy - HH:mm")}
                    </p>
                  </div>
                )}

                {incident.files.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                    <div className="space-y-2">
                      {incident.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <a
                            href={file.url}
                            download={file.name}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {patientIncidents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No appointments found.</p>
        </div>
      )}
    </div>
  )
}
