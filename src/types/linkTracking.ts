
export interface TrackedLink {
  id: string;
  originalUrl: string;
  shortUrl: string;
  title: string;
  createdAt: string;
  utmParameters?: UtmParameters;
  clicks: number;
  clickHistory: ClickData[];
  linkType?: string; // 'redirect' or 'landing'
  parentLandingPage?: string; // Reference to parent landing page slug
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
}

export interface LinkStats {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  topPerformingLinks: TrackedLink[];
}
