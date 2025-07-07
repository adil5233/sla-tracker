import { SLAStatus } from '../types';
import { PROGRESS_BAR_COLORS } from '../constants';

interface ProgressBarProps {
  status: SLAStatus;
  progressPercent: number;
}

export function ProgressBar({ status, progressPercent }: ProgressBarProps) {
  return (
    <div className="mt-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-500 font-medium">Progress</span>
        <span className="text-gray-700 font-medium">{Math.round(progressPercent)}%</span>
      </div>
      <div
        className="w-full bg-gray-200 rounded-full h-2 relative"
        role="progressbar"
        aria-valuenow={Math.round(progressPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="SLA Progress"
      >
        <span className="sr-only">{Math.round(progressPercent)}% complete</span>
        <div
          className={`h-2 rounded-full transition-all duration-500 ease-in-out ${PROGRESS_BAR_COLORS[status]}`}
          style={{
            width: `${progressPercent}%`,
            minWidth: progressPercent > 0 ? '0.5rem' : 0,
            backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.05) 100%)`,
            boxShadow: progressPercent === 100 ? '0 0 8px 2px rgba(34,197,94,0.4)' : undefined
          }}
        />
      </div>
    </div>
  );
}