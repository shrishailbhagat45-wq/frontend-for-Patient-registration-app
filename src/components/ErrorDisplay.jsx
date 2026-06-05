/**
 * Reusable Error Display Component
 * Shows error messages in a styled container
 * @param {Object} props
 * @param {Object} props.error - Error object
 * @param {string} props.title - Error title
 * @param {string} props.message - Custom error message
 * @param {Function} props.retry - Retry function
 * @param {string} props.className - Additional CSS classes
 */
export default function ErrorDisplay({
  error,
  title = 'Error',
  message = null,
  retry = null,
  className = '',
}) {
  // Determine the error message to display
  const errorMessage =
    message ||
    error?.message ||
    error?.response?.data?.message ||
    'An unexpected error occurred';

  return (
    <div
      className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-semibold text-red-800">{title}</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{errorMessage}</p>
          </div>
          {retry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={retry}
                className="text-sm font-medium text-red-800 hover:text-red-900 underline"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Inline Error Message Component
 * For smaller, inline error messages (e.g., form fields)
 * @param {Object} props
 * @param {string} props.message - Error message
 * @param {string} props.className - Additional CSS classes
 */
export function InlineError({ message, className = '' }) {
  if (!message) return null;

  return (
    <p className={`text-sm text-red-600 mt-1 ${className}`} role="alert">
      {message}
    </p>
  );
}

/**
 * Empty State with Error
 * For displaying errors in empty list/table states
 * @param {Object} props
 * @param {string} props.title - Error title
 * @param {string} props.message - Error message
 * @param {Function} props.retry - Retry function
 * @param {string} props.className - Additional CSS classes
 */
export function EmptyStateError({
  title = 'Something went wrong',
  message = 'We encountered an error while loading data.',
  retry = null,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <div className="text-6xl mb-4">😕</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 max-w-md">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
