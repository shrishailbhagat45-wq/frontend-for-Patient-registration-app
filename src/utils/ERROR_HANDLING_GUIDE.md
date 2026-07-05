# Centralized Error Handling Guide

## Overview

This application uses a centralized error handling system to provide consistent error management across all components. The system includes:

1. **Error Handler Utility** (`errorHandler.js`) - Core error handling logic
2. **Axios Instance** (`axiosInstance.js`) - Centralized HTTP client with interceptors
3. **Error Boundary** (`ErrorBoundary.jsx`) - React error boundary for catching component errors
4. **Error Display Components** (`ErrorDisplay.jsx`) - Reusable UI components for displaying errors

## Quick Start

### 1. Using Error Handler in Components

```javascript
import { handleError } from '../utils/errorHandler';

function MyComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const result = await someApiCall();
      setData(result);
    } catch (err) {
      // Centralized error handling with toast notification
      const errorDetails = handleError(err, {
        context: 'MyComponent',
        customMessage: 'Failed to load data',
        showToast: true,
      });
      setError(errorDetails.message);
    }
  };

  return (
    <div>
      {error && <ErrorDisplay error={{ message: error }} retry={fetchData} />}
      {/* Your component UI */}
    </div>
  );
}
```

### 2. Using withErrorHandling Helper

```javascript
import { withErrorHandling } from '../utils/errorHandler';

async function loadData() {
  const { success, data, error } = await withErrorHandling(
    () => fetchDataFromAPI(),
    {
      context: 'Data Loading',
      customMessage: 'Failed to fetch data',
    }
  );

  if (success) {
    console.log('Data loaded:', data);
  } else {
    console.log('Error occurred:', error.message);
  }
}
```

### 3. Using Centralized Axios Instance

Update your API files to use the centralized axios instance:

```javascript
// Before
import axios from 'axios';
const api = axios.create({ baseURL: '...' });

// After
import api from '../utils/axiosInstance';

// Token and error handling is automatic!
export async function getPatients() {
  const response = await api.get('/patients');
  return response.data;
}
```

### 4. Adding Error Boundary to Your App

Wrap your app or specific routes with ErrorBoundary:

```javascript
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}
```

### 5. Using Error Display Components

```javascript
import ErrorDisplay, { InlineError, EmptyStateError } from './components/ErrorDisplay';

// Full error display with retry
<ErrorDisplay
  error={error}
  title="Failed to Load"
  retry={handleRetry}
/>

// Inline error (for forms)
<InlineError message={validationError} />

// Empty state error
<EmptyStateError
  title="No data available"
  message="We couldn't load the data. Please try again."
  retry={handleRetry}
/>
```

## Error Types

The system classifies errors into these types:

- `NETWORK_ERROR` - Connection issues
- `AUTH_ERROR` - Authentication failures (401)
- `AUTHORIZATION_ERROR` - Permission issues (403)
- `VALIDATION_ERROR` - Invalid input (400, 422)
- `NOT_FOUND` - Resource not found (404)
- `SERVER_ERROR` - Server issues (500+)
- `CLIENT_ERROR` - Client-side issues (4xx)
- `TIMEOUT_ERROR` - Request timeout
- `UNKNOWN_ERROR` - Unclassified errors

## Features

### Automatic Token Management
- Tokens are automatically attached to all requests
- 401 errors automatically clear auth data and redirect to login

### Automatic Retries
- Network errors and 5xx errors are retried up to 3 times
- Exponential backoff between retries

### Toast Notifications
- Errors automatically show toast notifications
- Different styles for different error types
- Authentication errors redirect after toast closes

### Error Logging
- All errors are logged to console in development
- Can be extended to send to monitoring services (Sentry, LogRocket)

### Validation Error Formatting
- Handles array and object validation errors
- Formats them into readable messages

## Migration Guide

### Step 1: Update API Files

Replace axios instances with the centralized one:

```javascript
// Old pattern
import axios from 'axios';
const api = axios.create({...});
api.interceptors.request.use(...);

// New pattern
import api from '../utils/axiosInstance';
// That's it! Interceptors are already configured
```

### Step 2: Update Error Handling in Components

```javascript
// Old pattern
catch (error) {
  console.error(error);
  toast.error(error.message || 'Something went wrong');
}

// New pattern
catch (error) {
  handleError(error, {
    context: 'ComponentName',
    customMessage: 'Failed to perform action',
  });
}
```

### Step 3: Use Error Display Components

Replace custom error UI with standardized components:

```javascript
// Old pattern
{error && (
  <div className="bg-red-50 p-4">
    <p className="text-red-600">{error}</p>
  </div>
)}

// New pattern
{error && <ErrorDisplay error={{ message: error }} retry={handleRetry} />}
```

## Best Practices

1. **Always use handleError for API errors** - Ensures consistent error handling and logging
2. **Provide context** - Always specify the context where the error occurred
3. **Use custom messages** - Provide user-friendly messages instead of raw error text
4. **Handle retries gracefully** - Pass retry functions to error display components
5. **Don't duplicate toast messages** - If using handleError with showToast:true, don't show additional toasts
6. **Use Error Boundary for unexpected errors** - Wrap your app to catch unexpected React errors

## Advanced Usage

### Custom Error Callbacks

```javascript
handleError(error, {
  context: 'Payment Processing',
  onError: (error, errorType, errorMessage) => {
    // Custom logic after error handling
    if (errorType === 'VALIDATION_ERROR') {
      // Highlight form fields
    }
  },
});
```

### Disabling Toast Notifications

```javascript
handleError(error, {
  showToast: false, // Handle UI display manually
});
```

### Formatting Validation Errors

```javascript
import { formatValidationErrors } from '../utils/errorHandler';

const formatted = formatValidationErrors({
  email: ['Email is required', 'Email must be valid'],
  password: ['Password is too short'],
});
// Result: "email: Email is required, Email must be valid\npassword: Password is too short"
```

## Future Enhancements

- [ ] Integration with Sentry/LogRocket for production error monitoring
- [ ] Error replay functionality
- [ ] Offline error queueing
- [ ] User error reporting feature
- [ ] Analytics on error frequency and types
