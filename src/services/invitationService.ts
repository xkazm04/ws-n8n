import { InvitationLink } from '@/types/invitation';

export class InvitationService {
  private static generateUniqueId(): string {
    return 'inv_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private static generateInvitationUrl(id: string): string {
    // In a real application, this would be your domain
    const baseUrl = window.location.origin;
    return `${baseUrl}/workshop/${id}`;
  }

  private static generateLoginEmail(index: number): string {
    return `ws${index}@groupon.com`;
  }

  // Initialize some sample invitation links
  static initializeSampleData(): InvitationLink[] {
    const sampleLinks: InvitationLink[] = [
      {
        id: 'inv_sample1',
        link: this.generateInvitationUrl('inv_sample1'),
        status: 'open',
        user: null,
        loginEmail: this.generateLoginEmail(1),
        createdAt: new Date('2024-01-15'),
      },
      {
        id: 'inv_sample2',
        link: this.generateInvitationUrl('inv_sample2'),
        status: 'open',
        user: null,
        loginEmail: this.generateLoginEmail(2),
        createdAt: new Date('2024-01-16'),
      },
      {
        id: 'inv_sample3',
        link: this.generateInvitationUrl('inv_sample3'),
        status: 'registered',
        user: 'John Doe',
        loginEmail: this.generateLoginEmail(3),
        createdAt: new Date('2024-01-14'),
        registeredAt: new Date('2024-01-17'),
      },
    ];
    return sampleLinks;
  }

  static findOpenInvitation(invitations: InvitationLink[]): InvitationLink | null {
    return invitations.find(inv => inv.status === 'open') || null;
  }

  static registerUser(
    invitations: InvitationLink[], 
    userName: string
  ): { updatedInvitations: InvitationLink[], invitationUrl: string | null } {
    const openInvitation = this.findOpenInvitation(invitations);
    
    if (!openInvitation) {
      return { updatedInvitations: invitations, invitationUrl: null };
    }

    const updatedInvitations = invitations.map(inv => {
      if (inv.id === openInvitation.id) {
        return {
          ...inv,
          status: 'registered' as const,
          user: userName,
          registeredAt: new Date(),
        };
      }
      return inv;
    });

    return { 
      updatedInvitations, 
      invitationUrl: openInvitation.link 
    };
  }

  static createNewInvitation(existingInvitations: InvitationLink[] = []): InvitationLink {
    const id = this.generateUniqueId();
    // Find the next available email index by looking at existing invitations
    const usedIndexes = existingInvitations.map(inv => {
      const match = inv.loginEmail.match(/ws(\d+)@groupon\.com/);
      return match ? parseInt(match[1]) : 0;
    });
    const nextIndex = Math.max(0, ...usedIndexes) + 1;
    
    return {
      id,
      link: this.generateInvitationUrl(id),
      status: 'open',
      user: null,
      loginEmail: this.generateLoginEmail(nextIndex),
      createdAt: new Date(),
    };
  }
}