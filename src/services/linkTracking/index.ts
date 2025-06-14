
// Main barrel file that re-exports everything for easy imports

// Re-export types
export * from "./types";

// Re-export services
export { getClientIP, getGeoLocation } from "./geoService";
export { detectBrowser, detectDevice } from "./deviceDetection";
export { recordClick } from "./clickService";
export { createShortUrl, getAllLinks, deleteLink } from "./linkService";
export { recordClick as trackClick } from "./clickService";
