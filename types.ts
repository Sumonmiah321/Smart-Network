
export type Page = 'dashboard' | 'clients' | 'billing' | 'mikrotik' | 'vouchers' | 'reports' | 'settings' | 'hotspot_page' | 'support';
export type Language = 'bn' | 'en' | 'hi' | 'zh' | 'ar' | 'ja' | 'id';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  macAddress?: string;
  type: 'PPPoE' | 'Hotspot';
  plan: string;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Disabled';
  balance: number;
  joinDate: string;
  expiryDate: string;
}

export interface LoginConfig {
  welcomeMessage: string;
  bgType: 'solid' | 'gradient' | 'image';
  bgColor: string;
  bgGradient: string; // CSS gradient string
  bgImage: string;
  overlayPattern: 'none' | 'dots' | 'mesh' | 'circuit';
  cardOpacity: number;
  cardBlur: number;
  cardRadius: number;
  primaryColor: string; // Button & Accents
  headerTextColor: string;
  bodyTextColor: string;
  showBranding: boolean;
}

export interface HotspotDesignConfig extends LoginConfig {
  footerText: string;
  showPriceList: boolean;
  loginMode: 'voucher' | 'userpass';
}

export interface CompanySettings {
  name: string;
  menuLogo: string;
  loginLogo: string;
  voucherLogo: string;
  profilePic: string;
  hotspotLogo: string;
  address: string;
  phone: string;
  language: Language;
  currency: string;
  currencySymbol: string;
  loginConfig: LoginConfig;
  hotspotConfig: HotspotDesignConfig;
}

export interface VoucherTemplate {
  backgroundColor: string;
  secondaryColor: string;
  textColor: string;
  showLogo: boolean;
  showQR: boolean;
  pattern: 'none' | 'dots' | 'lines' | 'circuit' | 'mesh';
  borderStyle: 'none' | 'solid' | 'dashed' | 'double';
  layout: 'classic' | 'modern' | 'minimal' | 'gradient';
}
// Rest of the interfaces remain same...
export interface VoucherCard { id: string; code: string; serial: string; plan: string; price: number; validity: string; status: 'Unused' | 'Used' | 'Expired'; createdAt: string; mobile?: string; design: VoucherTemplate; }
export interface SavedVoucherTemplate extends VoucherTemplate { id: string; templateName: string; createdAt: string; }
export interface MikrotikConfig { id: string; name: string; ip: string; username: string; status: 'Connected' | 'Disconnected'; }
export interface SupportTicket { id: string; clientId: string; clientName: string; subject: string; description: string; priority: 'Urgent' | 'Medium' | 'Low'; status: 'Open' | 'Processing' | 'Resolved'; createdAt: string; category: 'Internet Slow' | 'No Link' | 'Billing' | 'Technical' | 'Other'; }

// Added missing interfaces
export interface Invoice {
  id: string;
  client: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  method: string;
}

export interface HotspotPackage {
  id: string;
  name: string;
  price: number;
  validity: string;
  limit: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'Maintenance' | 'Alert' | 'News';
  active: boolean;
  createdAt: string;
}