import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, ExclamationTriangle, Copy } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { InvitationLink } from '@/types/invitation'
import { InvitationService } from '@/services/invitationService'
import { toast } from 'sonner'

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
  const [invitationUrl, setInvitationUrl] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Initialize invitation links with sample data
  const [invitations, setInvitations] = useKV<InvitationLink[]>(
    'workshop-invitations', 
    InvitationService.initializeSampleData()
  )

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const userName = `${formData.name} ${formData.surname}`
    const { updatedInvitations, invitationUrl: resultUrl } = InvitationService.registerUser(
      invitations, 
      userName
    )
    
    if (resultUrl) {
      setInvitations(updatedInvitations)
      setInvitationUrl(resultUrl)
    } else {
      // No open invitations available - create a new one
      const newInvitation = InvitationService.createNewInvitation()
      const newInvitations = [...invitations, newInvitation]
      const { updatedInvitations: finalInvitations, invitationUrl: finalUrl } = 
        InvitationService.registerUser(newInvitations, userName)
      
      setInvitations(finalInvitations)
      setInvitationUrl(finalUrl || '')
    }
    
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
    setInvitationUrl('')
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Invitation link copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  if (invitationUrl) {
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
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <Label className="text-sm font-medium text-muted-foreground">
                Workshop Invitation Link
              </Label>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm text-foreground break-all flex-1 p-2 bg-background rounded border">
                  {invitationUrl}
                </p>
                <Button
                  onClick={() => copyToClipboard(invitationUrl)}
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Alert className="bg-primary/10 border-primary/20">
              <CheckCircle className="h-4 w-4 text-primary" weight="fill" />
              <AlertDescription>
                <strong>Registration Status:</strong> This invitation link has been marked as "registered" 
                and assigned to {formData.name} {formData.surname}.
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground text-center">
              Use this invitation link to access the workshop. Save it for your records!
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

            {/* Invitation Status Display */}
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Workshop Status</div>
              <div className="flex justify-between text-sm">
                <span>Available spots:</span>
                <span className="font-medium text-primary">
                  {invitations.filter(inv => inv.status === 'open').length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Registered:</span>
                <span className="font-medium">
                  {invitations.filter(inv => inv.status === 'registered').length}
                </span>
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