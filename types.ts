
export interface Solution {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface VideoReference {
  id: string;
  type: 'Short-form' | 'Long-form';
  title: string;
  embedUrl: string;
  thumbnail: string;
}

export interface Inquiry {
  id: string;
  name: string;
  contact: string;
  email: string;
  message: string;
  date: string;
}

export interface SiteSettings {
  primaryColor: string;
  secondaryColor: string;
  heroTitle: string;
  heroSlogan: string;
  agencyName: string;
  youtubeUrl: string;
  instagramUrl: string;
  kakaoUrl: string;
}

export type AdminTab = 'content' | 'appearance' | 'leads';
