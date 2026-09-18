import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Resolve public client configuration securely
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder')
);

// Fallback dummy client for build/environment safety when unconfigured
function createSafeSupabaseClient(): SupabaseClient {
  if (isSupabaseConfigured) {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'apex_auth_session',
      },
    });
  }

  console.warn('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Initializing unauthenticated fallback.');

  // Unauthenticated safe fallback - STRICT: never grant fake sessions or auto-login!
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: (callback: any) => {
        setTimeout(() => callback('SIGNED_OUT', null), 0);
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: new Error('ระบบเซิร์ฟเวอร์ยังไม่ได้ตั้งค่าการเชื่อมต่อฐานข้อมูล กรุณาติดต่อผู้ดูแลระบบ'),
      }),
      signUp: async () => ({
        data: { user: null, session: null },
        error: new Error('ระบบเซิร์ฟเวอร์ยังไม่ได้ตั้งค่าการเชื่อมต่อฐานข้อมูล'),
      }),
      signOut: async () => ({ error: null }),
      updateUser: async () => ({ data: { user: null }, error: new Error('Not authenticated') }),
      resetPasswordForEmail: async () => ({ data: {}, error: new Error('Not authenticated') }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: new Error('Database unconfigured') }),
        }),
      }),
    }),
    storage: {
      from: () => ({
        getPublicUrl: (path: string) => ({ data: { publicUrl: path } }),
        upload: async () => ({ data: null, error: new Error('Storage unconfigured') }),
      }),
    },
  } as unknown as SupabaseClient;
}

export const supabase: SupabaseClient = createSafeSupabaseClient();
