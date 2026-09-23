/**
 * Clean, user-friendly error formatter for toasts and UI.
 * Strips technical stack traces, connection strings, and cryptic network messages.
 */
export const formatErrorMessage = (err, fallback = 'Something went wrong') => {
  if (!err) return fallback;

  // Direct string input
  if (typeof err === 'string') {
    return sanitizeString(err, fallback);
  }

  // Axios or HTTP error
  if (err.response) {
    const data = err.response.data;

    // First validation error message
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      const first = data.errors[0];
      const valMsg = typeof first === 'string' ? first : first?.message || first?.msg;
      if (valMsg) return sanitizeString(valMsg, fallback);
    }

    if (data?.message) {
      return sanitizeString(data.message, fallback);
    }

    // Status code fallbacks
    switch (err.response.status) {
      case 400:
        return 'Invalid request details. Please check your input.';
      case 401:
        return 'Invalid credentials or session expired.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'Requested item was not found.';
      case 409:
        return 'Already exists. Please choose another value.';
      case 413:
        return 'File size is too large.';
      case 429:
        return 'Too many requests. Please slow down and try again.';
      case 502:
      case 503:
      case 504:
        return 'Server is warming up or busy. Please try again in a moment.';
      default:
        return 'Server encountered an issue. Please try again.';
    }
  }

  // Network or browser level error (no response received)
  if (err.request || err.code === 'ERR_NETWORK' || err.message?.toLowerCase().includes('network')) {
    return 'Unable to reach server. Please check your internet connection.';
  }

  if (err.message) {
    return sanitizeString(err.message, fallback);
  }

  return fallback;
};

const sanitizeString = (str, fallback) => {
  if (!str) return fallback;

  const lower = str.toLowerCase();

  // Database and DNS errors
  if (
    lower.includes('getaddrinfo') ||
    lower.includes('enotfound') ||
    lower.includes('econnrefused') ||
    lower.includes('mongodb') ||
    lower.includes('mongoose') ||
    lower.includes('cluster') ||
    lower.includes('timed out')
  ) {
    return 'Unable to connect to database. Please try again shortly.';
  }

  // Generic network errors
  if (
    lower.includes('network error') ||
    lower.includes('err_failed') ||
    lower.includes('failed to fetch') ||
    lower.includes('cors')
  ) {
    return 'Unable to reach server. Please try again.';
  }

  // CastError or ObjectIds
  if (lower.includes('casterror') || lower.includes('objectid')) {
    return 'Invalid item identifier.';
  }

  return str;
};

export default formatErrorMessage;
