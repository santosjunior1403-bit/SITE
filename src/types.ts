export interface CompanySettings {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  google_business_link: string;
  opening_hours: string;
  service_region: string;
  institutional_text: string;
  logo_url: string;
  team_photo_url: string;
}

export interface HeroSection {
  id: string;
  logo_url: string;
  title: string;
  subtitle: string;
  image_url: string;
  button_text: string;
  whatsapp_number: string;
  phone: string;
  email: string;
  whatsapp_message: string;
  banner_url: string;
  primary_color: string;
  secondary_color: string;
}

export interface Service {
  id: string;
  name: string;
  short_description: string;
  full_description: string;
  category: string;
  price?: number;
  order: number;
  active: boolean;
  image_url: string;
  icon_url: string;
  whatsapp_message: string;
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  content: string;
  main_image_url: string;
  category: string;
  author: string;
  published_at: string;
  featured: boolean;
  active: boolean;
  order: number;
}

export interface Testimonial {
  id: string;
  client_name: string;
  photo_url: string;
  text: string;
  rating: number;
  google_review_url: string;
  active: boolean;
  date: string;
}

export interface Client {
  id: string;
  name: string;
  logo_url: string;
  description: string;
  client_type: 'cliente' | 'parceiro';
  active: boolean;
  order: number;
}
