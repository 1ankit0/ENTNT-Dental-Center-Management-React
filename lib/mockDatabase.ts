

export interface DatabaseOperation {
  type: "CREATE" | "READ" | "UPDATE" | "DELETE"
  table: "patients" | "incidents" | "users"
  timestamp: string
  success: boolean
  data?: any
}

class MockDatabase {
  private operations: DatabaseOperation[] = []

  private async simulateLatency(min = 100, max = 500): Promise<void> {
    const delay = Math.random() * (max - min) + min
    return new Promise((resolve) => setTimeout(resolve, delay))
  }

  private logOperation(operation: DatabaseOperation): void {
    this.operations.push(operation)
    console.log(`[MockDB] ${operation.type} on ${operation.table}:`, operation)
  }

  async getPatients(): Promise<any[]> {
    await this.simulateLatency()

    const data = localStorage.getItem("dental_patients")
    const patients = data ? JSON.parse(data) : []

    this.logOperation({
      type: "READ",
      table: "patients",
      timestamp: new Date().toISOString(),
      success: true,
      data: { count: patients.length },
    })

    return patients
  }

  async savePatients(patients: any[]): Promise<boolean> {
    await this.simulateLatency()

    try {
      localStorage.setItem("dental_patients", JSON.stringify(patients))

      this.logOperation({
        type: "UPDATE",
        table: "patients",
        timestamp: new Date().toISOString(),
        success: true,
        data: { count: patients.length },
      })

      return true
    } catch (error) {
      this.logOperation({
        type: "UPDATE",
        table: "patients",
        timestamp: new Date().toISOString(),
        success: false,
        data: { error: error instanceof Error ? error.message : "Unknown error" },
      })

      return false
    }
  }


  async getIncidents(): Promise<any[]> {
    await this.simulateLatency()

    const data = localStorage.getItem("dental_incidents")
    const incidents = data ? JSON.parse(data) : []

    this.logOperation({
      type: "READ",
      table: "incidents",
      timestamp: new Date().toISOString(),
      success: true,
      data: { count: incidents.length },
    })

    return incidents
  }

  async saveIncidents(incidents: any[]): Promise<boolean> {
    await this.simulateLatency()

    try {
      localStorage.setItem("dental_incidents", JSON.stringify(incidents))

      this.logOperation({
        type: "UPDATE",
        table: "incidents",
        timestamp: new Date().toISOString(),
        success: true,
        data: { count: incidents.length },
      })

      return true
    } catch (error) {
      this.logOperation({
        type: "UPDATE",
        table: "incidents",
        timestamp: new Date().toISOString(),
        success: false,
        data: { error: error instanceof Error ? error.message : "Unknown error" },
      })

      return false
    }
  }

  // Simulate user authentication
  async authenticateUser(email: string, password: string): Promise<any | null> {
    await this.simulateLatency(200, 800) // Simulate auth delay

    // Hardcoded users - no external auth libraries
    const users = [
      { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123" },
      { id: "2", role: "Patient", email: "john@entnt.in", password: "patient123", patientId: "p1" },
      { id: "3", role: "Patient", email: "jane@entnt.in", password: "patient123", patientId: "p2" },
      { id: "4", role: "Patient", email: "mike@entnt.in", password: "patient123", patientId: "p3" },
    ]

    const user = users.find((u) => u.email === email && u.password === password)

    this.logOperation({
      type: "READ",
      table: "users",
      timestamp: new Date().toISOString(),
      success: !!user,
      data: { email, authenticated: !!user },
    })

    if (user) {
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword
    }

    return null
  }

  
  getOperationHistory(): DatabaseOperation[] {
    return [...this.operations]
  }

  clearOperationHistory(): void {
    this.operations = []
  }
}


export const mockDB = new MockDatabase()
