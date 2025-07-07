import { Ticket, SLAStatus } from '../types';
import { formatDateTime, formatTimeRemaining, getSLAStatus } from '../utils/slaCalculations';
import { PriorityBadge } from './PriorityBadge';
import { TicketStatus } from './TicketStatus';
import { ProgressBar } from './ProgressBar';

interface TicketItemProps {
  ticket: Ticket;
  currentTime: Date;
  removeTicket: (id: string) => void;
  toggleHold: (id: string) => void;
}

export function TicketItem({ 
  ticket, 
  currentTime, 
  removeTicket, 
  toggleHold 
}: TicketItemProps) {
  const effectiveSlaEndTime = ticket.isOnHold ? ticket.adjustedSlaEndTime : ticket.slaEndTime;
  const status: SLAStatus = ticket.isOnHold ? 'On Hold' : getSLAStatus(currentTime, effectiveSlaEndTime, ticket.priority);
  const timeRemaining = ticket.isOnHold ? 'On Hold - SLA paused' : formatTimeRemaining(currentTime, effectiveSlaEndTime);
  
  const progressPercent = status === 'Breached' ? 100 : 
    ticket.isOnHold ? Math.max(0, Math.min(100, 
      (1 - ((effectiveSlaEndTime.getTime() - ticket.createdAt.getTime()) / 
          (ticket.slaEndTime.getTime() - ticket.createdAt.getTime()))) * 100))
    : Math.max(0, Math.min(100, 
      (1 - ((effectiveSlaEndTime.getTime() - currentTime.getTime()) / 
          (ticket.slaEndTime.getTime() - ticket.createdAt.getTime()))) * 100));

  const isUrgent = status === 'Critical' || status === 'Breached';

  return (
    <div className={`p-6 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
      isUrgent ? 'animate-pulse bg-red-50' : ''
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <PriorityBadge priority={ticket.priority} />
            <h3 className="text-lg font-semibold text-gray-900">{ticket.ticketId}</h3>
          </div>
          <p className="mt-1 text-sm text-gray-600 mb-3">{ticket.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-500">
            <div>
              <span className="font-medium">Created:</span> {formatDateTime(ticket.createdAt)}
            </div>
            <div>
              <span className="font-medium">SLA Deadline:</span> {formatDateTime(ticket.slaEndTime)}
            </div>
          </div>
        </div>
        <TicketStatus 
          status={status} 
          timeRemaining={timeRemaining} 
          removeTicket={() => removeTicket(ticket.id)}
          toggleHold={() => toggleHold(ticket.id)}
          isOnHold={ticket.isOnHold}
        />
      </div>
      <ProgressBar status={status} progressPercent={progressPercent} />
    </div>
  );
}