export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  company?: string;
  createdAt: string;
  status: 'active' | 'suspended';
  mfaEnabled: boolean;
  planId?: string;
  balance?: number;
}

export interface SessionInfo {
  sessionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: UserRole;
  fingerprint: string;
  ip: string;
  device: string;
  browser: string;
  os: string;
  createdAt: string;
  lastSeen: string;
  isCurrent: boolean;
}

export interface RouterHealthInfo {
  name: string;
  label: string;
  labelAr: string;
  enabled: boolean;
  healthy: boolean;
  latency: number;
  totalCalls: number;
  successRate: number;
  icon: string;
  description: string;
  descriptionAr: string;
}

export interface DatabaseTable {
  name: string;
  columnsCount: number;
  rowsCount: number;
  sizeKb: number;
  columns: {
    name: string;
    type: string;
    notNull: boolean;
    primaryKey?: boolean;
    defaultValue?: any;
  }[];
  data: Record<string, any>[];
}

export interface StoredFile {
  id: string;
  name: string;
  originalName: string;
  size: number;
  mimeType: string;
  extension: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  tags?: string[];
}

export interface EnvVariable {
  key: string;
  value: string;
  isSecret: boolean;
  group: string;
  updatedAt: string;
}

export interface CommTemplate {
  id: string;
  type: 'mail' | 'sms' | 'whatsapp';
  name: string;
  title: string;
  content: string;
  subject?: string;
  variables: string[];
}

export interface SentMessage {
  id: string;
  type: 'mail' | 'sms' | 'whatsapp';
  to: string;
  subject?: string;
  content: string;
  status: 'delivered' | 'sent' | 'failed';
  at: string;
  cost?: number;
}

export interface PayPalOrder {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: 'COMPLETED' | 'PENDING' | 'REFUNDED' | 'CANCELLED';
  description: string;
  createdAt: string;
  captureId?: string;
  refundedAmount?: number;
}

export interface PayPalPlan {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  description: string;
  descriptionAr: string;
  features: string[];
  featuresAr: string[];
  popular?: boolean;
}

export interface MigrationItem {
  id: string;
  name: string;
  batch: number;
  applied: boolean;
  appliedAt?: string;
  upSql: string;
  downSql: string;
}

export interface SystemLogEntry {
  id: string;
  router: string;
  action: string;
  status: 'success' | 'failed' | 'warning';
  duration: number;
  ip: string;
  message: string;
  timestamp: string;
}
