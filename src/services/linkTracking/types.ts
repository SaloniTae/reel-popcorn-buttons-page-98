
export type LinkData = {
  id: string;
  slug: string;
  title: string;
  redirect_url: string;
  created_at: string;
  button_type?: string;
};

export type ClickDataFromDB = {
  id: string;
  link_id: string;
  timestamp: string;
  referrer?: string;
  browser?: string;
  device?: string;
  country?: string;
  region?: string;
  city?: string;
  ip?: string;
};

// Re-export the types from the main types file for convenience
export type { TrackedLink, UtmParameters, ClickData } from "@/types/linkTracking";
