import { PrioritySLA, WorkingHours } from '../types';

export const WORKING_HOURS: WorkingHours = {
  start: 11.5,  // 11:30 AM in decimal hours
  end: 21.5     // 9:30 PM in decimal hours
};

export const WORKING_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday (0=Sun, 1=Mon...6=Sat)

export const PRIORITY_SLA: PrioritySLA = {
  P1: 8,
  P2: 12,
  P3: 24,
  P4: 36
};

export const PRIORITY_NAMES = {
  P1: 'Critical',
  P2: 'High',
  P3: 'Medium',
  P4: 'Low'
};

export const PRIORITY_COLORS = {
  P1: 'bg-red-100 text-red-800',
  P2: 'bg-orange-100 text-orange-800',
  P3: 'bg-yellow-100 text-yellow-800',
  P4: 'bg-blue-100 text-blue-800'
};

export const STATUS_COLORS = {
  'Breached': 'text-red-600',
  'Critical': 'text-red-600',
  'Warning': 'text-yellow-600',
  'OK': 'text-green-600',
  'On Hold': 'text-yellow-600'
};

export const STATUS_BORDER_CLASSES = {
  'Breached': 'border-l-4 border-red-500',
  'OK': 'border-l-4 border-green-500',
  'On Hold': 'border-l-4 border-yellow-500',
  'Warning': 'border-l-4 border-yellow-500',
  'Critical': 'border-l-4 border-red-500'
};

export const PROGRESS_BAR_COLORS = {
  'Breached': 'bg-red-600',
  'Critical': 'bg-red-500',
  'Warning': 'bg-yellow-500',
  'OK': 'bg-green-500',
  'On Hold': 'bg-yellow-500'
};

export const PRIORITY_STYLES = {
  'P1': { border: 'border-red-600', bg: 'bg-red-50' },
  'P2': { border: 'border-orange-500', bg: 'bg-orange-50' },
  'P3': { border: 'border-yellow-500', bg: 'bg-yellow-50' },
  'P4': { border: 'border-blue-500', bg: 'bg-blue-50' }
};