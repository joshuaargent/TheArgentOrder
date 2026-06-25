"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

export function useSupabase() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only create client in browser
    if (typeof window !== "undefined") {
      try {
        const client = createClient();
        setSupabase(client);
      } catch (error) {
        console.error("Failed to create Supabase client:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  return { supabase, isLoading };
}
