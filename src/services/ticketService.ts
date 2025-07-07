import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  Timestamp,
  DocumentData,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Ticket } from '../types';

const COLLECTION_NAME = 'tickets';

// Convert Firestore document to Ticket type
export const convertFirestoreToTicket = (doc: DocumentData): Ticket => {
  const data = doc.data();
  return {
    id: doc.id,
    ticketId: data.ticketId,
    description: data.description,
    priority: data.priority,
    createdAt: data.createdAt.toDate(),
    slaEndTime: data.slaEndTime.toDate(),
    isOnHold: data.isOnHold || false,
    holdStart: data.holdStart ? data.holdStart.toDate() : null,
    adjustedSlaEndTime: data.adjustedSlaEndTime.toDate()
  };
};

// Convert Ticket to Firestore format
export const convertTicketToFirestore = (ticket: Omit<Ticket, 'id'>) => {
  return {
    ticketId: ticket.ticketId,
    description: ticket.description,
    priority: ticket.priority,
    createdAt: Timestamp.fromDate(ticket.createdAt),
    slaEndTime: Timestamp.fromDate(ticket.slaEndTime),
    isOnHold: ticket.isOnHold,
    holdStart: ticket.holdStart ? Timestamp.fromDate(ticket.holdStart) : null,
    adjustedSlaEndTime: Timestamp.fromDate(ticket.adjustedSlaEndTime)
  };
};

// Add a new ticket
export const addTicket = async (ticket: Omit<Ticket, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), convertTicketToFirestore(ticket));
    return docRef.id;
  } catch (error) {
    console.error('Error adding ticket:', error);
    throw new Error('Failed to add ticket');
  }
};

// Update a ticket
export const updateTicket = async (ticketId: string, updates: Partial<Ticket>): Promise<void> => {
  try {
    const ticketRef = doc(db, COLLECTION_NAME, ticketId);
    const firestoreUpdates: any = {};
    
    // Convert Date objects to Timestamps for Firestore
    Object.entries(updates).forEach(([key, value]) => {
      if (value instanceof Date) {
        firestoreUpdates[key] = Timestamp.fromDate(value);
      } else if (value !== undefined) {
        firestoreUpdates[key] = value;
      }
    });
    
    await updateDoc(ticketRef, firestoreUpdates);
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw new Error('Failed to update ticket');
  }
};

// Delete a ticket
export const deleteTicket = async (ticketId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, ticketId));
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw new Error('Failed to delete ticket');
  }
};

// Subscribe to tickets with real-time updates
export const subscribeToTickets = (
  callback: (tickets: Ticket[]) => void,
  onError?: (error: Error) => void
) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  
  return onSnapshot(
    q,
    (snapshot: QuerySnapshot) => {
      try {
        const tickets = snapshot.docs.map(convertFirestoreToTicket);
        callback(tickets);
      } catch (error) {
        console.error('Error processing tickets snapshot:', error);
        onError?.(new Error('Failed to process tickets data'));
      }
    },
    (error) => {
      console.error('Error in tickets subscription:', error);
      onError?.(new Error('Failed to sync tickets'));
    }
  );
};