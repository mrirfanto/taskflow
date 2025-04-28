import { Priority } from '@/types/task';

export const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'low':
      return 'bg-blue-100 text-blue-700 border border-blue-700';
    case 'medium':
      return 'bg-amber-100 text-amber-700 border border-amber-700';
    case 'high':
      return 'bg-rose-100 text-rose-700 border border-rose-700';
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-700';
  }
};
