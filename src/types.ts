export interface CompanySettings {
  id: string;
  name: string;
  logo_url: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  region: string;
  instagram: string;
  facebook: string;
  footer_text: string;
  main_color: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  image_url: string;
  active: boolean;
  order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  content: string;
  category: string;
  author: string;
  created_at: string;
  active: boolean;
  featured: boolean;
  order: number;
}
