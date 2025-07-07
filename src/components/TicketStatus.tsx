import { Pause, Play, Trash2 } from 'lucide-react';
import { SLAStatus } from '../types';
import { STATUS_COLORS, STATUS_BORDER_CLASSES } from '../constants';

interface TicketStatusProps {
  status: SLAStatus;
  timeRemaining: string;
  removeTicket: () => void;
  toggleHold: () => void;
  isOnHold: boolean;
}

export function TicketStatus({ 
  status, 
  timeRemaining, 
  removeTicket, 
  toggleHold, 
  isOnHold 
}: TicketStatusProps) {
  return (
    <div className={`flex flex-col items-end pl-4 ${STATUS_BORDER_CLASSES[status]}`}>
      <span className={`text-sm font-semibold ${STATUS_COLORS[status]}`}>
        {status}
      </span>
      <span className="text-sm mt-1 text-gray-600 font-medium">{timeRemaining}</span>
      <div className="flex space-x-2 mt-3">
        <button 
          onClick={removeTicket}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Remove
        </button>
        <button 
          onClick={toggleHold}
          className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors ${
            isOnHold 
              ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
              : 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50'
          }`}
        >
          {isOnHold ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          {isOnHold ? 'Resume' : 'Hold'}
        </button>
      </div>
    </div>
  );
}