"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { SmileIcon as Tooth, Loader2 } from "lucide-react"
import { loginSchema, type LoginFormData } from "@/lib/validations"

export default function LoginForm() {
  const { login, isAuthenticating } = useAuth()
  const { toast } = useToast()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const success = await login(data.email, data.password)

      if (success) {
        toast({
          title: "Login successful! ✅",
          description: "Welcome to the Dental Center Management System",
        })
      } else {
        form.setError("root", {
          message: "Invalid email or password. Please check your credentials and try again.",
        })
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const quickLogin = (email: string, password: string) => {
    form.setValue("email", email)
    form.setValue("password", password)
    form.clearErrors()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Tooth className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Dental Center</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} disabled={isAuthenticating} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} disabled={isAuthenticating} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {form.formState.errors.root.message}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isAuthenticating}>
                {isAuthenticating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => quickLogin("admin@entnt.in", "admin123")}
              className="w-full"
              disabled={isAuthenticating}
            >
              Quick Admin Login
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => quickLogin("john@entnt.in", "patient123")}
              className="w-full"
              disabled={isAuthenticating}
            >
              Quick Patient Login
            </Button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Demo Credentials:</h3>
            <div className="text-sm space-y-1">
              <p>
                <strong>Admin:</strong> admin@entnt.in / admin123
              </p>
              <p>
                <strong>Patient:</strong> john@entnt.in / patient123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
