"use client"

import { useState } from "react"
import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import PatientDialog from "@/components/PatientDialog"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

export default function PatientsPage() {
  const { patients, deletePatient, getPatientIncidents } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | "view">("add")
  const { toast } = useToast()

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contact.includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddPatient = () => {
    setSelectedPatient(null)
    setDialogMode("add")
    setIsDialogOpen(true)
  }

  const handleEditPatient = (patient: any) => {
    setSelectedPatient(patient)
    setDialogMode("edit")
    setIsDialogOpen(true)
  }

  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient)
    setDialogMode("view")
    setIsDialogOpen(true)
  }

  const handleDeletePatient = (patient: any) => {
    if (confirm(`Are you sure you want to delete ${patient.name}? This will also delete all their appointments.`)) {
      deletePatient(patient.id)
      toast({
        title: "Patient deleted",
        description: `${patient.name} has been removed from the system.`,
      })
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600">Manage your patient records</p>
        </div>
        <Button onClick={handleAddPatient}>
          <Plus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search patients by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => {
          const incidents = getPatientIncidents(patient.id)
          const upcomingAppointments = incidents.filter((i) => i.status === "Scheduled").length
          const completedTreatments = incidents.filter((i) => i.status === "Completed").length

          return (
            <Card key={patient.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <p className="text-sm text-gray-600">Born: {format(new Date(patient.dob), "MMM dd, yyyy")}</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleViewPatient(patient)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditPatient(patient)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePatient(patient)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span> {patient.contact}
                  </p>
                  {patient.email && (
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> {patient.email}
                    </p>
                  )}
                  <p className="text-sm">
                    <span className="font-medium">Health Info:</span> {patient.healthInfo}
                  </p>

                  <div className="flex space-x-2 mt-4">
                    <Badge variant="outline">{upcomingAppointments} upcoming</Badge>
                    <Badge variant="secondary">{completedTreatments} completed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No patients found matching your search.</p>
        </div>
      )}

      <PatientDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        patient={selectedPatient}
        mode={dialogMode}
      />
    </div>
  )
}
