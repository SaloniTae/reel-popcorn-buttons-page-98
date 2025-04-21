
export interface ClickData {
  timestamp: string;
  referrer: string;
  browser?: string;
  device?: string;
  location?: string;
  city?: string;
  region?: string;
  country?: string;
  buttonName?: string;
  ip?: string;
}

export interface UtmParameters {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

export interface TrackedLink {
  id: string;
  originalUrl: string;
  shortUrl: string;
  title: string;
  createdAt: string;
  utmParameters?: UtmParameters;
  clicks: number;
  clickHistory: ClickData[];
  linkType?: string;
  parentLandingPage?: string;
  isButton?: boolean;
}

export interface LinkStats {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  topPerformingLinks: TrackedLink[];
}
