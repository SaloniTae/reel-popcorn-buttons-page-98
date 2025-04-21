
// Re-export all types
export * from '@/types/linkTracking';

// Re-export the services but avoid duplicating exports from the linkTracking file
export { recordClick } from './linkTracking/clickService';
export { detectBrowser, detectDevice } from './linkTracking/deviceDetection';
export { getClientIP, getGeoLocation } from './linkTracking/geoService';

// You can add any additional helper methods specific to this service here
