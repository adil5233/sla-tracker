import { Ticket, SLAStatus } from "../types";
import {
  formatDateTime,
  getSLAStatus,
  getWorkingHoursBetween,
  isWorkingTime,
  isWorkingDay,
} from "../utils/slaCalculations";
import { PriorityBadge } from "./PriorityBadge";
import { TicketStatus } from "./TicketStatus";
import { ProgressBar } from "./ProgressBar";

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
  toggleHold,
}: TicketItemProps) {
  const effectiveSlaEndTime = ticket.isOnHold
    ? ticket.adjustedSlaEndTime
    : ticket.slaEndTime;
  const status: SLAStatus = ticket.isOnHold
    ? "On Hold"
    : getSLAStatus(currentTime, effectiveSlaEndTime, ticket.priority);
  let progressPercent = 0;
  let timeRemaining = "";
  if (status === "Breached") {
    progressPercent = 100;
    timeRemaining = "Breached";
  } else if (ticket.isOnHold) {
    const total = getWorkingHoursBetween(ticket.createdAt, ticket.slaEndTime);
    const elapsed = getWorkingHoursBetween(
      ticket.createdAt,
      effectiveSlaEndTime
    );
    progressPercent = Math.max(0, Math.min(100, (elapsed / total) * 100));
    timeRemaining = "On Hold - SLA paused";
  } else {
    const total = getWorkingHoursBetween(ticket.createdAt, ticket.slaEndTime);
    const elapsed = getWorkingHoursBetween(ticket.createdAt, currentTime);
    progressPercent = Math.max(0, Math.min(100, (elapsed / total) * 100));
    const remaining = Math.max(0, total - elapsed);
    const hours = Math.floor(remaining);
    const minutes = Math.floor((remaining - hours) * 60);
    timeRemaining = `${hours}h ${minutes}m remaining`;
  }

  const isUrgent = status === "Critical" || status === "Breached";

  return (
    <div
      className={`p-6 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
        isUrgent ? "animate-pulse bg-red-50" : ""
      }`}
    >
      {/* Banner for outside working hours */}
      {(!isWorkingDay(currentTime) || !isWorkingTime(currentTime)) && (
        <div className="mb-3 bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-2 rounded flex items-center gap-2">
          <svg
            className="w-4 h-4 text-yellow-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Outside working hours - SLA timer paused
        </div>
      )}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <PriorityBadge priority={ticket.priority} />
            <h3 className="text-lg font-semibold text-gray-900">
              {ticket.ticketId}
            </h3>
          </div>
          <p className="mt-1 text-sm text-gray-600 mb-3">
            {ticket.description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-500">
            <div>
              <span className="font-medium">Created:</span>{" "}
              {formatDateTime(ticket.createdAt)}
            </div>
            <div>
              <span className="font-medium">SLA Deadline:</span>{" "}
              {formatDateTime(ticket.slaEndTime)}
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
