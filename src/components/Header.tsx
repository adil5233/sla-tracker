import { Clock } from "lucide-react";

export function Header() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Clock className="w-8 h-8 text-indigo-600" />
        <h1 className="text-4xl font-bold text-gray-900">SLA Tracker</h1>
      </div>
      <p className="text-gray-600 text-lg">
        Track ticket SLAs while respecting working hours (Mon-Fri, 11:30 AM -
        9:30 PM)
      </p>
    </div>
  );
}
