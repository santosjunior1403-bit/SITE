export interface CompanySettings {
  id: string;
  company_name: string;
  logo_url: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  cep: string;
  instagram_url: string;
  facebook_url: string;
  google_business_url: string;
  clients_attended: string;
  services_completed: string;
  customer_satisfaction: string;
  business_hours: string;
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
  secondary_banner_url?: string | null;
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

export interface GoogleAdsSettings {
  id: string;
  gtm_id: string;
  ga4_measurement_id: string;
  google_ads_conversion_id: string;
  conversion_label_whatsapp: string;
  conversion_label_phone: string;
  conversion_label_form: string;
  conversion_label_quote: string;
  track_whatsapp: boolean;
  track_phone: boolean;
  track_form: boolean;
  track_quote: boolean;
  track_page_view: boolean;
  active: boolean;
  custom_head_code: string;
  custom_body_code: string;
}
