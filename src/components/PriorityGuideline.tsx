import { Priority } from '../types';
import { PRIORITY_STYLES, PRIORITY_NAMES } from '../constants';

interface PriorityGuidelineProps {
  priority: Priority;
  hours: number;
}

export function PriorityGuideline({ priority, hours }: PriorityGuidelineProps) {
  const style = PRIORITY_STYLES[priority];
  const name = PRIORITY_NAMES[priority];

  return (
    <div className={`border-l-4 ${style.border} px-4 py-3 ${style.bg} rounded-r-lg`}>
      <h3 className="font-semibold text-gray-900">{priority} - {name}</h3>
      <p className="text-sm text-gray-600">{hours} working hours</p>
    </div>
  );
}