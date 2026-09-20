import { formatDistanceToNow, format } from 'date-fns';

export const formatRelativeTime = (date) => {
  if (!date) return '';
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(d, { addSuffix: true });
  } catch (_error) {
    return date.toString();
  }
};

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, formatStr);
  } catch (_error) {
    return date.toString();
  }
};
