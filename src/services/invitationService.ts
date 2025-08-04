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

  // Initialize sample invitation links with hardcoded login emails
  static initializeSampleData(): InvitationLink[] {
    const sampleLinks: InvitationLink[] = [
      {
        id: 'inv_sample1',
        link: this.generateInvitationUrl('inv_sample1'),
        status: 'open',
        user: null,
        loginEmail: 'ws1@groupon.com',
        createdAt: new Date('2024-01-15'),
      },
      {
        id: 'inv_sample2',
        link: this.generateInvitationUrl('inv_sample2'),
        status: 'open',
        user: null,
        loginEmail: 'ws2@groupon.com',
        createdAt: new Date('2024-01-16'),
      },
      {
        id: 'inv_sample3',
        link: this.generateInvitationUrl('inv_sample3'),
        status: 'registered',
        user: 'John Doe',
        loginEmail: 'ws3@groupon.com',
        createdAt: new Date('2024-01-14'),
        registeredAt: new Date('2024-01-17'),
      },
      {
        id: 'inv_sample4',
        link: this.generateInvitationUrl('inv_sample4'),
        status: 'open',
        user: null,
        loginEmail: 'ws4@groupon.com',
        createdAt: new Date('2024-01-17'),
      },
      {
        id: 'inv_sample5',
        link: this.generateInvitationUrl('inv_sample5'),
        status: 'open',
        user: null,
        loginEmail: 'ws5@groupon.com',
        createdAt: new Date('2024-01-18'),
      },
      {
        id: 'inv_sample6',
        link: this.generateInvitationUrl('inv_sample6'),
        status: 'open',
        user: null,
        loginEmail: 'ws6@groupon.com',
        createdAt: new Date('2024-01-19'),
      },
      {
        id: 'inv_sample7',
        link: this.generateInvitationUrl('inv_sample7'),
        status: 'open',
        user: null,
        loginEmail: 'ws7@groupon.com',
        createdAt: new Date('2024-01-20'),
      },
      {
        id: 'inv_sample8',
        link: this.generateInvitationUrl('inv_sample8'),
        status: 'open',
        user: null,
        loginEmail: 'ws8@groupon.com',
        createdAt: new Date('2024-01-21'),
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