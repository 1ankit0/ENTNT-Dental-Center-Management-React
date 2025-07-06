"use client"

import { useState } from "react"
import { useData } from "../../contexts/DataContext"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Plus, Search, Edit, Trash2, Eye, FileText, DollarSign, Calendar } from "lucide-react"
import AppointmentDialog from "../../components/AppointmentDialog"
import { useToast } from "../../hooks/use-toast"
import { format } from "date-fns"

export default function AdminAppointments() {
  const { incidents, patients, deleteIncident } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | "view">("add")
  const { toast } = useToast()

  const filteredIncidents = incidents.filter((incident) => {
    const patient = patients.find((p) => p.id === incident.patientId)
    return (
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleAddAppointment = () => {
    setSelectedIncident(null)
    setDialogMode("add")
    setIsDialogOpen(true)
  }

  const handleEditAppointment = (incident: any) => {
    setSelectedIncident(incident)
    setDialogMode("edit")
    setIsDialogOpen(true)
  }

  const handleViewAppointment = (incident: any) => {
    setSelectedIncident(incident)
    setDialogMode("view")
    setIsDialogOpen(true)
  }

  const handleDeleteAppointment = async (incident: any) => {
    if (confirm(`Are you sure you want to delete this appointment: ${incident.title}?`)) {
      const success = await deleteIncident(incident.id)
      if (success) {
        toast({
          title: "Appointment deleted",
          description: "The appointment has been removed from the system.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete appointment. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments & Incidents</h1>
          <p className="text-gray-600">Manage patient appointments and treatment records</p>
        </div>
        <Button onClick={handleAddAppointment} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search appointments by title, description, or patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredIncidents.map((incident) => {
          const patient = patients.find((p) => p.id === incident.patientId)

          return (
            <Card key={incident.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-lg">{incident.title}</CardTitle>
                      <Badge className={getStatusColor(incident.status)}>{incident.status}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(incident.appointmentDate), "MMM dd, yyyy - HH:mm")}
                      </span>
                      <span>Patient: {patient?.name}</span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleViewAppointment(incident)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditAppointment(incident)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAppointment(incident)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-4">
                      {incident.cost && (
                        <div className="flex items-center text-sm">
                          <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                          <span className="font-semibold text-green-600">${incident.cost}</span>
                        </div>
                      )}

                      {incident.files.length > 0 && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FileText className="h-4 w-4 mr-1" />
                          <span>{incident.files.length} file(s) attached</span>
                        </div>
                      )}
                    </div>

                    {incident.nextDate && (
                      <div className="text-sm text-blue-600">
                        <span className="font-medium">Next: </span>
                        {format(new Date(incident.nextDate), "MMM dd, yyyy")}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredIncidents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">No appointments found matching your search.</p>
          <Button onClick={handleAddAppointment} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Create First Appointment
          </Button>
        </div>
      )}

      <AppointmentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        incident={selectedIncident}
        mode={dialogMode}
      />
    </div>
  )
}
