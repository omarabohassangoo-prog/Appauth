import {
  User,
  SessionInfo,
  RouterHealthInfo,
  DatabaseTable,
  StoredFile,
  EnvVariable,
  CommTemplate,
  SentMessage,
  PayPalOrder,
  PayPalPlan,
  MigrationItem,
  SystemLogEntry,
} from '../types';

const ADMIN_AVATAR = '/src/assets/images/admin_avatar_1790269133181.jpg';
const USER_AVATAR = '/src/assets/images/user_avatar_1790269144483.jpg';

// Storage Keys
const USERS_KEY = 'omni_users';
const SESSIONS_KEY = 'omni_sessions';
const DB_TABLES_KEY = 'omni_db_tables';
const FILES_KEY = 'omni_files';
const ENV_KEY = 'omni_env_vars';
const TEMPLATES_KEY = 'omni_templates';
const MESSAGES_KEY = 'omni_messages';
const ORDERS_KEY = 'omni_orders';
const MIGRATIONS_KEY = 'omni_migrations';
const LOGS_KEY = 'omni_logs';
const CURRENT_USER_KEY = 'omni_current_user';

// Initial Seeds
const DEFAULT_USERS: User[] = [
  {
    id: 'usr-admin-01',
    name: 'عبدالله السعيد',
    email: 'admin@omnirouter.io',
    role: 'admin',
    avatar: ADMIN_AVATAR,
    phone: '+966501234567',
    company: 'Omni Systems Global',
    createdAt: '2026-01-15T10:00:00Z',
    status: 'active',
    mfaEnabled: true,
    planId: 'plan-enterprise',
    balance: 5400.0,
  },
  {
    id: 'usr-demo-02',
    name: 'سارة المنصور',
    email: 'user@omnirouter.io',
    role: 'user',
    avatar: USER_AVATAR,
    phone: '+966559876543',
    company: 'Apex Cloud Logistics',
    createdAt: '2026-02-01T14:30:00Z',
    status: 'active',
    mfaEnabled: false,
    planId: 'plan-pro',
    balance: 850.5,
  },
  {
    id: 'usr-client-03',
    name: 'طارق الأحمد',
    email: 'tariq@clientcorp.com',
    role: 'user',
    phone: '+966541122334',
    company: 'Horizon Media',
    createdAt: '2026-02-18T09:15:00Z',
    status: 'active',
    mfaEnabled: false,
    planId: 'plan-starter',
    balance: 120.0,
  },
];

const DEFAULT_TABLES: DatabaseTable[] = [
  {
    name: 'users',
    columnsCount: 7,
    rowsCount: 3,
    sizeKb: 24,
    columns: [
      { name: 'id', type: 'VARCHAR(36)', notNull: true, primaryKey: true },
      { name: 'name', type: 'VARCHAR(255)', notNull: true },
      { name: 'email', type: 'VARCHAR(255)', notNull: true },
      { name: 'role', type: 'VARCHAR(50)', notNull: true },
      { name: 'status', type: 'VARCHAR(50)', notNull: true, defaultValue: 'active' },
      { name: 'balance', type: 'DECIMAL(10,2)', notNull: false, defaultValue: '0.00' },
      { name: 'created_at', type: 'TIMESTAMP', notNull: true },
    ],
    data: [
      { id: 'usr-admin-01', name: 'عبدالله السعيد', email: 'admin@omnirouter.io', role: 'admin', status: 'active', balance: 5400.0, created_at: '2026-01-15' },
      { id: 'usr-demo-02', name: 'سارة المنصور', email: 'user@omnirouter.io', role: 'user', status: 'active', balance: 850.5, created_at: '2026-02-01' },
      { id: 'usr-client-03', name: 'طارق الأحمد', email: 'tariq@clientcorp.com', role: 'user', status: 'active', balance: 120.0, created_at: '2026-02-18' },
    ],
  },
  {
    name: 'orders',
    columnsCount: 6,
    rowsCount: 4,
    sizeKb: 18,
    columns: [
      { name: 'id', type: 'VARCHAR(36)', notNull: true, primaryKey: true },
      { name: 'user_id', type: 'VARCHAR(36)', notNull: true },
      { name: 'amount', type: 'DECIMAL(10,2)', notNull: true },
      { name: 'currency', type: 'VARCHAR(3)', notNull: true, defaultValue: 'USD' },
      { name: 'status', type: 'VARCHAR(50)', notNull: true },
      { name: 'created_at', type: 'TIMESTAMP', notNull: true },
    ],
    data: [
      { id: 'ORD-9821', user_id: 'usr-demo-02', amount: 149.0, currency: 'USD', status: 'COMPLETED', created_at: '2026-03-01' },
      { id: 'ORD-9822', user_id: 'usr-demo-02', amount: 29.0, currency: 'USD', status: 'COMPLETED', created_at: '2026-03-05' },
      { id: 'ORD-9823', user_id: 'usr-client-03', amount: 49.0, currency: 'USD', status: 'PENDING', created_at: '2026-03-10' },
      { id: 'ORD-9824', user_id: 'usr-admin-01', amount: 499.0, currency: 'USD', status: 'COMPLETED', created_at: '2026-03-12' },
    ],
  },
  {
    name: 'api_tokens',
    columnsCount: 5,
    rowsCount: 2,
    sizeKb: 12,
    columns: [
      { name: 'id', type: 'VARCHAR(36)', notNull: true, primaryKey: true },
      { name: 'user_id', type: 'VARCHAR(36)', notNull: true },
      { name: 'token_hash', type: 'VARCHAR(64)', notNull: true },
      { name: 'scope', type: 'VARCHAR(100)', notNull: true },
      { name: 'expires_at', type: 'TIMESTAMP', notNull: false },
    ],
    data: [
      { id: 'tok-01', user_id: 'usr-admin-01', token_hash: '8f7a...3d9c', scope: 'admin:all', expires_at: '2027-01-01' },
      { id: 'tok-02', user_id: 'usr-demo-02', token_hash: '2b4e...11aa', scope: 'gateway:read', expires_at: '2026-12-31' },
    ],
  },
];

const DEFAULT_ENV: EnvVariable[] = [
  { key: 'DB_DRIVER', value: 'postgres', isSecret: false, group: 'DATABASE', updatedAt: '2026-03-01' },
  { key: 'DATABASE_URL', value: 'postgresql://omni_user:p@ssw0rd99@db.omnirouter.io:5432/omni_prod', isSecret: true, group: 'DATABASE', updatedAt: '2026-03-01' },
  { key: 'DB_POOL_MAX', value: '25', isSecret: false, group: 'DATABASE', updatedAt: '2026-03-01' },
  { key: 'SESSION_SECRET', value: 'sk_live_99a8b7c6d5e4f3a2b1_omni_sess_key', isSecret: true, group: 'SECURITY', updatedAt: '2026-02-15' },
  { key: 'SESSION_MAX_AGE', value: '604800', isSecret: false, group: 'SECURITY', updatedAt: '2026-02-15' },
  { key: 'GATEWAY_RATE_LIMIT', value: '1200', isSecret: false, group: 'GATEWAY', updatedAt: '2026-03-10' },
  { key: 'GATEWAY_API_KEY', value: 'gw_key_883300aa1199ff', isSecret: true, group: 'GATEWAY', updatedAt: '2026-03-10' },
  { key: 'FILE_PROVIDER', value: 's3', isSecret: false, group: 'STORAGE', updatedAt: '2026-02-20' },
  { key: 'S3_BUCKET', value: 'omnirouter-vault-storage-eu', isSecret: false, group: 'STORAGE', updatedAt: '2026-02-20' },
  { key: 'AWS_ACCESS_KEY_ID', value: 'AKIAIOSFODNN7EXAMPLE', isSecret: true, group: 'STORAGE', updatedAt: '2026-02-20' },
  { key: 'MAIL_PROVIDER', value: 'resend', isSecret: false, group: 'COMMUNICATION', updatedAt: '2026-02-10' },
  { key: 'MAIL_API_KEY', value: 're_123456789_abcdefg', isSecret: true, group: 'COMMUNICATION', updatedAt: '2026-02-10' },
  { key: 'WHATSAPP_PROVIDER', value: 'meta', isSecret: false, group: 'COMMUNICATION', updatedAt: '2026-02-10' },
  { key: 'SMS_PROVIDER', value: 'twilio', isSecret: false, group: 'COMMUNICATION', updatedAt: '2026-02-10' },
  { key: 'PAYPAL_MODE', value: 'live', isSecret: false, group: 'PAYMENT', updatedAt: '2026-03-05' },
  { key: 'PAYPAL_CLIENT_ID', value: 'AaBbCcDdEeFf112233445566778899', isSecret: true, group: 'PAYMENT', updatedAt: '2026-03-05' },
];

const DEFAULT_FILES: StoredFile[] = [
  {
    id: 'f-01',
    name: 'enterprise_contract_2026.pdf',
    originalName: 'عقد_الخدمة_المؤسسية_2026.pdf',
    size: 2450000,
    mimeType: 'application/pdf',
    extension: '.pdf',
    url: 'https://example.com/files/contract.pdf',
    uploadedAt: '2026-03-01T11:20:00Z',
    uploadedBy: 'usr-admin-01',
    tags: ['contract', 'legal', '2026'],
  },
  {
    id: 'f-02',
    name: 'system_architecture_diagram.png',
    originalName: 'مخطط_البنية_التحتية_للرواترات.png',
    size: 1850000,
    mimeType: 'image/png',
    extension: '.png',
    url: 'https://example.com/files/arch.png',
    uploadedAt: '2026-03-04T15:45:00Z',
    uploadedBy: 'usr-admin-01',
    tags: ['diagram', 'architecture'],
  },
  {
    id: 'f-03',
    name: 'quarterly_financial_report.xlsx',
    originalName: 'التقرير_المالي_الربع_الأول.xlsx',
    size: 780000,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extension: '.xlsx',
    url: 'https://example.com/files/finance.xlsx',
    uploadedAt: '2026-03-10T09:00:00Z',
    uploadedBy: 'usr-demo-02',
    tags: ['finance', 'report', 'q1'],
  },
];

const DEFAULT_TEMPLATES: CommTemplate[] = [
  {
    id: 'tpl-01',
    type: 'mail',
    name: 'welcome_email',
    title: 'رسالة الترحيب بالمستخدم الجديد',
    subject: 'مرحباً بك في OmniRouter Suite - تم تفعيل حسابك بنجاح',
    content: 'عزيزي {{name}}،\n\nنرحب بك في منصة OmniRouter المتكاملة. يمكنك الآن الوصول إلى لوحة التحكم والبدء في استخدام جميع الخدمات المتاحة.\n\nرابط الدخول: {{login_link}}\n\nمع تحيات فريق الدعم الفني.',
    variables: ['name', 'login_link'],
  },
  {
    id: 'tpl-02',
    type: 'whatsapp',
    name: 'order_receipt',
    title: 'إشعار تأكيد الدفع والطلب',
    content: 'مرحباً {{name}} 👋\nتم استلام دفعتك بنجاح للطلب رقم #{{order_id}} بمبلغ {{amount}} دولار.\n\nيمكنك تحميل الفاتورة مباشرة من لوحة تحكمك.\nشكراً لثقتكم بنا! ✨',
    variables: ['name', 'order_id', 'amount'],
  },
  {
    id: 'tpl-03',
    type: 'sms',
    name: 'otp_verification',
    title: 'رمز التحقق السريع OTP',
    content: 'رمز التحقق الخاص بك هو: {{code}}\nصالح للاستخدام لمدة 5 دقائق فقط. لا تشارك هذا الرمز مع أي شخص.',
    variables: ['code'],
  },
];

const DEFAULT_ORDERS: PayPalOrder[] = [
  {
    id: 'pay-ord-001',
    orderNumber: 'ORD-2026-091',
    userId: 'usr-demo-02',
    userName: 'سارة المنصور',
    userEmail: 'user@omnirouter.io',
    amount: 149.0,
    currency: 'USD',
    status: 'COMPLETED',
    description: 'اشتراك الباقة الاحترافية Pro Plan (سنوي)',
    createdAt: '2026-03-01T14:20:00Z',
    captureId: 'CAP-998811AA',
  },
  {
    id: 'pay-ord-002',
    orderNumber: 'ORD-2026-092',
    userId: 'usr-client-03',
    userName: 'طارق الأحمد',
    userEmail: 'tariq@clientcorp.com',
    amount: 49.0,
    currency: 'USD',
    status: 'COMPLETED',
    description: 'شحن رصيد رسائل SMS و WhatsApp',
    createdAt: '2026-03-08T10:15:00Z',
    captureId: 'CAP-554422BB',
  },
  {
    id: 'pay-ord-003',
    orderNumber: 'ORD-2026-093',
    userId: 'usr-demo-02',
    userName: 'سارة المنصور',
    userEmail: 'user@omnirouter.io',
    amount: 29.0,
    currency: 'USD',
    status: 'COMPLETED',
    description: 'مساحة تخزين سحابية إضافية 100GB',
    createdAt: '2026-03-15T18:40:00Z',
    captureId: 'CAP-112233CC',
  },
];

const DEFAULT_MIGRATIONS: MigrationItem[] = [
  {
    id: 'mig-001',
    name: '20260101_init_users_and_roles',
    batch: 1,
    applied: true,
    appliedAt: '2026-01-01T00:00:00Z',
    upSql: 'CREATE TABLE users (id VARCHAR(36) PRIMARY KEY, name VARCHAR(255), email VARCHAR(255) UNIQUE, role VARCHAR(50));',
    downSql: 'DROP TABLE IF EXISTS users;',
  },
  {
    id: 'mig-002',
    name: '20260201_create_orders_table',
    batch: 1,
    applied: true,
    appliedAt: '2026-02-01T00:00:00Z',
    upSql: 'CREATE TABLE orders (id VARCHAR(36) PRIMARY KEY, user_id VARCHAR(36), amount DECIMAL(10,2), status VARCHAR(50));',
    downSql: 'DROP TABLE IF EXISTS orders;',
  },
  {
    id: 'mig-003',
    name: '20260301_create_audit_logs_and_sessions',
    batch: 2,
    applied: true,
    appliedAt: '2026-03-01T00:00:00Z',
    upSql: 'CREATE TABLE sessions (id VARCHAR(64) PRIMARY KEY, user_id VARCHAR(36), ip VARCHAR(45), fingerprint VARCHAR(64));',
    downSql: 'DROP TABLE IF EXISTS sessions;',
  },
  {
    id: 'mig-004',
    name: '20260315_add_mfa_and_balances',
    batch: 3,
    applied: false,
    upSql: 'ALTER TABLE users ADD COLUMN mfa_enabled BOOLEAN DEFAULT FALSE, ADD COLUMN balance DECIMAL(10,2) DEFAULT 0.0;',
    downSql: 'ALTER TABLE users DROP COLUMN mfa_enabled, DROP COLUMN balance;',
  },
];

export const PAYPAL_PLANS: PayPalPlan[] = [
  {
    id: 'plan-starter',
    name: 'Starter Plan',
    nameAr: 'باقة المبتدئين',
    price: 19,
    currency: 'USD',
    interval: 'month',
    description: 'Essential router access for small teams and prototyping.',
    descriptionAr: 'وصول أساسي للرواترات للفرق الناشئة والتجارب السريعة.',
    features: [
      '50,000 API calls / month',
      'Database queries & migrations',
      '5GB File Storage',
      '500 Emails & 100 SMS / month',
      'Standard Community Support',
    ],
    featuresAr: [
      '50,000 استدعاء API شهرياً',
      'استعلامات قواعد البيانات والهجرات',
      'مساحة تخزين 5 جيجابايت',
      '500 بريد إلكتروني و 100 رسالة نصية',
      'دعم فني قياسي',
    ],
  },
  {
    id: 'plan-pro',
    name: 'Professional Plan',
    nameAr: 'الباقة الاحترافية',
    price: 49,
    currency: 'USD',
    interval: 'month',
    popular: true,
    description: 'High-throughput architecture for fast-growing companies.',
    descriptionAr: 'بنية متقدمة عالية الأداء للشركات المتنامية والأنظمة الحية.',
    features: [
      '500,000 API calls / month',
      'Full Multi-Driver Database suite',
      '50GB S3/Cloud Storage',
      '5,000 Emails, 1,000 SMS & WhatsApp',
      'PayPal Webhooks & Automated Invoicing',
      'Session Fingerprinting & Rate-Limiting',
      'Priority 24/7 SLA Support',
    ],
    featuresAr: [
      '500,000 استدعاء API شهرياً',
      'دعم كامل لجميع قواعد البيانات والـ Transactions',
      'مساحة تخزين سحابية 50 جيجابايت',
      '5,000 بريد و 1,000 رسالة SMS و WhatsApp',
      'ربط PayPal التلقائي والفواتير الذكية',
      'بصمة المتصفح المتقدمة وتحديد معدل الطلبات',
      'دعم فني متميز على مدار الساعة',
    ],
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise Plan',
    nameAr: 'باقة المؤسسات',
    price: 199,
    currency: 'USD',
    interval: 'month',
    description: 'Custom cluster routing, dedicated SLA, and unlimited throughput.',
    descriptionAr: 'توجيه مخصص، خوادم معزولة، ومعدل استدعاءات غير محدود.',
    features: [
      'Unlimited API calls & Gateway throughput',
      'Custom Storage Clusters & Multi-region failover',
      '1TB Encrypted Vault Storage',
      'Unlimited Mail/WhatsApp/SMS pipelines',
      'Dedicated Migration Architect & Custom Webhooks',
      'Full Audit Logging & RBAC Access Matrix',
    ],
    featuresAr: [
      'استدعاءات غير محدودة وبدون قيود سرعة',
      'كلاستر مخصص مع توزيع جغرافي متعدد',
      'مساحة مشفرة 1 تيرابايت',
      'قنوات بريد وواتساب وSMS غير محدودة',
      'مهندس هجرات مخصص وWebhooks مخصصة',
      'سجل تدقيق أمني شامل وصلاحيات متعددة المستويات',
    ],
  },
];

class RouterEngineService {
  private getStorage<T>(key: string, defaultVal: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to save storage for ${key}:`, e);
    }
  }

  // --- Auth & Users ---
  getUsers(): User[] {
    return this.getStorage(USERS_KEY, DEFAULT_USERS);
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.unshift(user);
    }
    this.setStorage(USERS_KEY, users);
  }

  deleteUser(id: string): void {
    const users = this.getUsers().filter((u) => u.id !== id);
    this.setStorage(USERS_KEY, users);
  }

  getCurrentUser(): User | null {
    return this.getStorage(CURRENT_USER_KEY, DEFAULT_USERS[0]);
  }

  setCurrentUser(user: User | null): void {
    this.setStorage(CURRENT_USER_KEY, user);
  }

  // --- Sessions & Security ---
  getSessions(): SessionInfo[] {
    const stored = this.getStorage<SessionInfo[]>(SESSIONS_KEY, []);
    if (stored.length === 0) {
      const initial: SessionInfo[] = [
        {
          sessionId: 'sess-current-admin-token',
          userId: 'usr-admin-01',
          userName: 'عبدالله السعيد',
          userEmail: 'admin@omnirouter.io',
          role: 'admin',
          fingerprint: 'sha256:7f9a2e31bc8849...',
          ip: '192.168.1.105 (Riyadh, SA)',
          device: 'MacBook Pro 16" (Apple Silicon)',
          browser: 'Chrome 134.0.0.0',
          os: 'macOS 15.3',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          lastSeen: 'الآن (نشطة)',
          isCurrent: true,
        },
        {
          sessionId: 'sess-mobile-user-token',
          userId: 'usr-demo-02',
          userName: 'سارة المنصور',
          userEmail: 'user@omnirouter.io',
          role: 'user',
          fingerprint: 'sha256:4b119e00cf7782...',
          ip: '212.57.198.42 (Jeddah, SA)',
          device: 'iPhone 16 Pro Max',
          browser: 'Safari Mobile 18.2',
          os: 'iOS 18.2',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          lastSeen: 'منذ ساعتين',
          isCurrent: false,
        },
      ];
      this.setStorage(SESSIONS_KEY, initial);
      return initial;
    }
    return stored;
  }

  revokeSession(sessionId: string): void {
    const sessions = this.getSessions().filter((s) => s.sessionId !== sessionId);
    this.setStorage(SESSIONS_KEY, sessions);
    this.addLog('session', 'SESSION_DESTROY', 'success', 12, `Revoked session ${sessionId}`);
  }

  // --- Database Router ---
  getTables(): DatabaseTable[] {
    return this.getStorage(DB_TABLES_KEY, DEFAULT_TABLES);
  }

  executeSql(query: string): { success: boolean; rows?: any[]; count?: number; error?: string; duration: number } {
    const start = Date.now();
    const clean = query.trim().toUpperCase();
    const tables = this.getTables();

    try {
      if (clean.startsWith('SELECT')) {
        // match SELECT * FROM table
        const match = query.match(/FROM\s+([a-zA-Z0-9_]+)/i);
        if (match) {
          const tableName = match[1];
          const table = tables.find((t) => t.name.toLowerCase() === tableName.toLowerCase());
          if (table) {
            const duration = Date.now() - start;
            this.addLog('db', 'QUERY_SELECT', 'success', duration, `Queried table ${tableName} (${table.data.length} rows)`);
            return { success: true, rows: table.data, count: table.data.length, duration };
          }
        }
        // Generic return
        const duration = Date.now() - start;
        return { success: true, rows: tables[0].data, count: tables[0].data.length, duration };
      }

      if (clean.startsWith('INSERT INTO')) {
        const match = query.match(/INSERT\s+INTO\s+([a-zA-Z0-9_]+)/i);
        const tableName = match ? match[1] : 'users';
        const table = tables.find((t) => t.name.toLowerCase() === tableName.toLowerCase());
        if (table) {
          const newRow = { id: `id-${Date.now()}`, name: 'New Record', email: `test-${Date.now()}@test.com`, role: 'user', created_at: new Date().toISOString() };
          table.data.push(newRow);
          table.rowsCount = table.data.length;
          this.setStorage(DB_TABLES_KEY, tables);
          const duration = Date.now() - start;
          this.addLog('db', 'QUERY_INSERT', 'success', duration, `Inserted 1 row into ${tableName}`);
          return { success: true, count: 1, rows: [newRow], duration };
        }
      }

      const duration = Date.now() - start;
      this.addLog('db', 'QUERY_RAW', 'success', duration, `Executed: ${query.slice(0, 40)}...`);
      return { success: true, count: 1, duration };
    } catch (e: any) {
      const duration = Date.now() - start;
      this.addLog('db', 'QUERY_ERROR', 'failed', duration, e.message);
      return { success: false, error: e.message, duration };
    }
  }

  // --- Env Router ---
  getEnvVars(): EnvVariable[] {
    return this.getStorage(ENV_KEY, DEFAULT_ENV);
  }

  saveEnvVar(envVar: EnvVariable): void {
    const vars = this.getEnvVars();
    const idx = vars.findIndex((v) => v.key === envVar.key);
    if (idx >= 0) {
      vars[idx] = envVar;
    } else {
      vars.unshift(envVar);
    }
    this.setStorage(ENV_KEY, vars);
    this.addLog('env', 'POST_KEY', 'success', 8, `Saved key ${envVar.key}`);
  }

  deleteEnvVar(key: string): void {
    const vars = this.getEnvVars().filter((v) => v.key !== key);
    this.setStorage(ENV_KEY, vars);
    this.addLog('env', 'DELETE_KEY', 'success', 6, `Deleted key ${key}`);
  }

  // --- Files Router ---
  getFiles(): StoredFile[] {
    return this.getStorage(FILES_KEY, DEFAULT_FILES);
  }

  addFile(file: StoredFile): void {
    const files = this.getFiles();
    files.unshift(file);
    this.setStorage(FILES_KEY, files);
    this.addLog('file', 'UPLOAD', 'success', 45, `Uploaded ${file.originalName} (${(file.size / 1024).toFixed(1)} KB)`);
  }

  deleteFile(id: string): void {
    const files = this.getFiles().filter((f) => f.id !== id);
    this.setStorage(FILES_KEY, files);
    this.addLog('file', 'DELETE', 'success', 18, `Deleted file ${id}`);
  }

  // --- Communications (Mail, SMS, WhatsApp) ---
  getTemplates(): CommTemplate[] {
    return this.getStorage(TEMPLATES_KEY, DEFAULT_TEMPLATES);
  }

  saveTemplate(tpl: CommTemplate): void {
    const list = this.getTemplates();
    const idx = list.findIndex((t) => t.id === tpl.id);
    if (idx >= 0) list[idx] = tpl;
    else list.unshift(tpl);
    this.setStorage(TEMPLATES_KEY, list);
    this.addLog(tpl.type, 'TEMPLATE_SAVE', 'success', 15, `Saved template ${tpl.name}`);
  }

  getSentMessages(): SentMessage[] {
    return this.getStorage(MESSAGES_KEY, []);
  }

  sendMessage(type: 'mail' | 'sms' | 'whatsapp', to: string, content: string, subject?: string): SentMessage {
    const msg: SentMessage = {
      id: `msg-${Date.now()}`,
      type,
      to,
      subject,
      content,
      status: 'delivered',
      at: new Date().toISOString(),
      cost: type === 'sms' ? 0.045 : type === 'whatsapp' ? 0.035 : 0.001,
    };
    const messages = this.getSentMessages();
    messages.unshift(msg);
    this.setStorage(MESSAGES_KEY, messages);
    this.addLog(type, 'SEND_DISPATCH', 'success', 85, `Dispatched ${type.toUpperCase()} message to ${to}`);
    return msg;
  }

  // --- PayPal & Payments ---
  getOrders(): PayPalOrder[] {
    return this.getStorage(ORDERS_KEY, DEFAULT_ORDERS);
  }

  createOrder(userId: string, amount: number, description: string): PayPalOrder {
    const user = this.getUserById(userId) || this.getCurrentUser();
    const order: PayPalOrder = {
      id: `PAY-ORD-${Date.now()}`,
      orderNumber: `ORD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      userId: user ? user.id : 'anonymous',
      userName: user ? user.name : 'Guest User',
      userEmail: user ? user.email : 'guest@example.com',
      amount,
      currency: 'USD',
      status: 'COMPLETED',
      description,
      createdAt: new Date().toISOString(),
      captureId: `CAP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    };
    const orders = this.getOrders();
    orders.unshift(order);
    this.setStorage(ORDERS_KEY, orders);
    this.addLog('paypal', 'CREATE_ORDER', 'success', 210, `Captured PayPal order #${order.orderNumber} for $${amount}`);
    return order;
  }

  refundOrder(orderId: string): void {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.status = 'REFUNDED';
      order.refundedAmount = order.amount;
      this.setStorage(ORDERS_KEY, orders);
      this.addLog('paypal', 'REFUND', 'success', 180, `Refunded order #${order.orderNumber} for $${order.amount}`);
    }
  }

  // --- Migrations Router ---
  getMigrations(): MigrationItem[] {
    return this.getStorage(MIGRATIONS_KEY, DEFAULT_MIGRATIONS);
  }

  runMigration(id: string): void {
    const list = this.getMigrations();
    const mig = list.find((m) => m.id === id);
    if (mig) {
      mig.applied = true;
      mig.appliedAt = new Date().toISOString();
      this.setStorage(MIGRATIONS_KEY, list);
      this.addLog('migration', 'MIGRATE_UP', 'success', 95, `Applied migration ${mig.name}`);
    }
  }

  rollbackMigration(id: string): void {
    const list = this.getMigrations();
    const mig = list.find((m) => m.id === id);
    if (mig) {
      mig.applied = false;
      mig.appliedAt = undefined;
      this.setStorage(MIGRATIONS_KEY, list);
      this.addLog('migration', 'MIGRATE_DOWN', 'success', 80, `Rolled back migration ${mig.name}`);
    }
  }

  // --- Router Health & Logs ---
  getRoutersInfo(): RouterHealthInfo[] {
    return [
      {
        name: 'gateway',
        label: 'Gateway Router',
        labelAr: 'بوابة الرواترات الموحدة',
        enabled: true,
        healthy: true,
        latency: 14,
        totalCalls: 12450,
        successRate: 99.8,
        icon: 'Network',
        description: 'Unified request orchestrator, rate-limiting & router pipelines.',
        descriptionAr: 'منسق الاستدعاءات المركزي وموزع العمليات وتحديد معدل الطلبات.',
      },
      {
        name: 'db',
        label: 'Database Router',
        labelAr: 'رواتر قواعد البيانات',
        enabled: true,
        healthy: true,
        latency: 22,
        totalCalls: 8940,
        successRate: 99.4,
        icon: 'Database',
        description: 'PostgreSQL, MySQL & SQLite multi-driver engine with CRUD & Transactions.',
        descriptionAr: 'محرك متعدد لقواعد البيانات يدعم الاستعلامات والمعاملات وCRUD.',
      },
      {
        name: 'session',
        label: 'Session & Auth Router',
        labelAr: 'رواتر الجلسات والمصادقة',
        enabled: true,
        healthy: true,
        latency: 9,
        totalCalls: 15200,
        successRate: 100.0,
        icon: 'ShieldCheck',
        description: 'HMAC-signed cookies, browser fingerprinting & active token vault.',
        descriptionAr: 'كوكيز مشفرة بتوقيع HMAC، بصمة المتصفح، وإدارة الجلسات الحية.',
      },
      {
        name: 'env',
        label: 'Environment Router',
        labelAr: 'رواتر متغيرات البيئة',
        enabled: true,
        healthy: true,
        latency: 5,
        totalCalls: 3120,
        successRate: 100.0,
        icon: 'Key',
        description: '.env variables editor, auto-backup, mask secrets & bulk patch.',
        descriptionAr: 'إدارة ملف .env، النسخ الاحتياطي التلقائي، وحجب المفاتيح السرية.',
      },
      {
        name: 'file',
        label: 'File Storage Router',
        labelAr: 'رواتر التخزين والملفات',
        enabled: true,
        healthy: true,
        latency: 48,
        totalCalls: 1840,
        successRate: 98.9,
        icon: 'FolderArchive',
        description: 'Multi-provider uploads (S3, Cloudinary, Local) with chunking & zip.',
        descriptionAr: 'رفع وتنزيل الملفات عبر S3 والتخزين المحلي مع الضغط والأرشفة.',
      },
      {
        name: 'mail',
        label: 'Email Router',
        labelAr: 'رواتر البريد الإلكتروني',
        enabled: true,
        healthy: true,
        latency: 75,
        totalCalls: 4620,
        successRate: 99.1,
        icon: 'Mail',
        description: 'Resend, SendGrid, SMTP, dynamic HTML templates & retry queue.',
        descriptionAr: 'إرسال البريد عبر SMTP و Resend وقوالب HTML وسجل إعادة المحاولة.',
      },
      {
        name: 'whatsapp',
        label: 'WhatsApp Router',
        labelAr: 'رواتر رسائل واتساب',
        enabled: true,
        healthy: true,
        latency: 68,
        totalCalls: 2180,
        successRate: 98.2,
        icon: 'MessageSquare',
        description: 'Meta Cloud API & Twilio messaging with interactive media & buttons.',
        descriptionAr: 'إرسال رسائل WhatsApp الرسمية والقوالب التفاعلية والوسائط.',
      },
      {
        name: 'sms',
        label: 'SMS Router',
        labelAr: 'رواتر الرسائل النصية SMS',
        enabled: true,
        healthy: true,
        latency: 82,
        totalCalls: 3450,
        successRate: 99.5,
        icon: 'Smartphone',
        description: 'Twilio, Vonage, AWS SNS, instant OTP generator & opt-out filter.',
        descriptionAr: 'إرسال رسائل SMS السريعة وتوليد رموز OTP وفلترة الأرقام المحظورة.',
      },
      {
        name: 'paypal',
        label: 'PayPal Payment Router',
        labelAr: 'رواتر مدفوعات PayPal',
        enabled: true,
        healthy: true,
        latency: 190,
        totalCalls: 960,
        successRate: 99.0,
        icon: 'CreditCard',
        description: 'Orders, Captures, Subscriptions, Payouts, Refunds & Webhooks.',
        descriptionAr: 'إدارة الطلبات والاشتراكات الشهرية واسترداد المبالغ وWebhooks.',
      },
      {
        name: 'migration',
        label: 'Migration Router',
        labelAr: 'رواتر الهجرات وتحديث الهيكل',
        enabled: true,
        healthy: true,
        latency: 35,
        totalCalls: 420,
        successRate: 100.0,
        icon: 'GitPullRequest',
        description: 'Schema version control, batch migrations, rollbacks & fake seeders.',
        descriptionAr: 'إدارة إصدارات قواعد البيانات وتطبيق التعديلات والتراجع وتوليد البيانات.',
      },
    ];
  }

  getLogs(): SystemLogEntry[] {
    const logs = this.getStorage<SystemLogEntry[]>(LOGS_KEY, []);
    if (logs.length === 0) {
      const initLogs: SystemLogEntry[] = [
        { id: 'log-1', router: 'gateway', action: 'DISPATCH_PIPELINE', status: 'success', duration: 18, ip: '192.168.1.1', message: 'Executed pipeline [session, db, mail]', timestamp: new Date(Date.now() - 60000).toISOString() },
        { id: 'log-2', router: 'paypal', action: 'CAPTURE_ORDER', status: 'success', duration: 210, ip: '192.168.1.105', message: 'Payment confirmed for ORD-2026-091 ($149.00)', timestamp: new Date(Date.now() - 120000).toISOString() },
        { id: 'log-3', router: 'mail', action: 'SEND_TEMPLATE', status: 'success', duration: 88, ip: '192.168.1.105', message: 'Sent welcome_email to user@omnirouter.io', timestamp: new Date(Date.now() - 180000).toISOString() },
        { id: 'log-4', router: 'db', action: 'QUERY_SELECT', status: 'success', duration: 12, ip: '192.168.1.105', message: 'SELECT * FROM users LIMIT 10', timestamp: new Date(Date.now() - 240000).toISOString() },
        { id: 'log-5', router: 'session', action: 'FINGERPRINT_REGISTER', status: 'success', duration: 8, ip: '212.57.198.42', message: 'Registered new device fingerprint sha256:4b119e00...', timestamp: new Date(Date.now() - 300000).toISOString() },
      ];
      this.setStorage(LOGS_KEY, initLogs);
      return initLogs;
    }
    return logs;
  }

  addLog(router: string, action: string, status: 'success' | 'failed' | 'warning', duration: number, message: string): void {
    const logs = this.getLogs();
    logs.unshift({
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      router,
      action,
      status,
      duration,
      ip: '127.0.0.1',
      message,
      timestamp: new Date().toISOString(),
    });
    if (logs.length > 300) logs.pop();
    this.setStorage(LOGS_KEY, logs);
  }

  clearLogs(): void {
    this.setStorage(LOGS_KEY, []);
  }
}

export const routerEngine = new RouterEngineService();
