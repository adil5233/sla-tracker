import { Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { logout, onAuthStateChanged } from "../services/ticketService";

export function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const unsub = onAuthStateChanged((user) => setLoggedIn(!!user));
    return () => unsub();
  }, []);
  return (
    <div className="text-center mb-8 relative">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Clock className="w-8 h-8 text-indigo-600" />
        <h1 className="text-4xl font-bold text-gray-900">SLA Tracker</h1>
        {loggedIn && (
          <button
            className="absolute right-0 top-0 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded px-4 py-2 text-sm transition-colors"
            onClick={() => logout()}
            title="Logout"
          >
            Logout
          </button>
        )}
      </div>
      <p className="text-gray-600 text-lg">
        Track ticket SLAs while respecting working hours (Mon-Fri, 11:30 AM -
        9:30 PM)
      </p>
    </div>
  );
}
