export const SITE_CONTACT = {
  phone: '+1 (425) 520-729',
  email: 'neven6000@gmail.com',
  social: {
    facebook: 'https://www.facebook.com/lakeisha.newman.2025',
    instagram: 'https://www.instagram.com/nevenshopper/',
    youtube: 'https://www.youtube.com/@nevenshopper',
    tiktok: 'https://www.tiktok.com/@nevenshopper',
    linkedin: 'https://www.linkedin.com/in/lisa-goldschmidt-19482435a/',
  },
} as const;

export const SOCIAL_SHARE_URLS = {
  facebook: (pageUrl: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
  twitter: (pageUrl: string, title: string) =>
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(title)}`,
  linkedin: (pageUrl: string) =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
} as const;
