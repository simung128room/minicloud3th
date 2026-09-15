import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

// Local disk persistence path for mock data
const localDataDir = path.join(os.tmpdir(), 'apex_store_mock_db');
if (!fs.existsSync(localDataDir)) {
  try {
    fs.mkdirSync(localDataDir, { recursive: true });
  } catch (e) {}
}

const seedData: Record<string, any[]> = {
  categories: [
    {
      id: 'cat-game-cards',
      name: 'game-cards',
      title: 'บัตรเติมเกม',
      subtitle: 'เติมเกมราคาพิเศษ จัดส่งอัตโนมัติ 24 ชม.',
      bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'cat-id-games',
      name: 'id-games',
      title: 'ไอดีเกม',
      subtitle: 'ไอดีเกมสะอาด ปลอดภัย มีประกันทุกไอดี',
      bannerUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
      imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'cat-apps-premium',
      name: 'apps-premium',
      title: 'แอปพรีเมียม',
      subtitle: 'Discord Nitro, YouTube Premium, Spotify ราคาสบายกระเป๋า',
      bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'
    }
  ],
  products: [
    {
      id: 'prod-nitro-1m',
      name: 'Discord Nitro 1 Month (Gift)',
      description: 'Discord Nitro 1 เดือน ลิงก์ของขวัญ (Gift Link) ใช้งานได้ทันที ไม่ต้องให้รหัส',
      price: 139,
      originalPrice: 199,
      stock: 45,
      soldCount: 382,
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      category: 'apps-premium',
      isPopular: true,
      tag: 'HOT',
      stockData: ['https://discord.gift/mock-nitro-1', 'https://discord.gift/mock-nitro-2', 'https://discord.gift/mock-nitro-3'],
      _version: 1,
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
    },
    {
      id: 'prod-garena-shells-675',
      name: 'Garena Shells 675 Shells (PIN)',
      description: 'รหัสเติมการีน่า 675 เชลล์ นำไปแลกเป็นคูปอง RoV / Free Fire / FC Online ได้ทันที',
      price: 490,
      originalPrice: 500,
      stock: 80,
      soldCount: 1240,
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
      category: 'game-cards',
      isPopular: true,
      tag: 'ยอดนิยม',
      stockData: ['GS-675-9988-1122-3344', 'GS-675-5566-7788-9900'],
      _version: 1,
      createdAt: new Date(Date.now() - 86400000 * 9).toISOString()
    },
    {
      id: 'prod-valorant-points-1375',
      name: 'Valorant Points 1,375 VP (TH/SEA)',
      description: 'โค้ดเติมพอยท์เกม Valorant เซิร์ฟเวอร์ไทยและ SEA รวดเร็ว แม่นยำ',
      price: 349,
      originalPrice: 380,
      stock: 22,
      soldCount: 654,
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
      category: 'game-cards',
      isPopular: true,
      tag: 'ขายดี',
      stockData: ['RA-VALO-TH-99214', 'RA-VALO-TH-77319'],
      _version: 1,
      createdAt: new Date(Date.now() - 86400000 * 8).toISOString()
    },
    {
      id: 'prod-steam-wallet-350',
      name: 'Steam Wallet Code 350 THB',
      description: 'รหัสเติมเงิน Steam Wallet มูลค่า 350 บาท ใช้ซื้อเกมใน Steam ได้ทันที',
      price: 350,
      originalPrice: 360,
      stock: 30,
      soldCount: 410,
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
      category: 'game-cards',
      isPopular: false,
      tag: 'Steam',
      stockData: ['STM-350-ABCD-EFGH-1234', 'STM-350-WXYZ-9876-5432'],
      _version: 1,
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
    },
    {
      id: 'prod-rov-grandmaster',
      name: 'ID ROV [Glorious Ruler] สกิน 180+',
      description: 'ไอดี RoV แรงค์ Glorious Ruler สกินแรร์ 180+ ตัวละครครบ สะอาดเปลี่ยนข้อมูลได้ 100%',
      price: 1890,
      originalPrice: 2500,
      stock: 1,
      soldCount: 28,
      imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
      category: 'id-games',
      isPopular: true,
      tag: 'พรีเมียม',
      stockData: ['User: rov_pro_master | Pass: P@ssw0rd9988 | Info: สะอาด ไม่ผูกเฟส'],
      _version: 1,
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
    },
    {
      id: 'prod-netflix-premium-30d',
      name: 'Netflix 4K Ultra HD (30 วัน)',
      description: 'บัญชีเน็ตฟลิกซ์ แพ็กเกจพรีเมียม 4K UHD 1 จอส่วนตัว ดูได้ไม่มีสะดุด รับประกัน 30 วัน',
      price: 119,
      originalPrice: 169,
      stock: 50,
      soldCount: 930,
      imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=600&q=80',
      category: 'apps-premium',
      isPopular: true,
      tag: 'ยอดฮิต',
      stockData: ['Email: nf_acc_01@apex.com | Pass: NetFlix#2026 | PIN: 1122'],
      _version: 1,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    }
  ],
  users: [
    {
      id: 'mock-admin-id',
      uid: 'mock-admin-id',
      username: 'abopboa',
      email: 'abopboa.b@gmail.com',
      fullName: 'Abopboa Admin',
      balance: 999999,
      role: 'Admin',
      rank: 'premium',
      isPremium: true,
      premiumExpireDate: '2099-12-31T23:59:59.000Z',
      registeredAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'mock-user-id',
      uid: 'mock-user-id',
      username: 'member',
      email: 'user@apex-studio.com',
      fullName: 'Demo Member',
      balance: 1500,
      role: 'User',
      rank: 'basic',
      isPremium: false,
      premiumExpireDate: null,
      registeredAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  settings: [
    {
      key: 'site',
      id: 'site',
      site_name: 'DEV',
      contact_line: '@dev',
      truewallet_phone: '0812345678',
      discord_link: 'https://discord.gg',
      announcement_text: 'ระบบจำลอง Mock Simulation ทำงาน 100% สมบูรณ์แบบ ไม่ต้องตั้งค่า Environment Variable',
      banners: [
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80'
      ],
      popup_enabled: false,
      popup_img_url: '',
      popup_link: '',
      auto_proxy: false
    },
    {
      key: 'payment',
      id: 'payment',
      promptpayNumber: '0812345678',
      accountNameTh: 'เดฟ',
      accountNameEn: 'DEV',
      truewalletPhone: '0812345678'
    }
  ],
  custom_pages: [
    {
      id: 'page-sys-site',
      slug: 'sys_site',
      title: 'sys_site',
      content: JSON.stringify({
        site_name: 'DEV',
        announcement_text: 'ระบบจำลอง Mock Mode ทำงานเต็มรูปแบบ พร้อมใช้งานทุกฟังก์ชัน',
        contact_line: '@dev',
        truewallet_phone: '0812345678',
        banners: [
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'
        ]
      })
    },
    {
      id: 'page-sys-site-dev',
      slug: 'sys_site_dev',
      title: 'sys_site_dev',
      content: JSON.stringify({
        site_name: 'DEV',
        announcement_text: 'ระบบจำลอง Mock Mode ทำงานเต็มรูปแบบ',
        contact_line: '@dev',
        truewallet_phone: '0812345678'
      })
    }
  ],
  topups: [
    {
      id: 'topup-001',
      userId: 'mock-admin-id',
      username: 'abopboa',
      amount: 1000,
      status: 'approved',
      channel: 'PromptPay',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ],
  purchases: [
    {
      id: 'order-001',
      billNumber: 'ORD-20260901',
      userId: 'mock-admin-id',
      username: 'abopboa',
      productName: 'Discord Nitro 1 Month (Gift)',
      price: 139,
      status: 'success',
      itemData: 'https://discord.gift/mock-nitro-1',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ],
  admins: [
    { id: 'admin-1', email: 'abopboa.b@gmail.com' },
    { id: 'admin-2', email: 'admin@apex-studio.com' }
  ],
  blocked_ips: [],
  idempotency_keys: [],
  product_stock_chunks: [],
  license_keys: [],
  vouchers: [],
  slips: [],
  api_keys: [],
  sys_audit_logs: []
};

// In-memory table cache
const memoryTables: Record<string, any[]> = {};

function getPrimaryKey(collection: string): string {
  if (collection === 'blocked_ips') return 'ip';
  if (collection === 'settings') return 'key';
  return 'id';
}

function getFilePath(collection: string): string {
  return path.join(localDataDir, `${collection}.json`);
}

function loadCollection(collection: string): any[] {
  if (memoryTables[collection]) {
    return memoryTables[collection];
  }
  const fp = getFilePath(collection);
  if (fs.existsSync(fp)) {
    try {
      const data = fs.readFileSync(fp, 'utf8');
      memoryTables[collection] = JSON.parse(data);
      return memoryTables[collection];
    } catch (e) {}
  }
  memoryTables[collection] = seedData[collection] ? JSON.parse(JSON.stringify(seedData[collection])) : [];
  try {
    fs.writeFileSync(fp, JSON.stringify(memoryTables[collection], null, 2));
  } catch (e) {}
  return memoryTables[collection];
}

function persistCollection(collection: string) {
  try {
    const fp = getFilePath(collection);
    fs.writeFileSync(fp, JSON.stringify(memoryTables[collection] || [], null, 2));
  } catch (e) {
    console.error(`Failed to persist mock collection ${collection}:`, e);
  }
}

// Ensure initial seed files exist
Object.keys(seedData).forEach(col => {
  loadCollection(col);
});

export class MockDoc {
  constructor(public collection: string, public id: string) {}

  pk() {
    return getPrimaryKey(this.collection);
  }

  async get() {
    const table = loadCollection(this.collection);
    const pk = this.pk();
    const doc = table.find((d: any) => d[pk] === this.id || d.id === this.id);
    if (!doc) {
      return { id: this.id, ref: this, exists: false, data: () => null };
    }
    return { id: this.id, ref: this, exists: true, data: () => ({ ...doc }) };
  }

  async set(data: any, options: any = {}) {
    const table = loadCollection(this.collection);
    const pk = this.pk();
    const index = table.findIndex((d: any) => d[pk] === this.id || d.id === this.id);
    const payload = { ...data, [pk]: this.id, id: this.id };
    if (index !== -1) {
      if (options && options.merge) {
        table[index] = { ...table[index], ...payload };
      } else {
        table[index] = payload;
      }
    } else {
      table.push(payload);
    }
    persistCollection(this.collection);
  }

  async update(data: any) {
    const table = loadCollection(this.collection);
    const pk = this.pk();
    const index = table.findIndex((d: any) => d[pk] === this.id || d.id === this.id);
    if (index !== -1) {
      table[index] = { ...table[index], ...data };
      persistCollection(this.collection);
    }
  }

  async delete() {
    let table = loadCollection(this.collection);
    const pk = this.pk();
    memoryTables[this.collection] = table.filter((d: any) => d[pk] !== this.id && d.id !== this.id);
    persistCollection(this.collection);
  }
}

export class MockQuery {
  _where: { field: string; op: string; value: any }[] = [];
  _orderBy: { field: string; dir: string }[] = [];
  _limit?: number;
  _offset?: number;
  _selectFields?: string[];

  constructor(public collection: string) {}

  where(field: string, op: string, value: any) {
    this._where.push({ field, op, value });
    return this;
  }

  orderBy(field: string, dir: string = 'asc') {
    this._orderBy.push({ field, dir: dir.toLowerCase() });
    return this;
  }

  limit(n: number) {
    this._limit = n;
    return this;
  }

  offset(n: number) {
    this._offset = n;
    return this;
  }

  select(...fields: string[]) {
    this._selectFields = fields;
    return this;
  }

  async get() {
    let table = [...loadCollection(this.collection)];

    for (const w of this._where) {
      table = table.filter((d: any) => {
        const val = d[w.field];
        if (w.op === '==' || w.op === '=') return val === w.value;
        if (w.op === '!=') return val !== w.value;
        if (w.op === '>') return val > w.value;
        if (w.op === '>=') return val >= w.value;
        if (w.op === '<') return val < w.value;
        if (w.op === '<=') return val <= w.value;
        if (w.op === 'in') return Array.isArray(w.value) && w.value.includes(val);
        return true;
      });
    }

    for (const o of this._orderBy) {
      table.sort((a: any, b: any) => {
        const valA = a[o.field];
        const valB = b[o.field];
        if (valA === valB) return 0;
        if (valA === undefined) return 1;
        if (valB === undefined) return -1;
        if (o.dir === 'desc') {
          return valA < valB ? 1 : -1;
        }
        return valA > valB ? 1 : -1;
      });
    }

    if (this._offset && this._offset > 0) {
      table = table.slice(this._offset);
    }
    if (this._limit && this._limit > 0) {
      table = table.slice(0, this._limit);
    }

    const docs = table.map((item: any) => {
      const docId = item[getPrimaryKey(this.collection)] || item.id || crypto.randomUUID();
      const docRef = new MockDoc(this.collection, docId);
      return {
        id: docId,
        ref: docRef,
        exists: true,
        data: () => ({ ...item })
      };
    });

    return {
      docs,
      empty: docs.length === 0,
      size: docs.length,
      forEach: (cb: (doc: any) => void) => docs.forEach(cb)
    };
  }
}

export class MockCollection extends MockQuery {
  doc(id?: string) {
    const docId = id || crypto.randomUUID();
    return new MockDoc(this.collection, docId);
  }

  async add(data: any) {
    const pk = getPrimaryKey(this.collection);
    const docId = data[pk] || data.id || crypto.randomUUID();
    const docRef = this.doc(docId);
    await docRef.set(data);
    return { id: docId, ref: docRef };
  }
}

// Mock Supabase Query Chain
export class MockSupabaseQueryBuilder {
  private filters: ((item: any) => boolean)[] = [];
  private orderCol?: string;
  private orderAsc: boolean = true;
  private limitNum?: number;
  private rangeStart?: number;
  private rangeEnd?: number;
  private isSingle: boolean = false;
  private pendingUpdateData?: any;
  private isDelete: boolean = false;

  constructor(private table: string) {}

  select(columns: string = '*', options?: any) {
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push(item => item[column] === value);
    return this;
  }

  or(filterStr: string) {
    const parts = filterStr.split(',');
    this.filters.push(item => {
      return parts.some(part => {
        const m = part.trim().match(/([a-zA-Z0-9_]+)\.eq\.(.+)/);
        if (m) {
          const [, col, val] = m;
          return String(item[col]) === val;
        }
        return false;
      });
    });
    return this;
  }

  gt(column: string, value: any) {
    this.filters.push(item => item[column] > value);
    return this;
  }

  lt(column: string, value: any) {
    this.filters.push(item => item[column] < value);
    return this;
  }

  like(column: string, pattern: string) {
    const regex = new RegExp(pattern.replace(/%/g, '.*'), 'i');
    this.filters.push(item => regex.test(String(item[column] || '')));
    return this;
  }

  ilike(column: string, pattern: string) {
    const regex = new RegExp(pattern.replace(/%/g, '.*'), 'i');
    this.filters.push(item => regex.test(String(item[column] || '')));
    return this;
  }

  order(column: string, options: { ascending?: boolean } = {}) {
    this.orderCol = column;
    this.orderAsc = options.ascending !== false;
    return this;
  }

  limit(n: number) {
    this.limitNum = n;
    return this;
  }

  range(from: number, to: number) {
    this.rangeStart = from;
    this.rangeEnd = to;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  async insert(rows: any | any[]) {
    const list = Array.isArray(rows) ? rows : [rows];
    const table = loadCollection(this.table);
    const pk = getPrimaryKey(this.table);
    const inserted: any[] = [];
    for (const r of list) {
      const id = r[pk] || r.id || crypto.randomUUID();
      const row = { ...r, [pk]: id, id };
      table.push(row);
      inserted.push(row);
    }
    persistCollection(this.table);
    return { data: this.isSingle ? inserted[0] : inserted, error: null };
  }

  update(data: any) {
    this.pendingUpdateData = data;
    return this;
  }

  async upsert(rows: any | any[]) {
    const list = Array.isArray(rows) ? rows : [rows];
    const table = loadCollection(this.table);
    const pk = getPrimaryKey(this.table);
    const result: any[] = [];
    for (const r of list) {
      const id = r[pk] || r.id || crypto.randomUUID();
      const idx = table.findIndex(item => item[pk] === id || item.id === id);
      const row = { ...r, [pk]: id, id };
      if (idx !== -1) {
        table[idx] = { ...table[idx], ...row };
        result.push(table[idx]);
      } else {
        table.push(row);
        result.push(row);
      }
    }
    persistCollection(this.table);
    return { data: this.isSingle ? result[0] : result, error: null };
  }

  delete() {
    this.isDelete = true;
    return this;
  }

  then(resolve: (value: any) => any, reject?: (reason: any) => any) {
    let table = loadCollection(this.table);

    // Handle deferred update
    if (this.pendingUpdateData) {
      const updated: any[] = [];
      table.forEach((item, idx) => {
        if (this.filters.every(f => f(item))) {
          table[idx] = { ...item, ...this.pendingUpdateData };
          updated.push(table[idx]);
        }
      });
      persistCollection(this.table);
      return Promise.resolve(resolve({ data: this.isSingle ? (updated[0] || null) : updated, error: null }));
    }

    // Handle deferred delete
    if (this.isDelete) {
      const remaining = table.filter(item => !this.filters.every(f => f(item)));
      memoryTables[this.table] = remaining;
      persistCollection(this.table);
      return Promise.resolve(resolve({ data: null, error: null }));
    }

    let list = [...table];
    for (const f of this.filters) {
      list = list.filter(f);
    }
    const totalCount = list.length;
    if (this.orderCol) {
      list.sort((a, b) => {
        const valA = a[this.orderCol!];
        const valB = b[this.orderCol!];
        if (valA === valB) return 0;
        if (valA === undefined) return 1;
        if (valB === undefined) return -1;
        return this.orderAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
      });
    }
    if (this.rangeStart !== undefined && this.rangeEnd !== undefined) {
      list = list.slice(this.rangeStart, this.rangeEnd + 1);
    } else if (this.limitNum !== undefined) {
      list = list.slice(0, this.limitNum);
    }

    if (this.isSingle) {
      if (list.length === 0) {
        return Promise.resolve(resolve({ data: null, count: 0, error: { code: 'PGRST116', message: 'Row not found' } }));
      }
      return Promise.resolve(resolve({ data: list[0], count: totalCount, error: null }));
    }

    return Promise.resolve(resolve({ data: list, count: totalCount, error: null }));
  }
}

export const supabaseAdmin = {
  from: (table: string) => new MockSupabaseQueryBuilder(table),
  auth: {
    getUser: async (token: string) => {
      const users = loadCollection('users');
      const adminUser = users.find((u: any) => u.role === 'Admin') || users[0];
      return {
        data: {
          user: adminUser ? {
            id: adminUser.id,
            email: adminUser.email,
            user_metadata: { full_name: adminUser.fullName || adminUser.username }
          } : null
        },
        error: null
      };
    },
    admin: {
      createUser: async (opts: any) => {
        const id = crypto.randomUUID();
        const newUser = {
          id,
          uid: id,
          email: opts.email,
          username: opts.email.split('@')[0],
          fullName: opts.user_metadata?.full_name || opts.email.split('@')[0],
          balance: 100,
          role: 'User',
          rank: 'basic',
          isPremium: false,
          premiumExpireDate: null,
          registeredAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const users = loadCollection('users');
        users.push(newUser);
        persistCollection('users');
        return { data: { user: { id, email: opts.email } }, error: null };
      },
      updateUserById: async (id: string, opts: any) => {
        const users = loadCollection('users');
        const user = users.find(u => u.id === id);
        if (user) {
          Object.assign(user, opts);
          persistCollection('users');
          return { data: { user }, error: null };
        }
        return { data: null, error: new Error('User not found') };
      },
      deleteUser: async (id: string) => {
        let users = loadCollection('users');
        memoryTables['users'] = users.filter(u => u.id !== id);
        persistCollection('users');
        return { data: { user: { id } }, error: null };
      },
      listUsers: async () => {
        const users = loadCollection('users');
        return { data: { users }, error: null };
      }
    }
  },
  storage: {
    createBucket: async (name: string, opts?: any) => {
      return { data: { name }, error: null };
    },
    from: (bucket: string) => ({
      upload: async (pathStr: string, fileData: any, opts?: any) => {
        return { data: { path: pathStr }, error: null };
      },
      getPublicUrl: (pathStr: string) => {
        return { data: { publicUrl: `https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80` } };
      },
      createBucket: async (name?: string, opts?: any) => ({ error: null })
    })
  }
};

const db = {
  collection: (name: string) => new MockCollection(name),
  runTransaction: async (updateFunction: (t: any) => Promise<any>) => {
    const writes: (() => Promise<void>)[] = [];
    const t = {
      get: async (queryOrDoc: any) => await queryOrDoc.get(),
      update: (docRef: any, data: any) => writes.push(async () => { await docRef.update(data); }),
      set: (docRef: any, data: any, options?: any) => writes.push(async () => { await docRef.set(data, options); }),
      delete: (docRef: any) => writes.push(async () => { await docRef.delete(); })
    };

    const result = await updateFunction(t);
    for (const writeOp of writes) {
      await writeOp();
    }
    return result;
  }
};

const auth = {
  verifyIdToken: async (token: string) => {
    const users = loadCollection('users');
    const adminUser = users.find((u: any) => u.role === 'Admin') || users[0];
    return {
      uid: adminUser ? adminUser.id : 'mock-admin-id',
      id: adminUser ? adminUser.id : 'mock-admin-id',
      email: adminUser ? adminUser.email : 'abopboa.b@gmail.com'
    };
  },
  updateUser: async (uid: string, props: any) => {
    const users = loadCollection('users');
    const user = users.find(u => u.id === uid);
    if (user) {
      Object.assign(user, props);
      persistCollection('users');
      return { id: uid, ...user };
    }
    return { id: uid, ...props };
  },
  deleteUser: async (uid: string) => {
    let users = loadCollection('users');
    memoryTables['users'] = users.filter(u => u.id !== uid);
    persistCollection('users');
    return { id: uid };
  }
};

export const adminDb = {
  firestore: () => db,
  auth: () => auth
};
