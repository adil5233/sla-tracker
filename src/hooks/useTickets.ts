import { useState, useEffect } from 'react';
import { Ticket } from '../types';
import { 
  addTicket as addTicketToFirestore, 
  updateTicket as updateTicketInFirestore, 
  deleteTicket as deleteTicketFromFirestore,
  subscribeToTickets 
} from '../services/ticketService';
import { getWorkingHoursBetween } from '../utils/slaCalculations';

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToTickets(
      (updatedTickets) => {
        setTickets(updatedTickets);
        setLoading(false);
        setError(null);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addTicket = async (ticket: Omit<Ticket, 'id'>): Promise<void> => {
    try {
      setError(null);
      await addTicketToFirestore(ticket);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add ticket');
      throw error;
    }
  };

  const updateTicket = async (ticketId: string, updates: Partial<Ticket>): Promise<void> => {
    try {
      setError(null);
      await updateTicketInFirestore(ticketId, updates);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update ticket');
      throw error;
    }
  };

  const deleteTicket = async (ticketId: string): Promise<void> => {
    try {
      setError(null);
      await deleteTicketFromFirestore(ticketId);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete ticket');
      throw error;
    }
  };

  const toggleHold = async (ticketId: string, currentTime: Date): Promise<void> => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    try {
      if (ticket.isOnHold && ticket.holdStart) {
        // Resume - calculate working hours lost during hold and extend SLA accordingly
        const holdDurationInWorkingHours = getWorkingHoursBetween(ticket.holdStart, currentTime);
        const newSlaEndTime = new Date(ticket.adjustedSlaEndTime.getTime() + (holdDurationInWorkingHours * 60 * 60 * 1000));
        
        await updateTicket(ticketId, {
          isOnHold: false,
          adjustedSlaEndTime: newSlaEndTime,
          holdStart: null
        });
      } else {
        // Put on hold - store current adjusted SLA time and hold start time
        await updateTicket(ticketId, {
          isOnHold: true,
          holdStart: currentTime,
          adjustedSlaEndTime: ticket.adjustedSlaEndTime // Keep the current adjusted time
        });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to toggle hold status');
      throw error;
    }
  };

  return {
    tickets,
    loading,
    error,
    addTicket,
    updateTicket,
    deleteTicket,
    toggleHold,
    clearError: () => setError(null)
  };
};
