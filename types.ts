
export enum ClientStatus {
  POTENTIAL = '潜在客户',
  NEGOTIATING = '商务洽谈',
  SIGNED = '已签约',
  LOST = '已流失'
}

export enum VenueType {
  ARCADE = '电玩城',
  KTV = 'KTV',
  TRAMPOLINE = '蹦床公园',
  ESCAPE_ROOM = '密室逃脱',
  OTHER = '其他'
}

export interface FollowUpLog {
  id: string;
  date: string;
  content: string;
  type: '电话' | '面访' | '微信' | '系统演示' | '邮件' | 'WhatsApp' | 'Zoom会议';
}

export interface Client {
  id: string;
  companyName: string; // 公司全称
  venueName: string;   // 场地名称
  venueType: VenueType;
  country: string;     // 国家/地区
  contactPerson: string;
  email: string;       // 邮箱
  phone: string;
  status: ClientStatus;
  source: string;      // 客户来源 (New)
  lastFollowUp: string;
  nextFollowUp: string;
  notes: string;
  logs: FollowUpLog[];
  address: string;
  scale: string;
}

export interface DashboardStats {
  totalClients: number;
  pendingFollowUps: number;
  signedCount: number;
  conversionRate: number;
}
