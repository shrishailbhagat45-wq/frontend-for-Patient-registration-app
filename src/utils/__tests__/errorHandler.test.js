/**
 * Error Handler Tests
 * 
 * To run these tests, install Jest and run:
 * npm test
 */

import { classifyError, extractErrorMessage, ErrorTypes } from '../errorHandler';

describe('Error Handler', () => {
  describe('classifyError', () => {
    test('should classify 401 as AUTHENTICATION error', () => {
      const error = {
        response: { status: 401 },
      };
      expect(classifyError(error)).toBe(ErrorTypes.AUTHENTICATION);
    });

    test('should classify 403 as AUTHORIZATION error', () => {
      const error = {
        response: { status: 403 },
      };
      expect(classifyError(error)).toBe(ErrorTypes.AUTHORIZATION);
    });

    test('should classify 404 as NOT_FOUND error', () => {
      const error = {
        response: { status: 404 },
      };
      expect(classifyError(error)).toBe(ErrorTypes.NOT_FOUND);
    });

    test('should classify 422 as VALIDATION error', () => {
      const error = {
        response: { status: 422 },
      };
      expect(classifyError(error)).toBe(ErrorTypes.VALIDATION);
    });

    test('should classify 500+ as SERVER error', () => {
      const error = {
        response: { status: 500 },
      };
      expect(classifyError(error)).toBe(ErrorTypes.SERVER);
    });

    test('should classify network errors correctly', () => {
      const error = {
        message: 'Network Error',
      };
      expect(classifyError(error)).toBe(ErrorTypes.NETWORK);
    });

    test('should classify timeout errors correctly', () => {
      const error = {
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded',
      };
      expect(classifyError(error)).toBe(ErrorTypes.TIMEOUT);
    });
  });

  describe('extractErrorMessage', () => {
    test('should extract message from response.data.message', () => {
      const error = {
        response: {
          data: {
            message: 'Custom error message',
          },
        },
      };
      expect(extractErrorMessage(error)).toBe('Custom error message');
    });

    test('should handle array of messages', () => {
      const error = {
        response: {
          data: {
            message: ['Error 1', 'Error 2'],
          },
        },
      };
      expect(extractErrorMessage(error)).toBe('Error 1, Error 2');
    });

    test('should extract message from response.data.error', () => {
      const error = {
        response: {
          data: {
            error: 'Alternative error field',
          },
        },
      };
      expect(extractErrorMessage(error)).toBe('Alternative error field');
    });

    test('should fallback to error.message', () => {
      const error = {
        message: 'Network Error',
      };
      expect(extractErrorMessage(error)).toBe('Network Error');
    });

    test('should return default message for 403', () => {
      const error = {
        response: { status: 403 },
      };
      const message = extractErrorMessage(error);
      expect(message).toContain("don't have access");
    });
  });
});

// Manual Testing Instructions:
// 
// 1. Test 403 Error:
//    - Make API call that returns 403
//    - Expected: Toast shows "You don't have access to perform this action." with 🚫 icon
//
// 2. Test 401 Error:
//    - Use expired/invalid token
//    - Expected: Toast shows auth error, redirects to login, clears localStorage
//
// 3. Test Network Error:
//    - Turn off backend
//    - Expected: Retries 3 times, shows network error with 🌐 icon
//
// 4. Test Validation Error:
//    - Submit invalid form data
//    - Expected: Shows validation errors with ⚠️ icon (warning style)
