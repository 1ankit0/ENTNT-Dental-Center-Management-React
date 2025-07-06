"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useData, type Incident } from "@/contexts/DataContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { appointmentSchema, type AppointmentFormData } from "@/lib/validations"
import FileUpload from "@/components/FileUpload"
import { FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect } from "react"

interface AppointmentDialogProps {
  isOpen: boolean
  onClose: () => void
  incident: Incident | null
  mode: "add" | "edit" | "view"
}

export default function AppointmentDialog({ isOpen, onClose, incident, mode }: AppointmentDialogProps) {
  const { addIncident, updateIncident, patients } = useData()
  const { toast } = useToast()

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: "",
      title: "",
      description: "",
      comments: "",
      appointmentDate: "",
      cost: "",
      treatment: "",
      status: "Scheduled",
      nextDate: "",
      files: [],
    },
  })

  const watchedStatus = form.watch("status")

  useEffect(() => {
    if (incident) {
      form.reset({
        patientId: incident.patientId,
        title: incident.title,
        description: incident.description,
        comments: incident.comments,
        appointmentDate: incident.appointmentDate.slice(0, 16),
        cost: incident.cost?.toString() || "",
        treatment: incident.treatment || "",
        status: incident.status,
        nextDate: incident.nextDate ? incident.nextDate.slice(0, 16) : "",
        files: incident.files || [],
      })
    } else {
      form.reset({
        patientId: "",
        title: "",
        description: "",
        comments: "",
        appointmentDate: "",
        cost: "",
        treatment: "",
        status: "Scheduled",
        nextDate: "",
        files: [],
      })
    }
  }, [incident, form])

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      const incidentData = {
        ...data,
        appointmentDate: new Date(data.appointmentDate).toISOString(),
        nextDate: data.nextDate ? new Date(data.nextDate).toISOString() : undefined,
        cost: data.cost ? Number.parseFloat(data.cost) : undefined,
      }

      if (mode === "add") {
        addIncident(incidentData)
        toast({
          title: "Appointment created successfully! ✅",
          description: `The appointment has been scheduled${data.files && data.files.length > 0 ? ` with ${data.files.length} file(s) attached` : ""}.`,
        })
      } else if (mode === "edit" && incident) {
        updateIncident(incident.id, incidentData)
        toast({
          title: "Appointment updated successfully! ✅",
          description: `The appointment has been updated${data.files && data.files.length > 0 ? ` with ${data.files.length} file(s) attached` : ""}.`,
        })
      }

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the appointment.",
        variant: "destructive",
      })
    }
  }

  const isReadOnly = mode === "view"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" && "Add New Appointment"}
            {mode === "edit" && "Edit Appointment"}
            {mode === "view" && "Appointment Details"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a patient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Routine Checkup, Root Canal, Teeth Cleaning"
                      {...field}
                      readOnly={isReadOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the appointment/treatment"
                      rows={3}
                      {...field}
                      readOnly={isReadOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="appointmentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment Date & Time *</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} readOnly={isReadOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes, patient concerns, observations..."
                      rows={2}
                      {...field}
                      readOnly={isReadOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Post-Appointment Fields */}
            {watchedStatus === "Completed" && (
              <div className="border-t pt-4 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Post-Appointment Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Treatment Cost ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            readOnly={isReadOnly}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nextDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Next Appointment (Optional)</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} readOnly={isReadOnly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="treatment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treatment Provided</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description of treatment performed..."
                          rows={3}
                          {...field}
                          readOnly={isReadOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* File Upload Section */}
            <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 bg-blue-50/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-600" />
                  File Attachments
                </h3>
                {form.watch("files") && form.watch("files")!.length > 0 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {form.watch("files")!.length} file(s) attached
                  </Badge>
                )}
              </div>

              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload files={field.value || []} onFilesChange={field.onChange} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                {isReadOnly ? "Close" : "Cancel"}
              </Button>
              {!isReadOnly && (
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? "Saving..."
                    : mode === "add"
                      ? "Create Appointment"
                      : "Update Appointment"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
