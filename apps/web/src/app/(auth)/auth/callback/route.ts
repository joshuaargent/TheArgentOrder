import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Create profile if it doesn't exist
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", user.id)
          .single();
        
        if (!profile) {
          // Create profile
          await supabase.from("profiles").insert({
            user_id: user.id,
            email: user.email,
            display_name: user.user_metadata?.display_name || user.email?.split("@")[0] || "Brother",
          });
          
          // Create formation scores
          await supabase.from("formation_scores").insert({
            user_id: user.id,
          });
          
          // Create user levels
          await supabase.from("user_levels").insert({
            user_id: user.id,
            level: 1,
            total_xp: 0,
          });
        }
      }
      
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_error`);
}
