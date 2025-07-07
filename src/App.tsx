import { useState, useEffect } from 'react';
import { FormData, Priority } from './types';
import { calculateSLA } from './utils/slaCalculations';
import { useTickets } from './hooks/useTickets';
import { Header } from './components/Header';
import { TicketForm } from './components/TicketForm';
import { TicketList } from './components/TicketList';
import { TicketGuidelines } from './components/TicketGuidelines';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { ConnectionStatus } from './components/ConnectionStatus';

function App() {
  const { 
    tickets, 
    loading, 
    error, 
    addTicket: addTicketToFirebase, 
    deleteTicket: deleteTicketFromFirebase, 
    toggleHold: toggleHoldInFirebase,
    clearError 
  } = useTickets();
  
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    ticketId: '',
    description: '',
    priority: 'P1',
    createdAt: new Date().toISOString().slice(0, 16)
  });

  // Add new ticket
  const addTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ticketId || !formData.description) return;
    
    setIsSubmitting(true);
    try {
      const createdAt = new Date(formData.createdAt);
      const slaEndTime = calculateSLA(createdAt, formData.priority);
      
      const newTicket = {
        ticketId: formData.ticketId,
        description: formData.description,
        priority: formData.priority,
        createdAt: createdAt,
        slaEndTime: slaEndTime,
        isOnHold: false,
        holdStart: null,
        adjustedSlaEndTime: slaEndTime
      };
      
      await addTicketToFirebase(newTicket);
      
      // Reset form
      setFormData({
        ticketId: '',
        description: '',
        priority: 'P1',
        createdAt: new Date().toISOString().slice(0, 16)
      });
    } catch (error) {
      console.error('Failed to add ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove ticket
  const removeTicket = async (id: string) => {
    try {
      await deleteTicketFromFirebase(id);
    } catch (error) {
      console.error('Failed to remove ticket:', error);
    }
  };

  // Toggle ticket hold status
  const toggleHold = async (id: string) => {
    try {
      await toggleHoldInFirebase(id, currentTime);
    } catch (error) {
      console.error('Failed to toggle hold status:', error);
    }
  };

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Header />
        
        {error && (
          <ErrorMessage 
            message={error} 
            onDismiss={clearError}
          />
        )}
        
        <TicketForm 
          formData={formData}
          setFormData={setFormData}
          addTicket={addTicket}
          isSubmitting={isSubmitting}
        />
        
        <TicketList 
          tickets={tickets}
          currentTime={currentTime}
          removeTicket={removeTicket}
          toggleHold={toggleHold}
        />
        
        <TicketGuidelines />
        
        <ConnectionStatus />
      </div>
    </div>
  );
}

export default App;