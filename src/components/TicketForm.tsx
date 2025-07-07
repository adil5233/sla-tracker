import { Plus } from 'lucide-react';
import { FormData, Priority } from '../types';
import { PRIORITY_SLA } from '../constants';

interface TicketFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  addTicket: (e: React.FormEvent) => Promise<void>;
  isSubmitting?: boolean;
}

export function TicketForm({ formData, setFormData, addTicket, isSubmitting = false }: TicketFormProps) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-indigo-600" />
        Add New Ticket
      </h2>
      <form onSubmit={addTicket} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="ticketId" className="block text-sm font-medium text-gray-700 mb-2">
              Ticket ID
            </label>
            <input
              type="text"
              id="ticketId"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border transition-colors"
              value={formData.ticketId}
              onChange={(e) => setFormData({...formData, ticketId: e.target.value})}
              required
              placeholder="e.g., TICKET-001"
            />
          </div>
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              id="priority"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border transition-colors"
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value as Priority})}
            >
              {Object.entries(PRIORITY_SLA).map(([prio, hours]) => (
                <option key={prio} value={prio}>{prio} - {hours} hours</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border transition-colors"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
            placeholder="Describe the ticket..."
          />
        </div>
        
        <div>
          <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700 mb-2">
            Created At
          </label>
          <input
            type="datetime-local"
            id="createdAt"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border transition-colors"
            value={formData.createdAt}
            onChange={(e) => setFormData({...formData, createdAt: e.target.value})}
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Ticket
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}