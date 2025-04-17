
import { TrackedLink, LinkStats } from "@/types/linkTracking";

// Mock data for demonstration purposes
export const mockLinks: TrackedLink[] = [
  {
    id: "1",
    originalUrl: "https://telegram.me/ott_on_rent?utm_source=website&utm_medium=homepage&utm_campaign=netflix_promo",
    shortUrl: "oor.link/netflix1",
    title: "Netflix Promotion - Homepage",
    createdAt: "2025-04-10T13:45:00Z",
    utmParameters: {
      campaign: "netflix_promo",
      source: "website",
      medium: "homepage"
    },
    clicks: 145,
    clickHistory: Array.from({ length: 145 }, (_, i) => ({
      timestamp: new Date(Date.now() - (i * 3600000)).toISOString(),
      referrer: ["google.com", "facebook.com", "instagram.com", "direct"][Math.floor(Math.random() * 4)],
      device: ["desktop", "mobile", "tablet"][Math.floor(Math.random() * 3)],
      browser: ["Chrome", "Safari", "Firefox", "Edge"][Math.floor(Math.random() * 4)],
      location: ["US", "IN", "UK", "CA", "AU"][Math.floor(Math.random() * 5)]
    }))
  },
  {
    id: "2",
    originalUrl: "https://telegram.me/ott_on_rent?utm_source=instagram&utm_medium=bio&utm_campaign=prime_offer",
    shortUrl: "oor.link/prime1",
    title: "Prime Video - Instagram Bio",
    createdAt: "2025-04-11T10:15:00Z",
    utmParameters: {
      campaign: "prime_offer",
      source: "instagram",
      medium: "bio"
    },
    clicks: 87,
    clickHistory: Array.from({ length: 87 }, (_, i) => ({
      timestamp: new Date(Date.now() - (i * 4800000)).toISOString(),
      referrer: ["instagram.com", "direct"][Math.floor(Math.random() * 2)],
      device: ["mobile", "tablet"][Math.floor(Math.random() * 2)],
      browser: ["Chrome", "Safari"][Math.floor(Math.random() * 2)],
      location: ["US", "IN", "UK", "CA", "AU"][Math.floor(Math.random() * 5)]
    }))
  },
  {
    id: "3",
    originalUrl: "https://telegram.me/ott_on_rent?utm_source=email&utm_medium=newsletter&utm_campaign=crunchyroll_special",
    shortUrl: "oor.link/crunch1",
    title: "Crunchyroll Special - Newsletter",
    createdAt: "2025-04-12T16:30:00Z",
    utmParameters: {
      campaign: "crunchyroll_special",
      source: "email",
      medium: "newsletter"
    },
    clicks: 63,
    clickHistory: Array.from({ length: 63 }, (_, i) => ({
      timestamp: new Date(Date.now() - (i * 5400000)).toISOString(),
      referrer: ["gmail.com", "yahoo.com", "outlook.com", "direct"][Math.floor(Math.random() * 4)],
      device: ["desktop", "mobile", "tablet"][Math.floor(Math.random() * 3)],
      browser: ["Chrome", "Safari", "Firefox", "Edge"][Math.floor(Math.random() * 4)],
      location: ["US", "IN", "UK", "CA", "AU"][Math.floor(Math.random() * 5)]
    }))
  },
  {
    id: "4",
    originalUrl: "https://telegram.me/ott_on_rent?utm_source=twitter&utm_medium=post&utm_campaign=netflix_discount",
    shortUrl: "oor.link/netflix2",
    title: "Netflix Discount - Twitter Post",
    createdAt: "2025-04-13T09:20:00Z",
    utmParameters: {
      campaign: "netflix_discount",
      source: "twitter",
      medium: "post"
    },
    clicks: 112,
    clickHistory: Array.from({ length: 112 }, (_, i) => ({
      timestamp: new Date(Date.now() - (i * 3200000)).toISOString(),
      referrer: ["twitter.com", "direct"][Math.floor(Math.random() * 2)],
      device: ["desktop", "mobile"][Math.floor(Math.random() * 2)],
      browser: ["Chrome", "Safari", "Firefox", "Edge"][Math.floor(Math.random() * 4)],
      location: ["US", "IN", "UK", "CA", "AU"][Math.floor(Math.random() * 5)]
    }))
  },
  {
    id: "5",
    originalUrl: "https://telegram.me/ott_on_rent?utm_source=facebook&utm_medium=ad&utm_campaign=prime_deal",
    shortUrl: "oor.link/prime2",
    title: "Prime Deal - Facebook Ad",
    createdAt: "2025-04-14T14:50:00Z",
    utmParameters: {
      campaign: "prime_deal",
      source: "facebook",
      medium: "ad"
    },
    clicks: 98,
    clickHistory: Array.from({ length: 98 }, (_, i) => ({
      timestamp: new Date(Date.now() - (i * 3800000)).toISOString(),
      referrer: ["facebook.com", "direct"][Math.floor(Math.random() * 2)],
      device: ["desktop", "mobile", "tablet"][Math.floor(Math.random() * 3)],
      browser: ["Chrome", "Safari", "Firefox"][Math.floor(Math.random() * 3)],
      location: ["US", "IN", "UK", "CA", "AU"][Math.floor(Math.random() * 5)]
    }))
  }
];

export const getLinkStats = (): LinkStats => {
  const totalLinks = mockLinks.length;
  const totalClicks = mockLinks.reduce((acc, link) => acc + link.clicks, 0);
  const activeLinks = mockLinks.filter(link => link.clicks > 0).length;
  const topPerformingLinks = [...mockLinks].sort((a, b) => b.clicks - a.clicks).slice(0, 3);

  return {
    totalLinks,
    totalClicks,
    activeLinks,
    topPerformingLinks
  };
};
