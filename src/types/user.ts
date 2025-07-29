export interface UserProfile {
  name: string
  surname: string
  invitationUrl: string
  registrationDate: string
}

export interface RegistrationInfo {
  user: UserProfile
  registeredCount: number
  availableCount: number
}