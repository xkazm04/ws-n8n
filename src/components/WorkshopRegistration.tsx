import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, ExclamationTriangle, Copy } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { InvitationLink } from '@/types/invitation'
import { InvitationService } from '@/services/invitationService'
import { UserProfileService } from '@/services/userProfileService'
import { UserProfile, RegistrationInfo } from '@/types/user'
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
  const [registrationInfo, setRegistrationInfo] = useState<RegistrationInfo | null>(null)
  
  // Initialize invitation links with sample data
  const [invitations, setInvitations] = useKV<InvitationLink[]>(
    'workshop-invitations', 
    InvitationService.initializeSampleData()
  )

  // Check for existing user registration on component mount
  useEffect(() => {
    const existingUser = UserProfileService.getUserProfile()
    const existingRegistrationInfo = UserProfileService.getRegistrationInfo()
    
    if (existingUser && existingRegistrationInfo) {
      setInvitationUrl(existingUser.invitationUrl)
      setRegistrationInfo(existingRegistrationInfo)
    }
  }, [])

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
    
    let finalUrl = ''
    let finalInvitations = updatedInvitations
    
    if (resultUrl) {
      finalUrl = resultUrl
      setInvitations(finalInvitations)
    } else {
      // No open invitations available - create a new one
      const newInvitation = InvitationService.createNewInvitation()
      const newInvitations = [...invitations, newInvitation]
      const { updatedInvitations: finalUpdatedInvitations, invitationUrl: finalResultUrl } = 
        InvitationService.registerUser(newInvitations, userName)
      
      finalInvitations = finalUpdatedInvitations
      finalUrl = finalResultUrl || ''
      setInvitations(finalInvitations)
    }
    
    // Save user profile and registration info to localStorage
    const userProfile: UserProfile = {
      name: formData.name,
      surname: formData.surname,
      invitationUrl: finalUrl,
      registrationDate: new Date().toISOString()
    }
    
    const registeredCount = finalInvitations.filter(inv => inv.status === 'registered').length
    const availableCount = finalInvitations.filter(inv => inv.status === 'open').length
    
    const registrationInfo: RegistrationInfo = {
      user: userProfile,
      registeredCount,
      availableCount
    }
    
    UserProfileService.saveUserProfile(userProfile)
    UserProfileService.saveRegistrationInfo(registrationInfo)
    
    setInvitationUrl(finalUrl)
    setRegistrationInfo(registrationInfo)
    setIsSubmitting(false)
  }

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Invitation link copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  if (invitationUrl && registrationInfo) {
    return (
      <div className="h-full bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md relative">          
          <CardHeader className="text-center pr-16">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-primary" weight="fill" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Welcome back, {registrationInfo.user.name}!
            </CardTitle>
            <CardDescription>
              Your spot in the n8n workshop is confirmed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <Label className="text-sm font-medium text-muted-foreground">
                Workshop Invitation Link
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => copyToClipboard(invitationUrl)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="text-center">Registered on: {new Date(registrationInfo.user.registrationDate).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const registeredCount = invitations.filter(inv => inv.status === 'registered').length
  const availableCount = invitations.filter(inv => inv.status === 'open').length

  return (
    <div className="h-full bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md relative">
        {/* Workshop Status Badge */}
        <div className="absolute top-4 right-4 bg-primary/10 border border-primary/20 rounded-md px-2 py-1">
          <span className="text-xs font-medium text-primary">
            {registeredCount}/{registeredCount + availableCount}
          </span>
        </div>
        
        <CardHeader className="text-center pr-16">
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