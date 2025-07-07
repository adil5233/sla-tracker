export interface Ticket {
  id: string;
  ticketId: string;
  description: string;
  priority: Priority;
  createdAt: Date;
  slaEndTime: Date;
  isOnHold: boolean;
  holdStart: Date | null;
  adjustedSlaEndTime: Date;
}

export type Priority = 'P1' | 'P2' | 'P3' | 'P4';

export type SLAStatus = 'OK' | 'Warning' | 'Critical' | 'Breached' | 'On Hold';

export interface FormData {
  ticketId: string;
  description: string;
  priority: Priority;
  createdAt: string;
}

export interface WorkingHours {
  start: number;
  end: number;
}

export interface PrioritySLA {
  [key: string]: number;
}