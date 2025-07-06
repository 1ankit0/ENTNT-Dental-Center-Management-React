"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useData, type Patient } from "@/contexts/DataContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { patientSchema, type PatientFormData } from "@/lib/validations"
import { useEffect } from "react"

interface PatientDialogProps {
  isOpen: boolean
  onClose: () => void
  patient: Patient | null
  mode: "add" | "edit" | "view"
}

export default function PatientDialog({ isOpen, onClose, patient, mode }: PatientDialogProps) {
  const { addPatient, updatePatient } = useData()
  const { toast } = useToast()

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      dob: "",
      contact: "",
      email: "",
      healthInfo: "",
    },
  })

  useEffect(() => {
    if (patient) {
      form.reset({
        name: patient.name,
        dob: patient.dob,
        contact: patient.contact,
        email: patient.email || "",
        healthInfo: patient.healthInfo,
      })
    } else {
      form.reset({
        name: "",
        dob: "",
        contact: "",
        email: "",
        healthInfo: "",
      })
    }
  }, [patient, form])

  const onSubmit = async (data: PatientFormData) => {
    try {
      if (mode === "add") {
        addPatient(data)
        toast({
          title: "Patient added successfully! ✅",
          description: `${data.name} has been added to the system.`,
        })
      } else if (mode === "edit" && patient) {
        updatePatient(patient.id, data)
        toast({
          title: "Patient updated successfully! ✅",
          description: `${data.name}'s information has been updated.`,
        })
      }

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the patient information.",
        variant: "destructive",
      })
    }
  }

  const isReadOnly = mode === "view"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" && "Add New Patient"}
            {mode === "edit" && "Edit Patient"}
            {mode === "view" && "Patient Details"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter patient's full name" {...field} readOnly={isReadOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} readOnly={isReadOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} readOnly={isReadOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address (Optional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" {...field} readOnly={isReadOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="healthInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Health Information *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Allergies, medical conditions, medications, etc."
                      rows={3}
                      {...field}
                      readOnly={isReadOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                {isReadOnly ? "Close" : "Cancel"}
              </Button>
              {!isReadOnly && (
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : mode === "add" ? "Add Patient" : "Update Patient"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
