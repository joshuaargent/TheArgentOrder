import { createBrowserClient } from "@supabase/ssr";

// Create a mock client for build time when env vars aren't set
const mockClient = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithOAuth: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
        then: () => ({ data: [], error: null }),
      }),
      order: () => ({ data: [], error: null }),
    }),
  }),
} as unknown as ReturnType<typeof createBrowserClient>;

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During build time or when env vars are missing, return mock client
  if (!supabaseUrl || !supabaseAnonKey) {
    return mockClient;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
