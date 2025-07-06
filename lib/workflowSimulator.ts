

export interface WorkflowStep {
  id: string
  name: string
  description: string
  duration: number 
  status: "pending" | "in-progress" | "completed" | "failed"
  timestamp?: string
}

export interface Workflow {
  id: string
  name: string
  type: "patient-registration" | "appointment-booking" | "treatment-completion" | "file-upload"
  steps: WorkflowStep[]
  currentStep: number
  status: "pending" | "in-progress" | "completed" | "failed"
  startTime?: string
  endTime?: string
}

class WorkflowSimulator {
  private activeWorkflows: Map<string, Workflow> = new Map()

  
  createPatientRegistrationWorkflow(): Workflow {
    const workflowId = `patient-reg-${Date.now()}`

    const workflow: Workflow = {
      id: workflowId,
      name: "Patient Registration",
      type: "patient-registration",
      currentStep: 0,
      status: "pending",
      steps: [
        {
          id: "validate-data",
          name: "Validate Patient Data",
          description: "Checking patient information for completeness and accuracy",
          duration: 800,
          status: "pending",
        },
        {
          id: "check-duplicates",
          name: "Check for Duplicates",
          description: "Searching existing records for duplicate patients",
          duration: 1200,
          status: "pending",
        },
        {
          id: "generate-id",
          name: "Generate Patient ID",
          description: "Creating unique patient identifier",
          duration: 300,
          status: "pending",
        },
        {
          id: "save-record",
          name: "Save Patient Record",
          description: "Storing patient information in database",
          duration: 600,
          status: "pending",
        },
        {
          id: "send-confirmation",
          name: "Send Confirmation",
          description: "Sending welcome message to patient",
          duration: 400,
          status: "pending",
        },
      ],
    }

    this.activeWorkflows.set(workflowId, workflow)
    return workflow
  }

  
  createAppointmentBookingWorkflow(): Workflow {
    const workflowId = `appointment-${Date.now()}`

    const workflow: Workflow = {
      id: workflowId,
      name: "Appointment Booking",
      type: "appointment-booking",
      currentStep: 0,
      status: "pending",
      steps: [
        {
          id: "validate-appointment",
          name: "Validate Appointment Data",
          description: "Checking appointment details and patient information",
          duration: 600,
          status: "pending",
        },
        {
          id: "check-availability",
          name: "Check Schedule Availability",
          description: "Verifying time slot availability",
          duration: 900,
          status: "pending",
        },
        {
          id: "reserve-slot",
          name: "Reserve Time Slot",
          description: "Blocking the selected time slot",
          duration: 400,
          status: "pending",
        },
        {
          id: "save-appointment",
          name: "Save Appointment",
          description: "Storing appointment in database",
          duration: 700,
          status: "pending",
        },
        {
          id: "send-reminder",
          name: "Schedule Reminder",
          description: "Setting up appointment reminder notifications",
          duration: 300,
          status: "pending",
        },
      ],
    }

    this.activeWorkflows.set(workflowId, workflow)
    return workflow
  }

  
  createFileUploadWorkflow(fileCount: number): Workflow {
    const workflowId = `file-upload-${Date.now()}`

    const workflow: Workflow = {
      id: workflowId,
      name: "File Upload",
      type: "file-upload",
      currentStep: 0,
      status: "pending",
      steps: [
        {
          id: "validate-files",
          name: "Validate Files",
          description: `Checking ${fileCount} file(s) for size and format compliance`,
          duration: 500 * fileCount,
          status: "pending",
        },
        {
          id: "scan-security",
          name: "Security Scan",
          description: "Scanning files for security threats",
          duration: 800 * fileCount,
          status: "pending",
        },
        {
          id: "convert-format",
          name: "Convert to Base64",
          description: "Converting files to base64 format for storage",
          duration: 1000 * fileCount,
          status: "pending",
        },
        {
          id: "save-files",
          name: "Save Files",
          description: "Storing files in local database",
          duration: 600 * fileCount,
          status: "pending",
        },
        {
          id: "update-record",
          name: "Update Record",
          description: "Linking files to appointment record",
          duration: 300,
          status: "pending",
        },
      ],
    }

    this.activeWorkflows.set(workflowId, workflow)
    return workflow
  }

  
  async executeWorkflow(
    workflowId: string,
    onStepComplete?: (step: WorkflowStep, workflow: Workflow) => void,
  ): Promise<boolean> {
    const workflow = this.activeWorkflows.get(workflowId)
    if (!workflow) return false

    workflow.status = "in-progress"
    workflow.startTime = new Date().toISOString()

    try {
      for (let i = 0; i < workflow.steps.length; i++) {
        const step = workflow.steps[i]
        workflow.currentStep = i

       
        step.status = "in-progress"
        step.timestamp = new Date().toISOString()

        
        await new Promise((resolve) => setTimeout(resolve, step.duration))

        
        if (Math.random() < 0.05) {
          step.status = "failed"
          workflow.status = "failed"
          return false
        }

        
        step.status = "completed"

        if (onStepComplete) {
          onStepComplete(step, workflow)
        }
      }

      
      workflow.status = "completed"
      workflow.endTime = new Date().toISOString()
      return true
    } catch (error) {
      workflow.status = "failed"
      workflow.endTime = new Date().toISOString()
      return false
    }
  }

  
  getWorkflow(workflowId: string): Workflow | undefined {
    return this.activeWorkflows.get(workflowId)
  }
  getActiveWorkflows(): Workflow[] {
    return Array.from(this.activeWorkflows.values())
  }

  
  cleanupCompletedWorkflows(): void {
    for (const [id, workflow] of this.activeWorkflows.entries()) {
      if (workflow.status === "completed" || workflow.status === "failed") {
        this.activeWorkflows.delete(id)
      }
    }
  }
}

export const workflowSimulator = new WorkflowSimulator()
