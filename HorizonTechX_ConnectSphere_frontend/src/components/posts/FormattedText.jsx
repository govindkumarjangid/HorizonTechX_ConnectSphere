import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Parses post content and converts:
 * - @username → clickable profile link (blue)
 * - #hashtag → styled hashtag span (indigo)
 * Everything else is rendered as plain text.
 */
export const FormattedText = ({ text = '', className = '' }) => {
  if (!text) return null;

  // Split on @mentions and #hashtags while keeping the delimiters
  const parts = text.split(/(@[a-zA-Z0-9_.]+|#[a-zA-Z0-9_]+)/g);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (/^@[a-zA-Z0-9_.]+$/.test(part)) {
          const username = part.slice(1);
          return (
            <Link
              key={i}
              to={`/profile/${username}`}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </Link>
          );
        }
        if (/^#[a-zA-Z0-9_]+$/.test(part)) {
          return (
            <span
              key={i}
              className="text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline"
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

export default FormattedText;
