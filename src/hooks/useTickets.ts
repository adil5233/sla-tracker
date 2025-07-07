import { useState, useEffect } from 'react';
import { Ticket } from '../types';
import { 
  addTicket as addTicketToFirestore, 
  updateTicket as updateTicketInFirestore, 
  deleteTicket as deleteTicketFromFirestore,
  subscribeToTickets 
} from '../services/ticketService';

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
      if (ticket.isOnHold) {
        // Resume - adjust SLA end time based on hold duration
        const holdDuration = currentTime.getTime() - (ticket.holdStart?.getTime() || 0);
        await updateTicket(ticketId, {
          isOnHold: false,
          adjustedSlaEndTime: new Date(ticket.adjustedSlaEndTime.getTime() + holdDuration),
          holdStart: null
        });
      } else {
        // Put on hold
        await updateTicket(ticketId, {
          isOnHold: true,
          holdStart: currentTime,
          adjustedSlaEndTime: ticket.slaEndTime
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