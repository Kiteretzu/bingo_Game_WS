// errors.ts

// General Error Codes for Internal Consistency
export const ERROR_CODES = {
  APOLLO: 'APOLLO_SERVER_ERROR',
  EXPRESS: 'EXPRESS_SERVER_ERROR',
  WEBSOCKET: 'WEBSOCKET_SERVER_ERROR',
};

// Status Codes (Standard HTTP Status Codes)
export const STATUS_CODES = {
  APOLLO_SERVER_ERROR: 511,    // HTTP Status for Apollo Server Initialization Error
  EXPRESS_SERVER_ERROR: 512,   // HTTP Status for Express Server Initialization Error
  WEBSOCKET_SERVER_ERROR: 513, // HTTP Status for WebSocket Server Initialization Error
};

// General Error Messages (Optional, for better clarity)
export const MESSAGES = {
  APOLLO_SERVER_ERROR: 'Unable to initialize Apollo Server',
  EXPRESS_SERVER_ERROR: 'Unable to initialize Express Server',
  WEBSOCKET_SERVER_ERROR: 'Unable to initialize WebSocket Server',
};

