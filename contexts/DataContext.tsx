"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { mockDB } from "@/lib/mockDatabase"
import { workflowSimulator } from "@/lib/workflowSimulator"

export interface Patient {
  id: string
  name: string
  dob: string
  contact: string
  email?: string
  healthInfo: string
}

export interface FileAttachment {
  name: string
  url: string
  type?: string
  size?: number
  uploadDate?: string
}

export interface Incident {
  id: string
  patientId: string
  title: string
  description: string
  comments: string
  appointmentDate: string
  cost?: number
  treatment?: string
  status: "Scheduled" | "Completed" | "Cancelled"
  nextDate?: string
  files: FileAttachment[]
}

interface DataContextType {
  patients: Patient[]
  incidents: Incident[]
  addPatient: (patient: Omit<Patient, "id">) => Promise<boolean>
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<boolean>
  deletePatient: (id: string) => Promise<boolean>
  addIncident: (incident: Omit<Incident, "id">) => Promise<boolean>
  updateIncident: (id: string, incident: Partial<Incident>) => Promise<boolean>
  deleteIncident: (id: string) => Promise<boolean>
  getPatientIncidents: (patientId: string) => Incident[]
  isLoading: boolean
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const INITIAL_DATA = {
  patients: [
    {
      id: "p1",
      name: "John Doe",
      dob: "1990-05-10",
      contact: "1234567890",
      email: "john@entnt.in",
      healthInfo: "No allergies",
    },
    {
      id: "p2",
      name: "Jane Smith",
      dob: "1985-08-15",
      contact: "0987654321",
      email: "jane@entnt.in",
      healthInfo: "Diabetic, allergic to penicillin",
    },
    {
      id: "p3",
      name: "Mike Johnson",
      dob: "1992-03-22",
      contact: "5551234567",
      email: "mike@entnt.in",
      healthInfo: "High blood pressure",
    },
    {
      id: "p4",
      name: "Sarah Wilson",
      dob: "1988-11-08",
      contact: "5559876543",
      email: "sarah@entnt.in",
      healthInfo: "No known allergies",
    },
    {
      id: "p5",
      name: "David Brown",
      dob: "1995-07-14",
      contact: "5555551234",
      email: "david@entnt.in",
      healthInfo: "Asthmatic",
    },
  ],
  incidents: [
    {
      id: "i1",
      patientId: "p1",
      title: "Toothache",
      description: "Upper molar pain",
      comments: "Sensitive to cold",
      appointmentDate: "2025-01-15T10:00:00",
      cost: 80,
      status: "Completed" as const,
      treatment: "Pain relief medication prescribed, follow-up scheduled",
      files: [
        {
          name: "invoice.pdf",
          url: "data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKERlbnRhbCBJbnZvaWNlKQovQ3JlYXRvciAoRGVudGFsIENlbnRlciBNYW5hZ2VtZW50KQovUHJvZHVjZXIgKERlbnRhbCBTeXN0ZW0pCi9DcmVhdGlvbkRhdGUgKEQ6MjAyNTAxMDEwMDAwMDBaKQo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMyAwIFIKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFs0IDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAzIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjUgMCBvYmoKPDwKL0xlbmd0aCAyMDAKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoxMDAgNzAwIFRkCihEZW50YWwgSW52b2ljZSkgVGoKMTAwIDY1MCBUZAooUGF0aWVudDogSm9obiBEb2UpIFRqCjEwMCA2MDAgVGQKKFRyZWF0bWVudDogVG9vdGhhY2hlIFRyZWF0bWVudCkgVGoKMTAwIDU1MCBUZAooQ29zdDogJDgwLjAwKSBUagoxMDAgNTAwIFRkCihEYXRlOiAyMDI1LTAxLTE1KSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMTU4IDAwMDAwIG4gCjAwMDAwMDAyMDUgMDAwMDAgbiAKMDAwMDAwMDI2MiAwMDAwMCBuIAowMDAwMDAwMzY0IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAyIDAgUgo+PgpzdGFydHhyZWYKNjE0CiUlRU9G",
          type: "application/pdf",
          size: 1024,
          uploadDate: "2025-01-15T10:30:00Z",
        },
        {
          name: "xray.png",
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
          type: "image/png",
          size: 2048,
          uploadDate: "2025-01-15T10:35:00Z",
        },
      ],
    },

    {
      id: "i2",
      patientId: "p1",
      title: "Routine Checkup",
      description: "Regular dental examination and cleaning",
      comments: "Good oral hygiene maintained",
      appointmentDate: "2024-12-15T14:00:00",
      cost: 120,
      status: "Completed" as const,
      treatment: "Professional cleaning, fluoride treatment applied",
      files: [],
    },
    {
      id: "i3",
      patientId: "p1",
      title: "Tooth Filling",
      description: "Cavity treatment on upper molar",
      comments: "Patient reported sensitivity to sweet foods",
      appointmentDate: "2025-02-10T09:30:00",
      status: "Scheduled" as const,
      files: [],
    },
    {
      id: "i4",
      patientId: "p2",
      title: "Root Canal Treatment",
      description: "Root canal therapy for lower molar",
      comments: "Severe pain reported, emergency appointment",
      appointmentDate: "2025-01-20T15:00:00",
      status: "Scheduled" as const,
      files: [],
    },
    {
      id: "i5",
      patientId: "p3",
      title: "Teeth Cleaning",
      description: "Professional dental cleaning and polishing",
      comments: "Regular maintenance appointment",
      appointmentDate: "2025-01-25T13:30:00",
      status: "Scheduled" as const,
      files: [],
    },
  ],
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeData = async () => {
      try {
        const savedPatients = await mockDB.getPatients()
        const savedIncidents = await mockDB.getIncidents()

        if (savedPatients.length > 0) {
          setPatients(savedPatients)
        } else {
          setPatients(INITIAL_DATA.patients)
          await mockDB.savePatients(INITIAL_DATA.patients)
        }

        if (savedIncidents.length > 0) {
          setIncidents(savedIncidents)
        } else {
          setIncidents(INITIAL_DATA.incidents)
          await mockDB.saveIncidents(INITIAL_DATA.incidents)
        }
      } catch (error) {
        console.error("Failed to initialize data:", error)
        setPatients(INITIAL_DATA.patients)
        setIncidents(INITIAL_DATA.incidents)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [])

  const addPatient = async (patient: Omit<Patient, "id">): Promise<boolean> => {
    const workflow = workflowSimulator.createPatientRegistrationWorkflow()

    const success = await workflowSimulator.executeWorkflow(workflow.id)

    if (success) {
      const newPatient = { ...patient, id: `p${Date.now()}` }
      const updatedPatients = [...patients, newPatient]
      setPatients(updatedPatients)
      await mockDB.savePatients(updatedPatients)
      return true
    }

    return false
  }

  const updatePatient = async (id: string, patientUpdate: Partial<Patient>): Promise<boolean> => {
    try {
      const updatedPatients = patients.map((p) => (p.id === id ? { ...p, ...patientUpdate } : p))
      setPatients(updatedPatients)
      return await mockDB.savePatients(updatedPatients)
    } catch (error) {
      console.error("Failed to update patient:", error)
      return false
    }
  }

  const deletePatient = async (id: string): Promise<boolean> => {
    try {
      const updatedPatients = patients.filter((p) => p.id !== id)
      const updatedIncidents = incidents.filter((i) => i.patientId !== id)
      setPatients(updatedPatients)
      setIncidents(updatedIncidents)

      const patientsSuccess = await mockDB.savePatients(updatedPatients)
      const incidentsSuccess = await mockDB.saveIncidents(updatedIncidents)

      return patientsSuccess && incidentsSuccess
    } catch (error) {
      console.error("Failed to delete patient:", error)
      return false
    }
  }

  const addIncident = async (incident: Omit<Incident, "id">): Promise<boolean> => {
    const workflow = workflowSimulator.createAppointmentBookingWorkflow()

    const success = await workflowSimulator.executeWorkflow(workflow.id)

    if (success) {
      const newIncident = { ...incident, id: `i${Date.now()}` }
      const updatedIncidents = [...incidents, newIncident]
      setIncidents(updatedIncidents)
      await mockDB.saveIncidents(updatedIncidents)
      return true
    }

    return false
  }

  const updateIncident = async (id: string, incidentUpdate: Partial<Incident>): Promise<boolean> => {
    try {
      const updatedIncidents = incidents.map((i) => (i.id === id ? { ...i, ...incidentUpdate } : i))
      setIncidents(updatedIncidents)
      return await mockDB.saveIncidents(updatedIncidents)
    } catch (error) {
      console.error("Failed to update incident:", error)
      return false
    }
  }

  const deleteIncident = async (id: string): Promise<boolean> => {
    try {
      const updatedIncidents = incidents.filter((i) => i.id !== id)
      setIncidents(updatedIncidents)
      return await mockDB.saveIncidents(updatedIncidents)
    } catch (error) {
      console.error("Failed to delete incident:", error)
      return false
    }
  }

  const getPatientIncidents = (patientId: string) => {
    return incidents.filter((i) => i.patientId === patientId)
  }

  return (
    <DataContext.Provider
      value={{
        patients,
        incidents,
        addPatient,
        updatePatient,
        deletePatient,
        addIncident,
        updateIncident,
        deleteIncident,
        getPatientIncidents,
        isLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
