import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(`${origin}/login?error=auth_error`);
    }

    // Create profile if it doesn't exist (after session is created)
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();
      
      if (!profile) {
        // Get the rank for "Initiate"
        const { data: initiateRank } = await supabase
          .from("ranks")
          .select("id")
          .eq("name", "Initiate")
          .single();

        // Create profile
        const displayName = user.user_metadata?.display_name || 
                           user.email?.split("@")[0]?.replace(/[^a-zA-Z0-9]/g, '') || 
                           "Brother";
        
        const { error: profileError } = await supabase.from("profiles").insert({
          user_id: user.id,
          email: user.email,
          display_name: displayName,
        });
        
        if (profileError) {
          console.error("Failed to create profile:", profileError);
        } else {
          // Create formation scores
          await supabase.from("formation_scores").insert({
            user_id: user.id,
            faith_score: 0,
            discipline_score: 0,
            brotherhood_score: 0,
            building_score: 0,
            truth_score: 0,
          });
          
          // Create user levels
          await supabase.from("user_levels").insert({
            user_id: user.id,
            level: 1,
            total_xp: 0,
          });
          
          // Assign Initiate rank
          if (initiateRank) {
            await supabase.from("user_ranks").insert({
              user_id: user.id,
              rank_id: initiateRank.id,
              assigned_by: user.id, // Self-assigned on signup
            });
          }
        }
      }
    }
    
    return NextResponse.redirect(`${origin}${next}`);
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=no_code`);
}
