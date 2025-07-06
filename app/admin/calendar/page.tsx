"use client"

import { useState } from "react"
import { useData } from "@/contexts/DataContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"

export default function CalendarPage() {
  const { incidents, patients } = useData()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getAppointmentsForDate = (date: Date) => {
    return incidents.filter((incident) => isSameDay(new Date(incident.appointmentDate), date))
  }

  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : []

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(direction === "prev" ? subMonths(currentDate, 1) : addMonths(currentDate, 1))
    setSelectedDate(null)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
        <p className="text-gray-600">View scheduled appointments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{format(currentDate, "MMMM yyyy")}</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map((day) => {
                  const dayAppointments = getAppointmentsForDate(day)
                  const isSelected = selectedDate && isSameDay(day, selectedDate)
                  const isToday = isSameDay(day, new Date())

                  return (
                    <div
                      key={day.toISOString()}
                      className={`
                        min-h-[80px] p-2 border rounded-lg cursor-pointer transition-colors
                        ${isSelected ? "bg-blue-100 border-blue-300" : "hover:bg-gray-50"}
                        ${isToday ? "border-blue-500" : "border-gray-200"}
                        ${!isSameMonth(day, currentDate) ? "text-gray-400" : ""}
                      `}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className="text-sm font-medium mb-1">{format(day, "d")}</div>
                      {dayAppointments.length > 0 && (
                        <div className="space-y-1">
                          {dayAppointments.slice(0, 2).map((appointment) => {
                            const patient = patients.find((p) => p.id === appointment.patientId)
                            const statusColor =
                              appointment.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : appointment.status === "Scheduled"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"

                            return (
                              <div
                                key={appointment.id}
                                className={`text-xs px-1 py-0.5 rounded truncate ${statusColor}`}
                              >
                                {format(new Date(appointment.appointmentDate), "HH:mm")} - {patient?.name}
                              </div>
                            )
                          })}
                          {dayAppointments.length > 2 && (
                            <div className="text-xs text-gray-500">+{dayAppointments.length - 2} more</div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Select a date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                <div className="space-y-4">
                  {selectedDateAppointments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No appointments scheduled</p>
                  ) : (
                    selectedDateAppointments.map((appointment) => {
                      const patient = patients.find((p) => p.id === appointment.patientId)
                      const statusColor =
                        appointment.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "Scheduled"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"

                      return (
                        <div key={appointment.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{appointment.title}</h4>
                            <Badge className={statusColor}>{appointment.status}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">Patient: {patient?.name}</p>
                          <p className="text-sm text-gray-600 mb-1">
                            Time: {format(new Date(appointment.appointmentDate), "HH:mm")}
                          </p>
                          <p className="text-sm text-gray-600">{appointment.description}</p>
                          {appointment.treatment && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Treatment:</span> {appointment.treatment}
                            </p>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Click on a date to view appointments</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
