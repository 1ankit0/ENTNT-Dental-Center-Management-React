"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Database, Download, Trash2 } from "lucide-react"
import { useData } from "@/contexts/DataContext"
import { useToast } from "@/hooks/use-toast"

export default function DataPersistenceStatus() {
  const { patients, incidents } = useData()
  const { toast } = useToast()

  const getLocalStorageSize = () => {
    let total = 0
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length
      }
    }
    return (total / 1024).toFixed(2) // Convert to KB
  }

  const getTotalFiles = () => {
    return incidents.reduce((total, incident) => total + incident.files.length, 0)
  }

  const exportData = () => {
    const data = {
      patients,
      incidents,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `dental-data-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Data exported",
      description: "Your data has been downloaded as a backup file.",
    })
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.removeItem("dental_patients")
      localStorage.removeItem("dental_incidents")
      localStorage.removeItem("dental_user")

      toast({
        title: "Data cleared",
        description: "All data has been removed from localStorage.",
        variant: "destructive",
      })

      
      window.location.reload()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5" />
          Data Persistence Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{patients.length}</p>
            <p className="text-sm text-gray-600">Patients Stored</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{incidents.length}</p>
            <p className="text-sm text-gray-600">Appointments Stored</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{getTotalFiles()}</p>
            <p className="text-sm text-gray-600">Files Stored</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">{getLocalStorageSize()} KB</p>
            <p className="text-sm text-gray-600">Storage Used</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">localStorage Status:</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Active
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">File Storage:</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Base64 Encoded
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Auto-Save:</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Enabled
            </Badge>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button onClick={exportData} variant="outline" size="sm" className="flex-1 bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button
            onClick={clearAllData}
            variant="outline"
            size="sm"
            className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• All data is stored locally in your browser</p>
          <p>• Files are converted to base64 format for storage</p>
          <p>• Data persists across browser sessions</p>
          <p>• Maximum storage: ~5-10MB depending on browser</p>
        </div>
      </CardContent>
    </Card>
  )
}
