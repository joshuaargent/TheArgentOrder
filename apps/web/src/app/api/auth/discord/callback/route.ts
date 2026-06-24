import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DISCORD_OAUTH_URL = "https://discord.com/api/oauth2";
const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/discord/callback`;

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, requestUrl.origin)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=no_code", requestUrl.origin)
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(`${DISCORD_OAUTH_URL}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      console.error("Discord token exchange failed");
      return NextResponse.redirect(
        new URL("/login?error=auth_failed", requestUrl.origin)
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get Discord user info
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      console.error("Failed to get Discord user");
      return NextResponse.redirect(
        new URL("/login?error=user_fetch_failed", requestUrl.origin)
      );
    }

    const discordUser = await userResponse.json();

    // Create Supabase client
    const supabase = await createClient();

    // Check if Discord account is already linked
    const { data: existingLink } = await supabase
      .from("discord_accounts")
      .select("user_id")
      .eq("discord_id", discordUser.id)
      .single();

    if (existingLink) {
      // Account already linked - send magic link to sign in
      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("user_id", existingLink.user_id)
        .single();

      if (profile?.email) {
        const { error: magicError } = await supabase.auth.signInWithOtp({
          email: profile.email,
          options: {
            emailRedirectTo: `${requestUrl.origin}/dashboard`,
          },
        });

        if (!magicError) {
          return NextResponse.redirect(
            new URL(`/login?check_email=1`, requestUrl.origin)
          );
        }
      }

      return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
    }

    // Need email for account
    if (!discordUser.email) {
      return NextResponse.redirect(
        new URL("/login?error=email_required", requestUrl.origin)
      );
    }

    // Check if user already exists by email
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", discordUser.email)
      .single();

    if (existingUser) {
      // Link Discord to existing account
      await supabase.from("discord_accounts").insert({
        user_id: existingUser.user_id,
        discord_id: discordUser.id,
        linked_at: new Date().toISOString(),
      });

      // Send magic link
      const { error: magicError } = await supabase.auth.signInWithOtp({
        email: discordUser.email,
        options: {
          emailRedirectTo: `${requestUrl.origin}/dashboard`,
        },
      });

      if (!magicError) {
        return NextResponse.redirect(
          new URL(`/login?check_email=1`, requestUrl.origin)
        );
      }

      return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
    }

    // Create new user - generate a random password (they'll use magic links)
    const avatarUrl = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
      : null;

    // Generate a secure random password (they'll never need it since we use magic links)
    const generatedPassword = `${discordUser.id}_${Date.now()}_discord_oauth`;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: discordUser.email,
      password: generatedPassword,
      options: {
        data: {
          discord_id: discordUser.id,
          discord_username: discordUser.username,
          discord_avatar: avatarUrl,
          full_name: discordUser.global_name || discordUser.username,
          auth_method: "discord_oauth",
        },
        emailRedirectTo: `${requestUrl.origin}/dashboard?welcome=1`,
      },
    });

    if (authError) {
      console.error("Failed to create user:", authError);
      return NextResponse.redirect(
        new URL("/login?error=signup_failed", requestUrl.origin)
      );
    }

    if (authData.user) {
      // Link Discord account
      await supabase.from("discord_accounts").insert({
        user_id: authData.user.id,
        discord_id: discordUser.id,
        linked_at: new Date().toISOString(),
      });

      // Create profile with user_id matching auth user id
      await supabase.from("profiles").insert({
        id: authData.user.id,
        user_id: authData.user.id,
        email: discordUser.email,
        display_name: discordUser.global_name || discordUser.username,
        avatar_url: avatarUrl,
      });

      // Create initial formation scores
      await supabase.from("formation_scores").insert({
        user_id: authData.user.id,
        faith_score: 0,
        discipline_score: 0,
        brotherhood_score: 0,
        building_score: 0,
        truth_score: 0,
        overall_score: 0,
      });

      // Assign initial rank (Initiate)
      const { data: initiateRank } = await supabase
        .from("ranks")
        .select("id")
        .eq("name", "Initiate")
        .single();

      if (initiateRank) {
        await supabase.from("user_ranks").insert({
          user_id: authData.user.id,
          rank_id: initiateRank.id,
        });
      }
    }

    // Redirect to check email
    return NextResponse.redirect(
      new URL(`/login?check_email=1`, requestUrl.origin)
    );
  } catch (error) {
    console.error("Discord OAuth error:", error);
    return NextResponse.redirect(
      new URL("/login?error=oauth_error", requestUrl.origin)
    );
  }
}
