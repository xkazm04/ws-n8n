export interface InvitationLink {
  link: string; // unique URL
  status: 'open' | 'registered';
  user: string | null; // name of registered user
  id: string; // unique identifier
  loginEmail: string; // assigned login email for this invitation
  createdAt: Date;
  registeredAt?: Date;
}

export interface RegistrationResult {
  success: boolean;
  invitationUrl?: string;
  error?: string;
}