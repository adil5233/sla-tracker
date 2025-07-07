import { Priority } from '../types';
import { PRIORITY_COLORS } from '../constants';

interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[priority]}`}>
      {priority}
    </span>
  );
}