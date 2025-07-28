import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, ExclamationTriangle } from '@phosphor-icons/react'

interface FormData {
  name: string
  surname: string
}

interface FormErrors {
  name?: string
  surname?: string
}

export function WorkshopRegistration() {
  const [formData, setFormData] = useState<FormData>({ name: '', surname: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [registrationUuid, setRegistrationUuid] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.surname.trim()) {
      newErrors.surname = 'Surname is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateUuid = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const uuid = generateUuid()
    setRegistrationUuid(uuid)
    setIsSubmitting(false)
  }

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const resetForm = () => {
    setFormData({ name: '', surname: '' })
    setErrors({})
    setRegistrationUuid('')
  }

  if (registrationUuid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-primary" weight="fill" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Registration Successful!
            </CardTitle>
            <CardDescription>
              Your spot in the n8n workshop has been reserved
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <Label className="text-sm font-medium text-muted-foreground">
                Registration ID
              </Label>
              <p className="font-mono text-sm mt-1 text-foreground break-all">
                {registrationUuid}
              </p>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Please save this ID for your records. You'll receive workshop details soon!
            </p>
            <Button 
              onClick={resetForm}
              variant="outline"
              className="w-full"
            >
              Register Another Person
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">
            N8N Workshop Registration
          </CardTitle>
          <CardDescription>
            Reserve your spot in our upcoming automation workshop
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  className={`transition-colors ${
                    errors.name 
                      ? 'border-destructive focus:ring-destructive' 
                      : 'border-input focus:ring-ring'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.name && (
                  <Alert variant="destructive" className="py-2">
                    <ExclamationTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {errors.name}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="surname" className="text-sm font-medium">
                  Surname *
                </Label>
                <Input
                  id="surname"
                  type="text"
                  value={formData.surname}
                  onChange={handleInputChange('surname')}
                  className={`transition-colors ${
                    errors.surname 
                      ? 'border-destructive focus:ring-destructive' 
                      : 'border-input focus:ring-ring'
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.surname && (
                  <Alert variant="destructive" className="py-2">
                    <ExclamationTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {errors.surname}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-accent text-primary-foreground transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}