import { z } from "zod"


export const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  dob: z.string().min(1, "Date of birth is required"),
  contact: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  healthInfo: z
    .string()
    .min(1, "Health information is required")
    .max(500, "Health information must be less than 500 characters"),
})


export const appointmentSchema = z
  .object({
    patientId: z.string().min(1, "Please select a patient"),
    title: z.string().min(2, "Title must be at least 2 characters").max(100, "Title must be less than 100 characters"),
    description: z
      .string()
      .min(5, "Description must be at least 5 characters")
      .max(500, "Description must be less than 500 characters"),
    comments: z.string().max(500, "Comments must be less than 500 characters").optional(),
    appointmentDate: z.string().min(1, "Appointment date and time is required"),
    cost: z.string().optional(),
    treatment: z.string().max(500, "Treatment description must be less than 500 characters").optional(),
    status: z.enum(["Scheduled", "Completed", "Cancelled"]),
    nextDate: z.string().optional(),
    files: z.array(z.any()).optional(),
  })
  .refine(
    (data) => {
      // If status is Completed, cost and treatment should be provided
      if (data.status === "Completed") {
        return data.cost && data.treatment
      }
      return true
    },
    {
      message: "Cost and treatment are required for completed appointments",
      path: ["cost"],
    },
  )

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

// File validation
export const validateFile = (file: File) => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]

  if (file.size > maxSize) {
    throw new Error(`File ${file.name} is too large. Maximum size is 5MB.`)
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File ${file.name} has an unsupported format. Please use PDF, JPG, PNG, DOC, or DOCX.`)
  }

  return true
}

export type PatientFormData = z.infer<typeof patientSchema>
export type AppointmentFormData = z.infer<typeof appointmentSchema>
export type LoginFormData = z.infer<typeof loginSchema>
