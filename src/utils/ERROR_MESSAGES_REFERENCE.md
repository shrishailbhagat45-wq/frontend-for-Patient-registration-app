# Error Messages Reference

## Error Types and User Messages

| HTTP Status | Error Type | User Message | Icon | Auto Close |
|------------|------------|--------------|------|------------|
| **No Response** | `NETWORK_ERROR` | "Network error. Please check your internet connection." | 🌐 | 7s |
| **Timeout** | `TIMEOUT_ERROR` | "Request timeout. Please try again." | 🌐 | 7s |
| **401** | `AUTHENTICATION` | "Authentication failed. Please login again." | ⚠️ | 5s (then redirect) |
| **403** | `AUTHORIZATION` | "You don't have access to perform this action." | 🚫 | 5s |
| **404** | `NOT_FOUND` | "The requested resource was not found." | ❌ | 5s |
| **400, 422** | `VALIDATION_ERROR` | "Please check your input and try again." | ⚠️ | 5s |
| **500+** | `SERVER_ERROR` | "Server error. Please try again later." | 🔧 | 6s |
| **Other 4xx** | `CLIENT_ERROR` | "Something went wrong. Please try again." | ❌ | 5s |
| **Unknown** | `UNKNOWN_ERROR` | "An unexpected error occurred." | ❌ | 5s |

## Special Behaviors

### 401 - Authentication Error
- Automatically clears localStorage (token, userId, role, clinicId)
- Redirects to `/login` after toast closes
- Does not redirect if already on login page

### 403 - Authorization Error
- Shows "You don't have access" message
- User stays on current page
- Suggests contacting administrator

### Network/Timeout Errors
- Automatically retried up to 3 times
- Exponential backoff between retries
- Only shows toast after all retries fail

### Validation Errors
- Shows as warning toast (yellow)
- Can display multiple validation messages
- Formats array of errors into readable text

## Customizing Error Messages

You can override the default messages when calling `handleError()`:

```javascript
handleError(error, {
  customMessage: 'Your custom user-friendly message here',
});
```

## Backend Error Message Handling

The error handler checks for messages in this order:

1. `customMessage` parameter (if provided)
2. `error.response.data.message` (backend message)
3. `error.response.data.error` (alternative backend field)
4. `error.message` (axios/network message)
5. Default message based on error type

### Backend Message Formats Supported

**Single message:**
```json
{
  "message": "Patient not found"
}
```

**Array of messages (validation):**
```json
{
  "message": [
    "Email is required",
    "Email must be valid"
  ]
}
```

**Error field:**
```json
{
  "error": "Insufficient permissions"
}
```

## Icon Reference

| Icon | Error Type | Meaning |
|------|-----------|---------|
| 🌐 | Network/Timeout | Connection issue |
| ⚠️ | Auth/Validation | User action needed |
| 🚫 | Authorization | Access denied |
| ❌ | Not Found/Client | Resource or request issue |
| 🔧 | Server | Backend problem |

## Examples

### 403 Error Example
```javascript
// Backend returns 403
// User sees:
// Toast: 🚫 "You don't have access to perform this action."
```

### 401 Error Example
```javascript
// Backend returns 401
// User sees:
// Toast: ⚠️ "Authentication failed. Please login again."
// After 5 seconds: Redirected to /login
// localStorage cleared
```

### Network Error Example
```javascript
// No internet connection
// System: Retries 3 times automatically
// User sees (after retries fail):
// Toast: 🌐 "Network error. Please check your internet connection."
```

### Validation Error Example
```javascript
// Backend returns 422 with validation errors
{
  "message": ["Name is required", "Phone must be 10 digits"]
}
// User sees:
// Toast: ⚠️ "Name is required, Phone must be 10 digits"
```

## Best Practices

1. **Use custom messages for better UX:**
   ```javascript
   handleError(error, {
     customMessage: 'Failed to save patient information. Please try again.',
   });
   ```

2. **Provide context for debugging:**
   ```javascript
   handleError(error, {
     context: 'Patient Registration Form',
   });
   ```

3. **For 403 errors, guide users:**
   ```javascript
   handleError(error, {
     customMessage: 'You don\'t have access to delete patients. Please contact your administrator.',
   });
   ```

4. **For validation errors, be specific:**
   ```javascript
   handleError(error, {
     customMessage: 'Please check the following fields: name, email, and phone number.',
   });
   ```
