import { Ticket } from '../types';
import { TicketItem } from './TicketItem';
import { AlertCircle } from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  currentTime: Date;
  removeTicket: (id: string) => void;
  toggleHold: (id: string) => void;
}

export function TicketList({ 
  tickets, 
  currentTime, 
  removeTicket, 
  toggleHold 
}: TicketListProps) {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-indigo-600" />
          Active Tickets ({tickets.length})
        </h2>
      </div>
      <div className="divide-y divide-gray-200">
        {tickets.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg">No tickets added yet</p>
            <p className="text-sm">Add your first ticket using the form above to start tracking SLAs.</p>
          </div>
        ) : (
          tickets.map(ticket => (
            <TicketItem 
              key={ticket.id}
              ticket={ticket}
              currentTime={currentTime}
              removeTicket={removeTicket}
              toggleHold={toggleHold}
            />
          ))
        )}
      </div>
    </div>
  );
}