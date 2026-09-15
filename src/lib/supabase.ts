// Fully simulated client-side mock Supabase service

interface MockUser {
  id: string;
  uid?: string;
  email: string;
  user_metadata?: { full_name?: string };
  app_metadata?: any;
  aud?: string;
  created_at?: string;
  isAnonymous?: boolean;
}

interface MockSession {
  access_token: string;
  token_type: string;
  user: MockUser;
  expires_in: number;
  expires_at: number;
}

const STORAGE_KEY = 'apex_mock_session';

const defaultAdminUser: MockUser = {
  id: 'mock-admin-id',
  uid: 'mock-admin-id',
  email: 'abopboa.b@gmail.com',
  user_metadata: { full_name: 'Abopboa Admin' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString()
};

const defaultAdminSession: MockSession = {
  access_token: 'mock-token-admin',
  token_type: 'bearer',
  user: defaultAdminUser,
  expires_in: 86400 * 30,
  expires_at: Math.floor(Date.now() / 1000) + 86400 * 30
};

function getStoredSession(): MockSession | null {
  if (typeof window === 'undefined') return defaultAdminSession;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    // Default to active admin session for seamless immediate usage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAdminSession));
    return defaultAdminSession;
  } catch (e) {
    return defaultAdminSession;
  }
}

function setStoredSession(session: MockSession | null) {
  if (typeof window === 'undefined') return;
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (e) {}
}

const authListeners = new Set<(event: string, session: MockSession | null) => void>();

function notifyAuthListeners(event: string, session: MockSession | null) {
  authListeners.forEach(listener => {
    try {
      listener(event, session);
    } catch (e) {
      console.error('Error in auth listener:', e);
    }
  });
}

const mockAuth = {
  getSession: async () => {
    const session = getStoredSession();
    return { data: { session }, error: null };
  },

  onAuthStateChange: (callback: (event: string, session: MockSession | null) => void) => {
    authListeners.add(callback);
    // Immediately emit current session
    setTimeout(() => {
      const session = getStoredSession();
      callback(session ? 'INITIAL_SESSION' : 'SIGNED_OUT', session);
    }, 0);

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            authListeners.delete(callback);
          }
        }
      }
    };
  },

  signInWithPassword: async ({ email, password }: { email: string; password?: string }) => {
    const isAdmin = email.toLowerCase().includes('abopboa') || email.toLowerCase().includes('admin');
    const user: MockUser = {
      id: isAdmin ? 'mock-admin-id' : 'mock-user-id',
      uid: isAdmin ? 'mock-admin-id' : 'mock-user-id',
      email: email,
      user_metadata: { full_name: email.split('@')[0] },
      aud: 'authenticated',
      created_at: new Date().toISOString()
    };
    const session: MockSession = {
      access_token: isAdmin ? 'mock-token-admin' : 'mock-token-user',
      token_type: 'bearer',
      user,
      expires_in: 86400 * 30,
      expires_at: Math.floor(Date.now() / 1000) + 86400 * 30
    };
    setStoredSession(session);
    notifyAuthListeners('SIGNED_IN', session);
    return { data: { user, session }, error: null };
  },

  signUp: async ({ email, password, options }: { email: string; password?: string; options?: any }) => {
    const user: MockUser = {
      id: 'mock-user-' + Math.random().toString(36).substring(2, 9),
      uid: 'mock-user-' + Math.random().toString(36).substring(2, 9),
      email,
      user_metadata: { full_name: options?.data?.full_name || email.split('@')[0] },
      aud: 'authenticated',
      created_at: new Date().toISOString()
    };
    const session: MockSession = {
      access_token: 'mock-token-' + user.id,
      token_type: 'bearer',
      user,
      expires_in: 86400 * 30,
      expires_at: Math.floor(Date.now() / 1000) + 86400 * 30
    };
    setStoredSession(session);
    notifyAuthListeners('SIGNED_IN', session);
    return { data: { user, session }, error: null };
  },

  signOut: async () => {
    setStoredSession(null);
    notifyAuthListeners('SIGNED_OUT', null);
    return { error: null };
  },

  updateUser: async (props: any) => {
    const session = getStoredSession();
    if (session) {
      if (props.password) {
        // Password update simulated
      }
      if (props.data) {
        session.user.user_metadata = { ...session.user.user_metadata, ...props.data };
      }
      setStoredSession(session);
      notifyAuthListeners('USER_UPDATED', session);
      return { data: { user: session.user }, error: null };
    }
    return { data: { user: defaultAdminUser }, error: null };
  },

  resetPasswordForEmail: async (email: string) => {
    return { data: {}, error: null };
  },

  signInAnonymously: async () => {
    const anonUser: MockUser = {
      id: 'anon-' + Math.random().toString(36).substring(2, 9),
      email: '',
      isAnonymous: true,
      created_at: new Date().toISOString()
    };
    const session: MockSession = {
      access_token: 'mock-anon-token',
      token_type: 'bearer',
      user: anonUser,
      expires_in: 86400,
      expires_at: Math.floor(Date.now() / 1000) + 86400
    };
    setStoredSession(session);
    notifyAuthListeners('SIGNED_IN', session);
    return { data: { user: anonUser, session }, error: null };
  }
};

class MockClientQueryBuilder {
  constructor(private table: string) {}
  select(cols?: string) { return this; }
  eq(col: string, val: any) { return this; }
  or(val: string) { return this; }
  single() {
    return Promise.resolve({ data: null, error: null });
  }
  then(resolve: (val: any) => any) {
    return Promise.resolve(resolve({ data: [], error: null }));
  }
}

export const supabase: any = {
  auth: mockAuth,
  from: (table: string) => new MockClientQueryBuilder(table),
  storage: {
    from: () => ({
      getPublicUrl: (path: string) => ({ data: { publicUrl: path } }),
      upload: async () => ({ data: {}, error: null })
    })
  }
};

export const signInAnonymously = async () => {
  return await mockAuth.signInAnonymously();
};
