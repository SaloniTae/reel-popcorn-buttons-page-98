
export interface TrackedLink {
  id: string;
  originalUrl: string;
  shortUrl: string;
  title: string;
  createdAt: string;
  utmParameters?: UtmParameters;
  clicks: number;
  clickHistory: ClickData[];
  linkType?: string; // 'redirect', 'landing', or button types like 'primary', 'streaming'
  parentLandingPage?: string; // Reference to parent landing page slug
  buttonType?: string; // 'buyNow', 'netflix', 'prime', 'crunchyroll'
  isButton?: boolean; // Indicates if this link is a button within a landing page
}

export interface UtmParameters {
  campaign?: string;
  source?: string;
  medium?: string;
  content?: string;
  term?: string;
}

export interface ClickData {
  timestamp: string;
  referrer?: string;
  browser?: string;
  device?: string;
  location?: string;
  buttonName?: string; // Added to track which button was clicked
}

export interface LinkStats {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  topPerformingLinks: TrackedLink[];
}
