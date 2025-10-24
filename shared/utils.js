// Content Studio Shared Utilities

/**
 * Generate a unique ID
 * @returns {string} Unique identifier
 */
export const generateId = () => {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format date to ISO string
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return new Date(date).toISOString();
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize text content
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export const sanitizeText = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

/**
 * Validate file size
 * @param {number} size - File size in bytes
 * @param {number} maxSize - Maximum allowed size in bytes
 * @returns {boolean} True if file size is valid
 */
export const isValidFileSize = (size, maxSize = 50 * 1024 * 1024) => {
  return size <= maxSize;
};

/**
 * Get file extension from filename
 * @param {string} filename - Filename to extract extension from
 * @returns {string} File extension
 */
export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

/**
 * Validate file type
 * @param {string} filename - Filename to validate
 * @param {string[]} allowedTypes - Array of allowed file types
 * @returns {boolean} True if file type is allowed
 */
export const isValidFileType = (filename, allowedTypes) => {
  const extension = getFileExtension(filename);
  return allowedTypes.includes(extension);
};

/**
 * Create API response object
 * @param {boolean} success - Success status
 * @param {*} data - Response data
 * @param {string} message - Response message
 * @param {number} statusCode - HTTP status code
 * @returns {object} Formatted API response
 */
export const createApiResponse = (success, data = null, message = '', statusCode = 200) => {
  return {
    success,
    data,
    message,
    statusCode,
    timestamp: new Date().toISOString()
  };
};

/**
 * Handle API errors
 * @param {Error} error - Error object
 * @param {string} message - Custom error message
 * @returns {object} Formatted error response
 */
export const handleApiError = (error, message = 'An error occurred') => {
  console.error('API Error:', error);
  return createApiResponse(false, null, message, 500);
};

/**
 * Validate required fields
 * @param {object} data - Data to validate
 * @param {string[]} requiredFields - Array of required field names
 * @returns {object} Validation result
 */
export const validateRequiredFields = (data, requiredFields) => {
  const missing = requiredFields.filter(field => !data[field]);
  return {
    isValid: missing.length === 0,
    missingFields: missing
  };
};

/**
 * Generate pagination metadata
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @returns {object} Pagination metadata
 */
export const generatePagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};
