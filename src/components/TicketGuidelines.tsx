import { Info } from 'lucide-react';
import { PRIORITY_SLA } from '../constants';
import { Priority } from '../types';
import { PriorityGuideline } from './PriorityGuideline';

export function TicketGuidelines() {
  return (
    <div className="mt-8 bg-white shadow-lg rounded-xl p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <Info className="w-5 h-5 text-indigo-600" />
        SLA Guidelines
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {Object.entries(PRIORITY_SLA).map(([priority, hours]) => (
          <PriorityGuideline
            key={priority}
            priority={priority as Priority}
            hours={hours}
          />
        ))}
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>Working Hours:</strong> Monday to Friday, 11:30 AM - 9:30 PM</p>
          <p><strong>SLA Calculation:</strong> Excludes weekends and non-working hours</p>
          <p><strong>Hold Function:</strong> Pauses SLA timer and extends deadline when resumed</p>
        </div>
      </div>
    </div>
  );
}