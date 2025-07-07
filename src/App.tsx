import { useState, useEffect } from 'react';
import { FormData } from './types';
import { calculateSLA } from './utils/slaCalculations';
import { useTickets } from './hooks/useTickets';
import { Header } from './components/Header';
import { TicketForm } from './components/TicketForm';
import { TicketList } from './components/TicketList';
import { TicketGuidelines } from './components/TicketGuidelines';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { ConnectionStatus } from './components/ConnectionStatus';
import { PRIORITY_SLA } from './constants';
import { ticketsToCSV } from './services/ticketService';

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
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Filter tickets by search and priority
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch =
      ticket.ticketId.toLowerCase().includes(search.toLowerCase()) ||
      ticket.description.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter ? ticket.priority === priorityFilter : true;
    return matchesSearch && matchesPriority;
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

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by Ticket ID or Description..."
            className="w-full sm:w-1/2 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border transition-colors"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="w-full sm:w-48 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border transition-colors"
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            {Object.keys(PRIORITY_SLA).map(prio => (
              <option key={prio} value={prio}>{prio}</option>
            ))}
          </select>
          <button
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-6 py-3 transition-colors shadow-sm"
            onClick={() => {
              const csv = ticketsToCSV(filteredTickets);
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `tickets-${new Date().toISOString().slice(0, 10)}.csv`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            disabled={filteredTickets.length === 0}
            title={filteredTickets.length === 0 ? 'No tickets to export' : 'Export tickets to CSV'}
          >
            Export to CSV
          </button>
        </div>

        <TicketForm
          formData={formData}
          setFormData={setFormData}
          addTicket={addTicket}
          isSubmitting={isSubmitting}
        />

        <TicketList
          tickets={filteredTickets}
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