import { UserProfile, RegistrationInfo } from '@/types/user'

const USER_PROFILE_KEY = 'workshop-user-profile'
const REGISTRATION_INFO_KEY = 'workshop-registration-info'

export class UserProfileService {
  static saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile))
  }

  static getUserProfile(): UserProfile | null {
    const stored = localStorage.getItem(USER_PROFILE_KEY)
    if (!stored) return null
    
    try {
      return JSON.parse(stored)
    } catch (error) {
      console.error('Error parsing user profile from localStorage:', error)
      return null
    }
  }

  static saveRegistrationInfo(info: RegistrationInfo): void {
    localStorage.setItem(REGISTRATION_INFO_KEY, JSON.stringify(info))
  }

  static getRegistrationInfo(): RegistrationInfo | null {
    const stored = localStorage.getItem(REGISTRATION_INFO_KEY)
    if (!stored) return null
    
    try {
      return JSON.parse(stored)
    } catch (error) {
      console.error('Error parsing registration info from localStorage:', error)
      return null
    }
  }

  static clearUserData(): void {
    localStorage.removeItem(USER_PROFILE_KEY)
    localStorage.removeItem(REGISTRATION_INFO_KEY)
  }

  static isUserRegistered(): boolean {
    return this.getUserProfile() !== null
  }
}