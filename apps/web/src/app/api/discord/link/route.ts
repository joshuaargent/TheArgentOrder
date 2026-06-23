import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { code } = body;

  if (!code) {
    return NextResponse.json({ error: "Link code is required" }, { status: 400 });
  }

  // Find the link code
  const { data: linkCode, error: codeError } = await supabase
    .from("discord_link_codes")
    .select("*")
    .eq("code", code.toUpperCase())
    .single();

  if (codeError || !linkCode) {
    return NextResponse.json({ error: "Invalid link code" }, { status: 400 });
  }

  // Check if expired
  if (new Date(linkCode.expires_at) < new Date()) {
    // Delete expired code
    await supabase.from("discord_link_codes").delete().eq("id", linkCode.id);
    return NextResponse.json({ error: "Link code has expired" }, { status: 400 });
  }

  // Check if already linked
  const { data: existingLink } = await supabase
    .from("discord_accounts")
    .select("id")
    .eq("discord_id", linkCode.discord_id)
    .single();

  if (existingLink) {
    // Delete the link code
    await supabase.from("discord_link_codes").delete().eq("id", linkCode.id);
    return NextResponse.json({ error: "This Discord account is already linked" }, { status: 400 });
  }

  // Create the link
  const { error: linkError } = await supabase.from("discord_accounts").insert({
    user_id: user.id,
    discord_id: linkCode.discord_id,
    linked_at: new Date().toISOString(),
  });

  if (linkError) {
    console.error("Failed to link Discord account:", linkError);
    return NextResponse.json({ error: "Failed to link account" }, { status: 500 });
  }

  // Delete the link code
  await supabase.from("discord_link_codes").delete().eq("id", linkCode.id);

  return NextResponse.json({ success: true, message: "Discord account linked successfully" });
}
