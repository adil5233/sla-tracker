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
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${PROGRESS_BAR_COLORS[status]}`}
          style={{width: `${progressPercent}%`}}
        />
      </div>
    </div>
  );
}